// Diretório
const rootDIR = process.env.ROOT;
const folders = ['sns', 'dir', 'mtd', 'eqp']
// const DIR = "/mnt/fcir";
import monitoring_files from "../../../../shared/utils/variables_api/monitoring-variables";

// import { readAllDirs } from '../../../../shared/utils/readAndOrganizeFiles'

class AlertLoop {
    constructor(NotificationService,readAllDirs) {
        this.NotificationService = NotificationService
        this.readAllDirs=readAllDirs
    }
    StartMonitoring() {
        setTimeout(() => {
            this.readAllDirs(rootDIR, folders)
                .then(files => {
                    // Torna disponível para toda a aplicação
                    monitoring_files.files = files
                    return files

                })
                .then((files) => {
                    //Organizar os arquivos para leitura local 
                    let only_files = []
                    for (let items of Object.values(files)) {
                        if (items.length) {
                            items.forEach(file => {
                                only_files.push(file)
                            });
                        }
                    }
                    return only_files
                })
                .then((monit_files) => this.NotificationService(monit_files))
                .catch((err) => console.log(err))
                .then(() => this.StartMonitoring());
        }, 2000);
    }
}

export { AlertLoop }