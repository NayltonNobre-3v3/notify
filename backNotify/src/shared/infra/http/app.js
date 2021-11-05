import express from "express";
import cors from "cors";
import 'express-async-errors'
import { router } from "./routes/routes";
import { AppErrors } from '../../errors/AppErrors';
import { alertLoop } from "../../../modules/monitoringAlert/useCases/createAlertMonitoring";


class Notify {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.Monit()
  }
  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    // Capturar erros das requisições
    this.app.use((error, Request, Response, next) => {
      if (error instanceof AppErrors) {
        return Response.status(error.statusCode).json({ msg: error.errorMsg })
      }
      console.log(error)
      return Response.status(500).json({ msg: 'Internal error' })
    })
  }
  routes() {
    this.app.use(router);
  }
  set listen(PORT) {
    this.app.listen(PORT, () => {
      console.log(
        `%c RUNNING IN http://localhost:${PORT}`,
        "background: #222; color: #bada55"
      );
    });
  }
  Monit() {
    alertLoop.StartMonitoring()
  }


}
export default new Notify();
