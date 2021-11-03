import { AppErrors } from '../../../../shared/errors/AppErrors';
class CreateNotifUseCase{
    constructor(notificationRepository){
        this.notificationRepository=notificationRepository
    }

    async execute({
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
    }){

        try {
            await this.notificationRepository.create({
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
        } catch (error) {
            console.log('createNofifUseCase -> execute : ',error)
            throw new AppErrors('Error in create notification')
        }
    }

}

export {CreateNotifUseCase}