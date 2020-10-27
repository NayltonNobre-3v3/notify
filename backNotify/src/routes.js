import { Router } from "express";
import database from "../knexfile";
import mailer from "./modules/nodemail";

import fs from "fs-extra";

import knex from "../knexfile";
import moment from "moment";

const api = require("./variables_api/monitoring-variables");

const route = Router();

const source = "C:/Users/davi/Downloads/files.json";

let off_range_sensors = [];
let current_date = Date.now();

route.get("/get-sensor-monitoring/:id", (req, res) => {
  //  './json/GET/get-sensor-monitoring/71.json'
  const file = require("C:/Users/davi/Downloads/files.json");
  const data = file.filter((e) => e.ID === Number(req.params.id));
  return res.status(200).json(data);
});
route.get("/get-sensor-monitoring", (req, res) => {
  //  './json/GET/get-sensor-monitoring/71.json'
  const file = require("C:/Users/davi/Downloads/files.json");
  return res.status(200).json(file);
});
route.post("/post-sensor-alert", async (req, res) => {
  //  './json/GET/get-sensor-monitoring/71.json'
  // const file=require(`./json/${req.method}/get-sensor-monitoring.json`);
  // const data=file.filter(e=>e.ID===Number(req.params.id))
  const { TIME, VALUE, NAME, ID_SENSOR, EMAIL, COND, POSITION } = req.body;
  // let newTime = TIME * 60

  // console.log(req.body);

  const duplicate = await database("notifications")
    .where("ID_SENSOR", ID_SENSOR)
    .andWhere("COND", COND);
  // console.log('DUPLICATE= ',duplicate)
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
    .json({ message: `Alerta com ID = ${req.params.id} deletado com sucesso` });
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

// Alertar sensor
function createAPI() {
  return fs
    .readJson(source, "utf-8")
    .then((files) => {
      knex("notifications")
        // PEGO DO BANCO
        .then((ndata) => {
          // MAP DO BANCO - PERCORRENDO O ARRAY
          ndata.map((banco) => {
            // MAP DO JSON
            files.map((json) => {
              current_date = Date.now();
              // SE O ID QUE ESTIVER NO BANCO FOR IGUAL AO ID DO JSON QUE ESTOU PERCORRENDO
              if (json.ID === banco.ID_SENSOR) {
                if (banco.COND === "ACIMA") {
                  // console.log('JSON= ',json)
                  if (json.VALUE[banco.POSITION] > banco.VALUE) {
                    // Verificar se existe ou não os valores no array
                    const include = off_range_sensors.findIndex((off_range) => {
                      return (
                        off_range.ID === json.ID &&
                        off_range.COND === banco.COND
                      );
                    });
                    // Se não existir no array
                    if (include < 0) {
                      off_range_sensors.push(...off_range_sensors, {
                        ID: json.ID,
                        COND: banco.COND,
                        email: false,
                        time: current_date,
                      });
                    }
                    // Se existir e não tive enviado o email então calculo o tempo
                    else if (
                      include >= 0 &&
                      off_range_sensors[include].email === false
                    ) {
                      // Pego o meu horário atual e subtraio com o horário que esta´no array
                      const repeatItem = off_range_sensors.findIndex(
                        (repeat) =>
                          repeat.ID === json.ID && repeat.COND === banco.COND
                      );
                      let variacao =
                        moment(current_date).unix() -
                        moment(off_range_sensors[repeatItem].time).unix();
                      // Se estiver acima do valor que está no banco
                      if (variacao > banco.TIME) {
                        // Mudar a variável email para true
                        // Se não tiver enviado o email
                        if (off_range_sensors[repeatItem].email === false) {
                          // Envio o email
                          // Marco que enviei o email
                          mailer.sendMail(
                            {
                              from: "sir3v3@gmail.com",
                              to: "davispenha@gmail.com",
                              template: "auth/sensorAlert",
                              subject: "Alerta de sensor! 3v3",
                              context: {
                                sensorName: json.NAME,
                                cond: banco.COND,
                                value: banco.VALUE,
                                start: moment(
                                  moment(off_range_sensors[repeatItem].time)
                                ).format("LLLL"),
                                end: moment(moment(current_date)).format(
                                  "LLLL"
                                ),
                              },
                            },
                            (err) => {
                              if (err) {
                                console.log("ERROR AO ENVIAR O EMAIL");
                              }
                              console.log("EMAIL ENVIADO COM SUCESSO!");
                            }
                          );
                          off_range_sensors[repeatItem].email = true;
                        }
                      }
                      // Se tiver registrado que enviei o email e
                      if (off_range_sensors[repeatItem].email === true) {
                        return;
                      }
                    }
                  }
                  //Se sair da faixa dos valores então apaga o registro
                  else {
                    // Procuro pelo o item que já existe
                    const include = off_range_sensors.findIndex((off_range) => {
                      return (
                        off_range.ID === json.ID &&
                        off_range.COND === banco.COND
                      );
                    });
                    // Se tiver encontrado algum item repetido então tirará do array
                    if (include >= 0) {
                      // Tiro do array off_range_sensors
                      const filteredItems = off_range_sensors.filter((item) => {
                        return item.ID !== off_range_sensors[include].ID;
                      });
                      off_range_sensors = filteredItems;
                      // console.log(off_range_sensors)
                    }
                  }
                }

                // Se a condição for ABAIXO

                if (banco.COND === "ABAIXO") {
                  if (json.VALUE[banco.POSITION] < banco.VALUE) {
                    // Verificar se tem o mesmo ID e se a condição é a mesma
                    const include = off_range_sensors.findIndex((off_range) => {
                      // Vai procurar se no array em que registro os alertas que irão ser
                      // verificados se tem algum que tenha o mesmo ID e mesma condiçãi
                      return (
                        off_range.ID === json.ID &&
                        off_range.COND === banco.COND
                      );
                    });
                    console.log("INCLUDE= ", include);
                    // Se não existir no array
                    if (include < 0) {
                      off_range_sensors.push(...off_range_sensors, {
                        ID: json.ID,
                        COND: banco.COND,
                        email: false,
                        time: current_date,
                      });
                    }
                    // Se existir eu calculo o tempo que pessaou
                    else {
                      // Pego o meu horário atual e subtraio com o horário que esta´no array
                      const repeatItem = off_range_sensors.findIndex(
                        (repeat) => {
                          return (
                            repeat.ID === json.ID && repeat.COND === banco.COND
                          );
                        }
                      );
                      let variacao =
                        moment(current_date).unix() -
                        moment(off_range_sensors[repeatItem].time).unix();
                      // console.log(moment.unix(variacao).format("mm:ss"));
                      // Se estiver acima do valor que está no banco
                      if (variacao > banco.TIME) {
                        // Mudar a variável email para true
                        // Se não tiver enviado o email
                        if (off_range_sensors[repeatItem].email === false) {
                          // Envio o email
                          // Marco que enviei o email
                          mailer.sendMail(
                            {
                              from: "sir3v3@gmail.com",
                              to: banco.EMAIL,
                              template: "auth/sensorAlert",
                              subject: "Alerta de sensor! 3v3",
                              context: {
                                sensorName: json.NAME,
                                cond: banco.COND,
                                value: banco.VALUE,
                                start: moment(
                                  moment(off_range_sensors[repeatItem].time)
                                ).format("LLLL"),
                                end: moment(moment(current_date)).format(
                                  "LLLL"
                                ),
                              },
                            },
                            (err) => {
                              if (err) {
                                console.log("ERROR AO ENVIAR O EMAIL");
                              }
                              console.log("EMAIL ENVIADO COM SUCESSO!");
                            }
                          );
                          off_range_sensors[repeatItem].email = true;
                        }
                      }
                      // Se tiver registrado que enviei o email e
                      if (off_range_sensors[repeatItem].email === true) {
                        return;
                      }
                    }
                  }
                  //Se sair da faixa dos valores então apaga o registro
                  else {
                    // Procuro pelo o item que já existe
                    const include = off_range_sensors.findIndex((off_range) => {
                      return (
                        off_range.ID === json.ID &&
                        off_range.COND === banco.COND
                      );
                    });
                    // Se tiver encontrado algum item repetido então tirará do array
                    if (include >= 0) {
                      // Tiro do array off_range_sensors
                      const filteredItems = off_range_sensors.filter((item) => {
                        return item.ID !== off_range_sensors[include].ID;
                      });
                      off_range_sensors = filteredItems;
                    }
                  }
                }
              }
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      if (typeof err != "string" || err.indexOf(`Lista menor`) < 0) {
        console.log("NÃO FOI POSSÍVEL LER O ARQUIVO GERADO! ");
      }
      return;
    })
    .then((_) => setTimeout(createAPI, 2000));
}

createAPI();

export default route;
