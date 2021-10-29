import {ShowNotifsController} from './showNotifsController'
import {ShowNotifsUseCase} from './showNotifsUseCase'
import {NotificationRepository} from '../../infra/Knex/repositories/NotificationRepository'

export default ()=>{
    const notificationRepository=new NotificationRepository()
    const showNotifsUseCase=new ShowNotifsUseCase(notificationRepository)
    const showNotifsController=new ShowNotifsController(showNotifsUseCase)
    return showNotifsController
}