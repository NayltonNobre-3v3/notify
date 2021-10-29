import MailProvider from "../../../../shared/container/provider/MailProvider";
import { NotificationRepository } from '../../../notifications/infra/Knex/repositories/NotificationRepository'
import MomentProvider from '../../../../shared/container/provider/DateProvider/MomentProvider'
import { resolve } from 'path'
// Array momentâneo no qual irá guardar os dados que estão na condição especificada
let off_range_files = [];
let current_date = Date.now();
let template_path = resolve(__dirname, '..', '..', '..', 'notifications', 'Views', 'emails', 'sensorAlert.hbs')


async function NotificationService(monit_files) {
    const notificationRepository = new NotificationRepository()
    const notifications = await notificationRepository.show()
    const check = checkConditions()
    for (let alert of notifications) {
        // file -> Arquivo lido do json
        //alert-> arquivo do banco de dados
        const file = monit_files.find(file => file.ID === alert.ID_SENSOR);
        current_date = Date.now();
        if (!file) {
            console.log("NotificationService -> File not found")
            continue
        }
        switch (alert.CONDITION) {
            case "ACIMA":
                check.up(file, alert)
                break;
            case "ABAIXO":
                check.down(file, alert)
                break;

            default:
                break;
        }
    }
}

function checkConditions() {
    function addToRange(data) {
        off_range_files.push(data)
    }
    function removeFromRange(include) {
        let file=off_range_files[include]
        if (include >= 0 && file.SEND_EMAIL === true) {
            const filteredItems = off_range_files.filter((item) => {
                return item.ID !== file.ID;
            });
            off_range_files = filteredItems;
        }
    }
    function updateOffRangeFiles(file,alert){
        off_range_files.map(
            (e) => (e.VALUE_JSON = file.VALUE[alert.POSITION])
        );
    }
    async function verifyOffRangeFiles(repeatItem, alert, current_date, file) {
        let file_off_range=off_range_files[repeatItem]
        // Calcula a variação de tempo (minutos) em que o arquivo está acima ou abaixo da condição
        // estabelecida pelo o usuário
        let variation = MomentProvider.compareInMinutes(current_date, file_off_range.OFF_RANGE_DATE)
        // Se a variação do tempo do arquivo que está na condição  estabelecida para o alarme 
        //for maior do que o tempo especificado no banco
        if (variation > file_off_range.TIME_ALERT) {
            if (file_off_range.SEND_EMAIL === false) {
                await MailProvider.sendMail({
                    to: file_off_range.EMAIL,
                    subject: "Alertas da 3v3",
                    template_path,
                    context: {
                        sensorName: file.NAME,
                        cond: file_off_range.CONDITION,
                        value: file_off_range.VALUE,
                        medition_type: file_off_range.MEDITION_TYPE,
                        value_json: file_off_range.VALUE_JSON,
                        unit: file_off_range.UNIT,
                        start: MomentProvider.convertToTz(file_off_range.OFF_RANGE_DATE),
                        end: MomentProvider.convertToTz(current_date),
                    },
                })
                // Marca que enviou o email
                file_off_range.SEND_EMAIL = true;
                console.log(`CONDIÇÃO: ${file_off_range.CONDITION}, EMAIL ENVIADO PARA -> ${file_off_range.EMAIL}`);
                console.log(file_off_range);
            }
        }
        // Se já existir e o valor do json for alterado (atualizado) irá atualizar o VALUE do array off_range_files
        updateOffRangeFiles(file,alert)
    }
    return {
        async up(file, alert) {
            let include = null
            // Arquivo com valor específico acima do que está no banco
            if (file.VALUE[alert.POSITION] > alert.VALUE) {
                // índice do arquivo que está na condição para ser monitorado e alertado
                include = off_range_files.findIndex((off_range) => {
                    return off_range.ID === alert.ID;
                });
                if (include < 0) {
                    addToRange({
                        ID: alert.ID,
                        ID_SENSOR: alert.ID_SENSOR,
                        CONDITION: alert.CONDITION,
                        //Se foi enviado o e-mail ou não
                        SEND_EMAIL: false,
                        //Registra o tempo que chegou na condição
                        OFF_RANGE_DATE: current_date,
                        VALUE: alert.VALUE,
                        //   VALOR ATUAL DO SENSOR
                        VALUE_JSON: file.VALUE[alert.POSITION],
                        MEDITION_TYPE: alert.MEDITION_TYPE,
                        UNIT: alert.UNIT,
                        TIME_ALERT: alert.TIME,
                        POSITION: alert.POSITION,
                        EMAIL: alert.EMAIL,
                        NAME: alert.NAME,
                        CREATED_ALERT: alert.CREATED_AT,
                    });
                }
                // Se existir e nÃ£o tive enviado o email entÃo calcula o tempo que está naquela condição esperada
                else if (include >= 0) {
                    verifyOffRangeFiles(include, alert, current_date, file)
                }
            }

            //Se sair da faixa dos valores da condição ACIMA então irá apagar o registro do off_range_files
            // OBS: irá apagar somente o valor que sair da faixa, condição muito específica
            else {
                include = off_range_files.findIndex((off_range) => {
                    return (
                        off_range.ID === alert.ID
                    );
                });
                removeFromRange(include)

            }
        },
        async down(file, alert) {
            let include = null
            if (file.VALUE[alert.POSITION] < alert.VALUE) {
                include = off_range_files.findIndex((off_range) => {
                    return off_range.ID === alert.ID;
                });
                if (include < 0) {
                    addToRange({
                        ID: alert.ID,
                        ID_SENSOR: alert.ID_SENSOR,
                        CONDITION: alert.CONDITION,
                        SEND_EMAIL: false,
                        OFF_RANGE_DATE: current_date,
                        VALUE: alert.VALUE,
                        VALUE_JSON: file.VALUE[alert.POSITION],
                        MEDITION_TYPE: alert.MEDITION_TYPE,
                        UNIT: alert.UNIT,
                        TIME_ALERT: alert.TIME,
                        POSITION: alert.POSITION,
                        EMAIL: alert.EMAIL,
                        NAME: alert.NAME,
                        CREATED_ALERT: alert.CREATED_AT,
                    });
                }
                else if (include >= 0) {
                    verifyOffRangeFiles(include, alert, current_date, file)
                }
            }
            else {
                include = off_range_files.findIndex((off_range) => {
                    return (
                        off_range.ID === alert.ID
                    );
                });
                removeFromRange(include)

            }
        }
    }
}

export { NotificationService }