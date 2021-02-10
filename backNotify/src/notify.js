import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import route from "./routes";
import path from "path";
import getAllSensors from "./WriteRead/function/ReadConcat";
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
    this.app.use(express.static(path.join(__dirname, "..", "build")));
  }
  routes() {
    this.app.use(route);
  }
  set listen(PORT) {
    this.app.listen(PORT, () => {
      console.log(
        `%c RUNNING IN http://localhost:${PORT}`,
        "background: #222; color: #bada55"
      );
    });
  }
  Monit(){
    getAllSensors()
  }


}
export default new Notify();
