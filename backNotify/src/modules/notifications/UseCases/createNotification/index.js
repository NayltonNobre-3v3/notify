import {CreateNofitController} from './createNotifController'
import {CreateNotifUseCase} from './createNotifUseCase'
import {NotificationRepository} from '../../infra/Knex/repositories/NotificationRepository'

export default ()=>{
    const notificationRepository=new NotificationRepository()
    const createNofifUseCase=new CreateNotifUseCase(notificationRepository)
    const createNofitController=new CreateNofitController(createNofifUseCase)
    return createNofitController
}