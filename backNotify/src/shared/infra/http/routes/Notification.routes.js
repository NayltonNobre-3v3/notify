import createNotification from '../../../../modules/notifications/UseCases/createNotification'
import showNotifications from '../../../../modules/notifications/UseCases/showNotifications'
import showNotification from '../../../../modules/notifications/UseCases/showNotification'
import deleteNotification from '../../../../modules/notifications/UseCases/deleteNotification'
import updateNotification from '../../../../modules/notifications/UseCases/updateNotification'
import {Router} from 'express'

const notifRouter=Router()

notifRouter.post('/notify/post-alert',(req,resp)=>{
    return createNotification().handle(req,resp)
})
notifRouter.get('/notify/alert',(req,resp)=>{
    return showNotifications().handle(req,resp)
})
notifRouter.get('/notify/alert/:id',(req,resp)=>{
    return showNotification().handle(req,resp)
})
notifRouter.delete('/notify/alert/:id',(req,resp)=>{
    return deleteNotification().handle(req,resp)
})
notifRouter.put('/notify/alert/:id',(req,resp)=>{
    return updateNotification().handle(req,resp)
})
export {notifRouter}