class UpdateNotifController {
    constructor(updateNotifUseCase) {
        this.updateNotifUseCase = updateNotifUseCase
    }
    async handle(Request, Response) {
        const { id } = Request.params
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
        await this.updateNotifUseCase.execute({
            ID: id,
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
        return Response.status(200).json({ msg: "Notification Updated successfully" });

    }
}

export { UpdateNotifController }