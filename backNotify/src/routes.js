// import { Router } from "express";
// const Router=require("express")
// import database from "../src/database/connections";

const express=require("express")
const database=require("../src/database/connections")

// const route = Router();
const route = express.Router();

// import createAPI from "./monitoring/MonitoringSNS"
const createAPI=require("./monitoring/MonitoringSNS") 

const api=require("../src/variables_api/monitoring-variables")

route.get("/get-sensor-monitoring/:id", (req, res) => {
  // const file = require("C:/Users/davi/Downloads/files.json");
  // const data=api.sensorMonitoring.map(e=>e.ID===req.params.id)
  let data=[]
  api.sensorMonitoring.map(e=>{
    data.push(JSON.parse(e))
  })
  const filter = data.filter((e) => e.ID === Number(req.params.id));

  return res.status(200).json(filter);
});
route.get("/get-sensor-monitoring", (req, res) => {
  // console.log("API= ",api.sensorMonitoring)
  let data=[]
  api.sensorMonitoring.map(e=>{
    data.push(JSON.parse(e))
  })
  return res.status(200).json(data);
});
route.post("/post-sensor-alert", async (req, res) => {
  const { TIME, VALUE, NAME, ID_SENSOR, EMAIL, COND, POSITION } = req.body;
  const duplicate = await database("notifications")
    .where("ID_SENSOR", ID_SENSOR)
    .andWhere("COND", COND);
  try {
    if (!duplicate.length) {
      database("notifications")
        .insert({
          TIME: TIME * 60,
          VALUE,
          NAME,
          ID_SENSOR,
          EMAIL,
          COND,
          POSITION,
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
          throw "Não foi possível cadastrar no banco";
        });

      return res.status(200).json(req.body);
    } else {
      throw "Valor que está querendo inserir já existe no banco";
    }
  } catch (error) {
    return res.status(400).json({ msg: error });
  }
});

route.put("/put-sensor-alert/:id", (req, res) => {
  const { TIME, VALUE, NAME, ID_SENSOR, EMAIL, COND, POSITION } = req.body;
  database("notifications")
    .where({ id: req.params.id })
    .update({
      TIME,
      VALUE,
      NAME,
      ID_SENSOR,
      EMAIL,
      COND,
      POSITION,
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
  return res.status(200).json(req.body);
});

route.delete("/delete-sensor-alert/:id", (req, res) => {
  database("notifications")
    .where({ id: req.params.id })
    .delete()
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
  return res
    .status(200)
    .json({ data: `Alerta com ID = ${req.params.id} deletado com sucesso` });
});

route.get("/sensors-alert", (req, res) => {
  database("notifications")
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => {
      return res.status(200).json({ err });
    });
});

route.get("/sensor-alert/:id", (req, res) => {
  database("notifications")
    .where({ id: req.params.id })
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => {
      return res.status(200).json({ err });
    });
});


// Irá monitorar os sensores
// createAPI();


// export default route;
module.exports= route;
