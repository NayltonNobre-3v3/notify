class ShowSensorController {
    constructor(showSensorUseCase){
        this.showSensorUseCase=showSensorUseCase
    }
    handle(Request, Response) {

        try {
            const {id}=Request.params
            const notification=this.showSensorUseCase.execute(id)
            return Response.status(200).json(notification);

        } catch (error) {
            console.log('ShowSensorController -> handle : ',error)
            return Response.status(400).json({ msg: error.message });
        }
        
    }
}

export {ShowSensorController}