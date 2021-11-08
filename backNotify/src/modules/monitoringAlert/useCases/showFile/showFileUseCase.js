import monitoringApi from "../../../../shared/utils/variables_api/monitoring-variables";
class ShowFileUseCase {
    constructor() { }

    execute(id,type) {
        try {
            let data = [];
            monitoringApi.files[type].map((e) => {
                data.push(e);
            });
            const filter = data.filter((e) => e.ID === Number(id));
            return filter
        } catch (error) {
            console.log('ShowFileUseCase -> execute : ', error)
            throw error
        }
    }

}

export { ShowFileUseCase }