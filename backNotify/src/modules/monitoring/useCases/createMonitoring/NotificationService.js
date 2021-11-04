// import MailProvider from "../../../../shared/container/provider/MailProvider";
import { NotificationRepository } from "../../../notifications/infra/Knex/repositories/NotificationRepository";
import { monitoring } from "./monitoringFiles/MonitFiles";
let current_date = Date.now();

async function NotificationService(monit_files) {
    const notificationRepository = new NotificationRepository();
    const notifications = await notificationRepository.show();
    for (let alert of notifications) {
        current_date = Date.now();
        switch (alert.TYPE) {
            case "sns":
                monitoring.Sensor.startMonitoring(monit_files,alert,current_date)
                break;
            case "dir":
                monitoring.Dir.startMonitoring(monit_files,alert,current_date)
                break;
            case "eqp":
                monitoring.Eqp.startMonitoring(monit_files,alert,current_date)
                break;
            case "mtd":
                monitoring.Mtd.startMonitoring(monit_files,alert,current_date)
                break;

            default:
                break;
        }
    }
}



export { NotificationService };
