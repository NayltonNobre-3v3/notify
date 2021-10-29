class ShowNotifsController {
    constructor(showNotifsUseCase) {
        this.showNotifsUseCase = showNotifsUseCase
    }
    async handle(Request, Response) {
        const notifications = await this.showNotifsUseCase.execute()
        return Response.status(200).json(notifications);
    }
}

export { ShowNotifsController }