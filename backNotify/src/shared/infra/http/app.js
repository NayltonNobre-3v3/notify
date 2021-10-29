import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import 'express-async-errors'
// import route from "./routes/routes";
import { notifRouter} from "./routes/Notification.routes";
import { monitRouter} from "./routes/Monit.routes";

// import path from "path";
import { AppErrors } from '../../errors/AppErrors';
import {alertLoop} from "../../../modules/monitoring/useCases/createMonitoring";


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
    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.app.use((error, Request, Response, next) => {
      
      if (error instanceof AppErrors) {
        return Response.status(error.statusCode).json({ msg: error.errorMsg })
      }
      console.log(error)
      return Response.status(500).json({ msg: 'Internal error' })
    })

    // this.app.use(express.static(path.join(__dirname, "..", "build")));
  }
  routes() {
    // this.app.use(route);
    this.app.use(notifRouter);
    this.app.use(monitRouter)
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
