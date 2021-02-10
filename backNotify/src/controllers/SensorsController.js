import api from "../variables_api/monitoring-variables";
import { Request, Response } from "express";

export default class SensorsController {
  async getSensors(Request, Response) {
    try {
      let data = [];
      if (api.sensorMonitoring.length > 0) {
        api.sensorMonitoring.map((e) => {
          data.push(e);
        });
      } else {
        data = [];
      }
      return Response.status(200).json(data);
    } catch (error) {
      return Response.status(500).json(error);
    }
  }
  async getSensor(Request, Response) {
    let data = [];
    api.sensorMonitoring.map((e) => {
      data.push(e);
    });
    const filter = data.filter((e) => e.ID === Number(req.params.id));

    return Response.status(200).json(filter);
  }
}
