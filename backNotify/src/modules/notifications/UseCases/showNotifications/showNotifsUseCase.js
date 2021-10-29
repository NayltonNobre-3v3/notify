import { AppErrors } from "../../../../shared/errors/AppErrors"

class ShowNotifsUseCase {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository
    }

    async execute() {
        const notifications = await this.notificationRepository.show()
        return notifications
    }

}

export { ShowNotifsUseCase }