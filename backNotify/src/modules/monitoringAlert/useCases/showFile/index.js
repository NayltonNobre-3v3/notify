import {ShowFileController} from './showFileController'
import {ShowFileUseCase} from './showFileUseCase'

export default ()=>{
    const showFileUseCase=new ShowFileUseCase()
    const showFileController=new ShowFileController(showFileUseCase)
    return showFileController
}