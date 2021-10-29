import MailProvider from "../../../../shared/container/provider/MailProvider";
import { NotificationRepository } from '../../../notifications/infra/Knex/repositories/NotificationRepository'
import MomentProvider from '../../../../shared/container/provider/DateProvider/MomentProvider'
import { resolve } from 'path'
// Array momentâneo no qual irá guardar os dados que estão na condição especificada
let off_range_sensors = [];
let current_date = Date.now();
let template_path = resolve(__dirname, '..', '..', '..', 'notifications', 'Views', 'emails', 'sensorAlert.hbs')


async function NotificationService(monit_files) {
    const notificationRepository = new NotificationRepository()
    const notifications = await notificationRepository.show()
    const check = checkConditions()
    for(let notif of notifications){
        const sensor = monit_files.find(sensor => sensor.ID === notif.ID_SENSOR);
        current_date = Date.now();
        if (!sensor) {
            console.log("NotificationService -> Sensor not found")
            continue
        }
        switch (notif.CONDITION) {
            case "ACIMA":
                check.up(sensor, notif)
                break;
            case "ABAIXO":
                check.down(sensor, notif)
                break;

            default:
                break;
        }
    }
}

function checkConditions() {
    return {
        async up(sensor, notif) {
            let include=null
            // Sensor com valor específico acima do que está no banco
            if (sensor.VALUE[notif.POSITION] > notif.VALUE) {
                // Verificar se existe ou não os valores no array de sensores
                //  que satisfazem tal condição
                include = off_range_sensors.findIndex((off_range) => {
                    return off_range.ID === notif.ID;
                });
                // Se nÃ£o existir no array irá adicioanar o sensor dentro da especificação
                if (include < 0) {
                    off_range_sensors.push({
                        ID: notif.ID,
                        ID_SENSOR: notif.ID_SENSOR,
                        CONDITION: notif.CONDITION,
                        //Se foi enviado o e-mail ou não
                        email: false,
                        time: current_date,
                        VALUE: notif.VALUE,
                        //   VALOR ATUAL DO SENSOR
                        VALUE_JSON: sensor.VALUE[notif.POSITION],
                        MEDITION_TYPE: notif.MEDITION_TYPE,
                        UNIT: notif.UNIT,
                        TIME: notif.TIME,
                        POS: notif.POSITION,
                        EMAIL: notif.EMAIL,
                        NAME: notif.NAME,
                        CREATED_NOTIF: notif.CREATED_AT,
                    });
                }
                // Se existir e nÃ£o tive enviado o email entÃ£o calculo o tempo
                else if (include >= 0) {
                    // Pego o meu horário atual e subtraio com o horário que estão no array
                    const repeatItem = off_range_sensors.findIndex(
                        (repeat) => repeat.ID === notif.ID
                    );
                    let variacao = MomentProvider.compareInMinutes(current_date, off_range_sensors[repeatItem].time)
                    // Se estiver acima do valor que estÃ¡ no banco
                    if (variacao > notif.TIME) {
                        // Mudar a variável email para true
                        // Se não tiver enviado o email
                        if (off_range_sensors[repeatItem].email === false) {
                            await MailProvider.sendMail({
                                to: notif.EMAIL,
                                subject: "Alerta de sensor! 3v3",
                                template_path,
                                context: {
                                    sensorName: sensor.NAME,
                                    cond: notif.CONDITION,
                                    value: notif.VALUE,
                                    medition_type: notif.MEDITION_TYPE,
                                    VALUE_JSON: sensor.VALUE[notif.POSITION],
                                    unit: notif.UNIT,
                                    start: MomentProvider.convertToTz(off_range_sensors[repeatItem].time),
                                    end: MomentProvider.convertToTz(current_date)
                                },
                            })
                            // Marco que enviei o email
                            off_range_sensors[repeatItem].email = true;
                            console.log("Condição acima -> EMAIL ENVIADO PARA -> ", off_range_sensors[repeatItem].EMAIL);
                            console.log(off_range_sensors[repeatItem]);
                        }
                    }
                    // Se já existir e o valor do json for alterado (atualizado) irá atualizar o VALUE do array off_range_sensors
                    off_range_sensors.map(
                        (e) => (e.VALUE_JSON = sensor.VALUE[notif.POSITION])
                    );
                }
            }

            //Se sair da faixa dos valores da condição ACIMA então irá apagar o registro do off_range_sensors
            // OBS: irá apagar somente o valor que sair da faixa, condição muito específica
            else {
                include = off_range_sensors.findIndex((off_range) => {
                    return (
                        off_range.ID === notif.ID
                    );
                });

                if (
                    include >= 0 &&
                    off_range_sensors[include].email === true
                ) {
                    const filteredItems = off_range_sensors.filter((item) => {
                        return item.UID !== off_range_sensors[include].UID;
                    });
                    off_range_sensors = filteredItems;
                }
                return;
            }
        },
        async down(sensor, notif) {
            let include=null
            // Sensor com valor específico acima do que está no banco
            if (sensor.VALUE[notif.POSITION] < notif.VALUE) {
                // Verificar se existe ou não os valores no array de sensores
                //  que satisfazem tal condição
                include = off_range_sensors.findIndex((off_range) => {
                    return off_range.ID === notif.ID;
                });
                // Se nÃ£o existir no array irá adicioanar o sensor dentro da especificação
                if (include < 0) {
                    off_range_sensors.push({
                        ID: notif.ID,
                        ID_SENSOR: notif.ID_SENSOR,
                        CONDITION: notif.CONDITION,
                        //Se foi enviado o e-mail ou não
                        email: false,
                        time: current_date,
                        VALUE: notif.VALUE,
                        //   VALOR ATUAL DO SENSOR
                        VALUE_JSON: sensor.VALUE[notif.POSITION],
                        MEDITION_TYPE: notif.MEDITION_TYPE,
                        UNIT: notif.UNIT,
                        TIME: notif.TIME,
                        POS: notif.POSITION,
                        EMAIL: notif.EMAIL,
                        NAME: notif.NAME,
                        CREATED_NOTIF: notif.CREATED_AT,
                    });
                }
                // Se existir e nÃ£o tive enviado o email entÃ£o calculo o tempo
                else if (include >= 0) {
                    // Pego o meu horário atual e subtraio com o horário que estão no array
                    const repeatItem = off_range_sensors.findIndex(
                        (repeat) => repeat.ID === notif.ID
                    );

                    let variacao = MomentProvider.compareInMinutes(current_date, off_range_sensors[repeatItem].time)
                    // Se estiver acima do valor que estÃ¡ no banco
                    if (variacao > notif.TIME) {
                        // Mudar a variável email para true
                        // Se não tiver enviado o email
                        if (off_range_sensors[repeatItem].email === false) {
                            await MailProvider.sendMail({
                                to: notif.EMAIL,
                                subject: "Alerta de sensor! 3v3",
                                template_path,
                                context: {
                                    sensorName: sensor.NAME,
                                    cond: notif.CONDITION,
                                    value: notif.VALUE,
                                    medition_type: notif.MEDITION_TYPE,
                                    VALUE_JSON: sensor.VALUE[notif.POSITION],
                                    unit: notif.UNIT,
                                    start: MomentProvider.convertToTz(off_range_sensors[repeatItem].time),
                                    end: MomentProvider.convertToTz(current_date),
                                },
                            })
                            // Marco que enviei o email
                            off_range_sensors[repeatItem].email = true;
                            console.log("Condição abaixo -> EMAIL ENVIADO PARA -> ", off_range_sensors[repeatItem].EMAIL);
                            console.log(off_range_sensors[repeatItem]);
                        }
                    }
                    off_range_sensors.map(
                        (e) => (e.VALUE_JSON = sensor.VALUE[notif.POSITION])
                    );
                }
            }

            //Se sair da faixa dos valores da condição ACIMA então irá apagar o registro do off_range_sensors
            // OBS: irá apagar somente o valor que sair da faixa, condição muito específica
            else {
                const include = off_range_sensors.findIndex((off_range) => {
                    return (
                        off_range.ID === notif.ID
                    );
                });

                if (
                    include >= 0 &&
                    off_range_sensors[include].email === true
                ) {
                    const filteredItems = off_range_sensors.filter((item) => {
                        return item.UID !== off_range_sensors[include].UID;
                    });
                    off_range_sensors = filteredItems;
                }
                return;
            }
        }
    }
}

export { NotificationService }