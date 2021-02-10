import {Router} from 'express';
const route=Router()

import path from "path";
import AlertsControllers from './controllers/AlertController'
import SensorsControllers from './controllers/SensorsController'
const AlertsController=new AlertsControllers()
const SensorsController=new SensorsControllers()

route.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "build", "index.html")
  );
});
// LEITURA E LISTAGEM DE SENSORES PRESENTES NO DIRETÓRIO ESPECÍFICO
route.get("/notify/get-sensors/:id", SensorsController.getSensor);
route.get("/notify/get-sensors", SensorsController.getSensors);

// ALERTAS
route.post("/notify/post-sensor-alert", AlertsController.postAlert);
route.put("/notify/put-sensor-alert/:id", AlertsController.putAlert);
route.delete("/notify/delete-sensor-alert/:id", AlertsController.deleteAlert);
route.get("/notify/sensors-alert", AlertsController.getAlerts);
route.get("/notify/sensor-alert/:id", AlertsController.getOneAlert);

export default route;
