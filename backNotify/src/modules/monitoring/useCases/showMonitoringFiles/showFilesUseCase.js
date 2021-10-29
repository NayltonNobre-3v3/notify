import monitoringApi from "../../../../shared/utils/variables_api/monitoring-variables";
class ShowMonitoringFilesUseCase {
    constructor() { }

    execute() {
        try {
            if (monitoringApi.files) {
                return monitoringApi.files
            } 
            return [];
        } catch (error) {
            console.log('ShowMonitoringFilesUseCase -> execute : ', error)
            throw error
        }
    }

}

export { ShowMonitoringFilesUseCase }