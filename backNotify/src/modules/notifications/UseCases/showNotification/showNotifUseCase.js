import { AppErrors } from "../../../../shared/errors/AppErrors"

class ShowNotifUseCase {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository
    }

    async execute(id) {
        const notification = await this.notificationRepository.findById(id)
        return notification
    }

}

export { ShowNotifUseCase }