import {Router} from 'express'

import showMonitFiles from '../../../../modules/monitoringAlert/useCases/showMonitoringFiles'
import showMonitFile from '../../../../modules/monitoringAlert/useCases/showFile'
import showOffRangeFiles from '../../../../modules/monitoringAlert/useCases/showOffRangeFiles'

const monitRouter=Router()

monitRouter.get('/files',(req,res)=>{
    return showMonitFiles().handle(req,res)
})

monitRouter.get('/file/:id',(req,res)=>{
    return showMonitFile().handle(req,res)
})

monitRouter.get('/off_range',(req,res)=>{
    return showOffRangeFiles().handle(req,res)
})

export{monitRouter}