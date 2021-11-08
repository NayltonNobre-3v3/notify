import { ShowOffRangeController } from "./showOffRangeController"
import { ShowOffRangeUseCase } from "./showOffRangeUseCase"

export default ()=>{
    const showOffRangeUseCase=new ShowOffRangeUseCase()
    const showOffRangeController=new ShowOffRangeController(showOffRangeUseCase)
    return showOffRangeController

}