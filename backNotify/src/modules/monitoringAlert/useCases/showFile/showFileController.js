class ShowFileController {
    constructor(showFileUseCase){
        this.showFileUseCase=showFileUseCase
    }
    handle(Request, Response) {

        try {
            const {id}=Request.params
            const {type}=Request.query
            const file=this.showFileUseCase.execute(id,type)
            return Response.status(200).json(file);

        } catch (error) {
            console.log('ShowFileController -> handle : ',error)
            return Response.status(400).json({ msg: error.message });
        }
        
    }
}

export {ShowFileController}