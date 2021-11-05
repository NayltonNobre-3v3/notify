import {Router} from 'express'

import showMonitFiles from '../../../../modules/monitoringAlert/useCases/showMonitoringFiles'

const monitRouter=Router()

monitRouter.get('/files',(req,res)=>{
    return showMonitFiles().handle(req,res)
})

export{monitRouter}