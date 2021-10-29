import {Router} from 'express'

import showMonitFiles from '../../../../modules/monitoring/useCases/showMonitoringFiles'

const monitRouter=Router()

monitRouter.get('/monit',(req,res)=>{
    return showMonitFiles().handle(req,res)
})

export{monitRouter}