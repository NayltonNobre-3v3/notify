import {Router} from 'express'

import {monitRouter} from './Monit.routes'
import {notifRouter} from './Notification.routes'

const router=Router()

router.use('/monit',monitRouter)
router.use('/notify',notifRouter)

export {router}