import { AppErrors } from "../../../../shared/errors/AppErrors"

class UpdateNotifUseCase {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository
    }

    async execute({
        ID,
        TIME,
        VALUE,
        NAME,
        // UNIT,
        ID_REF,
        TYPE,
        EMAIL,
        NOTE,
        MEDITION_TYPE,
        CONDITION,
        POSITION,
    }) {
        const notification=await this.notificationRepository.findById(id)
        if(!notification){
            throw new AppErrors('Error in update Notification')
        }
        await this.notificationRepository.put({
            ID,
            TIME,
            VALUE,
            NAME,
            // UNIT,
            ID_REF,
            TYPE,
            EMAIL,
            NOTE,
            MEDITION_TYPE,
            CONDITION,
            POSITION,
        })

    }

}

export { UpdateNotifUseCase }