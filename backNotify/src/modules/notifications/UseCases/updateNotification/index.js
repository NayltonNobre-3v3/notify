import {UpdateNotifController} from './updateNotifController'
import {UpdateNotifUseCase} from './updateNotifUseCase'
import {NotificationRepository} from '../../infra/Knex/repositories/NotificationRepository'

export default ()=>{
    const notificationRepository=new NotificationRepository()
    const updateNotifUseCase=new UpdateNotifUseCase(notificationRepository)
    const updateNotifController=new UpdateNotifController(updateNotifUseCase)
    return updateNotifController
}