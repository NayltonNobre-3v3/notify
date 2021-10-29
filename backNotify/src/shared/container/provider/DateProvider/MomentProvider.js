import moment from "moment-timezone";


class MomentProvider {
    convertToTz(date) {
        return moment(moment(date)).tz("America/Fortaleza")
            .format("DD/MM/YYYY  HH:mm:ss")
    }
    convertUnix(date){
        return moment(date).unix()
    }
    compareInMinutes(start,end){
        return this.convertUnix(start)-this.convertUnix(end)
    }
}
export default new MomentProvider()