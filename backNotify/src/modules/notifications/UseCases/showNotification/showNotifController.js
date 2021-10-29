class ShowNotifController {
    constructor(showNotifUseCase) {
        this.showNotifUseCase = showNotifUseCase
    }
    async handle(Request, Response) {
        const { id } = Request.params
        const notification = await this.showNotifUseCase.execute(id)
        return Response.status(200).json(notification);
    }
}

export { ShowNotifController }