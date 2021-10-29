import { AppErrors } from "../../../../shared/errors/AppErrors"

class DeleteNotifUseCase {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository
    }

    async execute(id) {
        const notification = await this.notificationRepository.findById(id)
        if (!notification) {
            throw new AppErrors('Notification not exists')
        }
        await this.notificationRepository.deleteById(id)
    }

}

export { DeleteNotifUseCase }