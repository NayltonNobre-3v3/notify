import {Router} from 'express'

import showMonitFiles from '../../../../modules/monitoring/useCases/showMonitoringFiles'

const monitRouter=Router()

monitRouter.get('/files',(req,res)=>{
    return showMonitFiles().handle(req,res)
})

export{monitRouter}