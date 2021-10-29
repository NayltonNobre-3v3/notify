class CreateNofitController {
    constructor(createNotifUseCase){
        this.createNotifUseCase=createNotifUseCase
    }
    async handle(Request, Response) {
        const {
            TIME,
            VALUE,
            NAME,
            UNIT,
            ID_SENSOR,
            EMAIL,
            NOTE,
            MEDITION_TYPE,
            CONDITION,
            POSITION,
        } = Request.body;
        await this.createNotifUseCase.execute({
            TIME,
            VALUE,
            NAME,
            UNIT,
            ID_SENSOR,
            EMAIL,
            NOTE,
            MEDITION_TYPE,
            CONDITION,
            POSITION,
        })
        return Response.status(201).json({msg:"Notification created successfully"});
        
    }
}

export {CreateNofitController}