export class AppErrors{
    statusCode=null
    errorMsg=""
    constructor(msg,status=400){
        this.statusCode=status
        this.errorMsg=msg
    }
}

