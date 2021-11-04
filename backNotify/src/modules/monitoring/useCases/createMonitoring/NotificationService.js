// import MailProvider from "../../../../shared/container/provider/MailProvider";
import { NotificationRepository } from "../../../notifications/infra/Knex/repositories/NotificationRepository";
import MomentProvider from "../../../../shared/container/provider/DateProvider/MomentProvider";
import { resolve } from "path";
// Array momentâneo no qual irá guardar os dados que estão na condição especificada

let current_date = Date.now();
// let template_path = resolve(
//     __dirname,
//     "..",
//     "..",
//     "..",
//     "notifications",
//     "Views",
//     "emails",
//     "sensorAlert.hbs"
// );

async function NotificationService(monit_files) {
    const notificationRepository = new NotificationRepository();
    const notifications = await notificationRepository.show();
    for (let alert of notifications) {
        current_date = Date.now();
        // file -> Arquivo lido do json
        //alert-> arquivo do banco de dados
        
        switch (alert.TYPE) {
            case "sns":
                monitSns(monit_files,alert,current_date)
                break;
            case "dir":
                break;
            case "eqp":
                break;
            case "mtd":
                // check.down(file, alert);
                break;

            default:
                break;
        }
    }
}








async function verifyOffRangeFiles(repeatItem, alert, current_date, file) {
    let file_off_range = off_range_files[repeatItem];
    // Calcula a variação de tempo (minutos) em que o arquivo está acima ou abaixo da condição
    // estabelecida pelo o usuário
    let variation = MomentProvider.compareInMinutes(
        current_date,
        file_off_range.OFF_RANGE_DATE
    );
    console.log(off_range_files);
    console.log(`VARIATION do ${alert.ID} -> ${variation}`);
    // Se a variação do tempo do arquivo que está na condição  estabelecida para o alarme
    //for maior do que o tempo especificado no banco
    if (variation > file_off_range.TIME_ALERT) {
        if (file_off_range.SEND_EMAIL === false) {
            // await MailProvider.sendMail({
            //     to: file_off_range.EMAIL,
            //     subject: "Alertas da 3v3",
            //     template_path,
            //     context: {
            //         file_name: file.NAME,
            //         condition: file_off_range.CONDITION,
            //         value: file_off_range.VALUE,
            //         medition_type: file_off_range.MEDITION_TYPE,
            //         value_json: file_off_range.VALUE_JSON,
            //         unit: file_off_range.UNIT,
            //         start: MomentProvider.convertToTz(file_off_range.OFF_RANGE_DATE),
            //         end: MomentProvider.convertToTz(current_date),
            //     },
            // })

            console.log(`----- EMAIL ---------- `, {
                file_name: file.NAME,
                condition: file_off_range.CONDITION,
                value: file_off_range.VALUE,
                medition_type: file_off_range.MEDITION_TYPE,
                value_json: file_off_range.VALUE_JSON,
                // unit: file_off_range.UNIT,
                start: MomentProvider.convertToTz(file_off_range.OFF_RANGE_DATE),
                end: MomentProvider.convertToTz(current_date),
            });

            // Marca que enviou o email
            file_off_range.SEND_EMAIL = true;
            
            console.log(
                `CONDIÇÃO: ${file_off_range.CONDITION}, EMAIL ENVIADO PARA -> ${file_off_range.EMAIL}`
            );
            console.log(file_off_range);
        }
    }
    // Se já existir e o valor do json for alterado (atualizado) irá atualizar o VALUE do array off_range_files
    updateOffRangeFiles(file, alert);
}



export { NotificationService };
