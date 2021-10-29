import monitoringApi from "../shared/utils/variables_api/monitoring-variables";

export default class SensorsController {
  async getSensors(Request, Response) {
    try {
      let data = [];
      if (monitoringApi.files.sns.length > 0) {
        monitoringApi.files.sns.map((e) => {
          data.push(e);
        });
      } else {
        data = [];
      }
      return Response.status(200).json(data);
    } catch (error) {
      console.log('SensorController -> Error ao tentar carregar sensores')
      return Response.status(500).json(error);
    }
  }
  async getSensor(Request, Response) {
    const {id}=Request.params
    let data = [];
    monitoringApi.files.sns.map((e) => {
      data.push(e);
    });
    const filter = data.filter((e) => e.ID === Number(id));

    return Response.status(200).json(filter);
  }
}
