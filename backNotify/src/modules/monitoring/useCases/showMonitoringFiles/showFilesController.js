class ShowMonitoringFilesController {
    constructor(showMonitoringFilesUseCase){
        this.showMonitoringFilesUseCase=showMonitoringFilesUseCase
    }
    handle(Request, Response) {

        try {
            const monitoring=this.showMonitoringFilesUseCase.execute()
            return Response.status(200).json(monitoring);

        } catch (error) {
            console.log('ShowMonitoringFilesController -> handle : ',error)
            return Response.status(400).json({ msg: error.message });
        }
        
    }
}

export {ShowMonitoringFilesController}