const express = require("express")
const database = require("../src/database/connections")


const route = express.Router();
const api = require("../src/variables_api/monitoring-variables")

route.get("/notify-get-sensors/:id", (req, res) => {
  let data = []
  api.sensorMonitoring.map(e => {
    data.push(e)
  })
  const filter = data.filter((e) => e.ID === Number(req.params.id));

  return res.status(200).json(filter);
});
route.get('/search',async(req,res)=>{
  const valid = !!req.query.name.split(' ').join('');

  let data=await database('notifications')
  if(data.length && valid){
    let x=data.filter(item =>
      item.NAME.indexOf(req.query.name.toUpperCase()) > -1
    )
    return res.status(200).json(x)
  }else{
    return res.status(200).json(data)
  }
})
route.get("/notify-get-sensors", (req, res) => {
  let data = []
  if(api.sensorMonitoring.length>0){
    api.sensorMonitoring.map(e => {
      data.push(e)
    })
  }
  else{
    data=[]
  }
  return res.status(200).json(data);
});
route.post("/notify-post-sensor-alert", async (req, res) => {
  const { TIME, VALUE, NAME,UNIT, ID_SENSOR, EMAIL, COND, POSITION } = req.body;
  const duplicate = await database("notifications")
    .where("ID_SENSOR", ID_SENSOR)
    .andWhere("COND", COND)
    .andWhere("VALUE",VALUE);
  try {
    if (!duplicate.length) {
      database("notifications")
        .insert({
          TIME: TIME * 60,
          VALUE,
          NAME,
          UNIT,
          ID_SENSOR,
          EMAIL,
          COND,
          POSITION,
        })
        .then((data) => {
          console.log(data);
          database("notifications")
            .then(data => res.status(200).json({ data }))
            .catch(err => res.status(400).json({ "message": "Error" }))
        })
        .catch((error) => {
          console.log(error);
          throw "Não foi possível cadastrar no banco";
        });
    } else {
      throw "Valor que está querendo inserir já existe no banco";
    }
  } catch (error) {
    return res.status(400).json({ msg: error });
  }
});

route.put("/notify-put-sensor-alert/:id", (req, res) => {
  const { TIME, VALUE, NAME,UNIT, ID_SENSOR, EMAIL, COND, POSITION } = req.body;
  database("notifications")
    .where({ id: req.params.id })
    .update({
      TIME: TIME * 60,
      VALUE,
      UNIT,
      NAME,
      ID_SENSOR,
      EMAIL,
      COND,
      POSITION,
    })
    .then(_ => {
      database("notifications")
      .then(data => res.status(200).json({ data }))
      .catch(err => res.status(400).json({ "message": "Error" }))
    })
    .catch((error) => {
      console.log(error);
    });
  // return res.status(200).json(req.body);
});

route.delete("/notify-delete-sensor-alert/:id", (req, res) => {
  database("notifications")
    .where({ id: req.params.id })
    .delete()
    .then((data) => {
      database("notifications")
      .then(data => res.status(200).json({ data }))
      .catch(err => res.status(400).json({ "message": "Error" }))
    })
    .catch((err) => {
      console.log(err);
    });
});

// Pegar Alertas de Sensores
route.get("/notify-sensors-alert", (req, res) => {
  database("notifications")
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => {
      return res.status(200).json({ err });
    });
});
// Pegar Alerta específico
route.get("/notify-sensor-alert/:id", (req, res) => {
  database("notifications")
    .where({ id: req.params.id })
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => {
      return res.status(200).json({ err });
    });
});

module.exports = route;
