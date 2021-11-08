export class ShowOffRangeController{
    constructor(showOffRangeUseCase){
        this.showOffRangeUseCase=showOffRangeUseCase
    }
    handle(req,res){
        const off_range=this.showOffRangeUseCase.execute()
        return res.status(200).json(off_range)
    }
}