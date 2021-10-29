class DeleteNotifController {
    constructor(deleteNotifUseCase) {
        this.deleteNotifUseCase = deleteNotifUseCase
    }
    async handle(Request, Response) {
        const { id } = Request.params
        await this.deleteNotifUseCase.execute(id)
        return Response.status(200).json({ msg: "Notification deleted successfully" });
    }
}

export { DeleteNotifController }