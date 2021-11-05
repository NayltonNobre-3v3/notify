import {ShowMonitoringFilesController} from './showFilesController'
import {ShowMonitoringFilesUseCase} from './showFilesUseCase'


export default ()=>{
    const showMonitoringFilesUseCase=new ShowMonitoringFilesUseCase()
    const showMonitoringFilesController=new ShowMonitoringFilesController(showMonitoringFilesUseCase)
    return showMonitoringFilesController
}