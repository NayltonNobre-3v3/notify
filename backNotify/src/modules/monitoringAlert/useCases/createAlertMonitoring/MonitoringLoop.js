// Diretório
const rootDIR = process.env.ROOT;
const folders = ['sns', 'dir', 'mtd', 'eqp']
import monitoring_files from "../../../../shared/utils/variables_api/monitoring-variables";
class AlertLoop {
    constructor(AlertUseCase,readAllDirs) {
        this.AlertUseCase = AlertUseCase
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
                .then((monit_files) => this.AlertUseCase(monit_files))
                .catch((err) => console.log(err))
                .then(() => this.StartMonitoring());
        }, 2000);
    }
}

export { AlertLoop }