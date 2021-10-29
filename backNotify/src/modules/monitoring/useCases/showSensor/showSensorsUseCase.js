import monitoringApi from "../../../../shared/utils/variables_api/monitoring-variables";
class ShowSensorUseCase {
    constructor() { }

    execute(id) {
        try {
            let data = [];
            monitoringApi.files.sns.map((e) => {
                data.push(e);
            });
            const filter = data.filter((e) => e.ID === Number(id));
            return filter
        } catch (error) {
            console.log('ShowSensorUseCase -> execute : ', error)
            throw error
        }
    }

}

export { ShowSensorUseCase }