import {ShowNotifController} from './showNotifController'
import {ShowNotifUseCase} from './showNotifUseCase'
import {NotificationRepository} from '../../infra/Knex/repositories/NotificationRepository'

export default ()=>{
    const notificationRepository=new NotificationRepository()
    const showNotifUseCase=new ShowNotifUseCase(notificationRepository)
    const showNotifController=new ShowNotifController(showNotifUseCase)
    return showNotifController
}