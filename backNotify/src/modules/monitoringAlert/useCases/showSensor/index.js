import {ShowSensorController} from './showSensorController'
import {ShowSensorUseCase} from './showSensorsUseCase'

export default ()=>{
    const showSensorUseCase=new ShowSensorUseCase()
    const showSensorController=new ShowSensorController(showSensorUseCase)
    return showSensorController
}