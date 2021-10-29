import {DeleteNotifController} from './deleteNotifController'
import {DeleteNotifUseCase} from './deleteNotifUseCase'
import {NotificationRepository} from '../../infra/Knex/repositories/NotificationRepository'

export default ()=>{
    const notificationRepository=new NotificationRepository()
    const deleteNotifUseCase=new DeleteNotifUseCase(notificationRepository)
    const deleteNotifController=new DeleteNotifController(deleteNotifUseCase)
    return deleteNotifController
}