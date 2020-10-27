import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import route from "./routes";
import path from "path";
import fs from "fs-extra";

import knex from "../knexfile";
import moment from "moment";

const api = require("./variables_api/monitoring-variables");
const source = 'C:/Users/Davis/Downloads/files.json';


const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(route);


let off_range_sensors = [];
let current_date = Date.now();

function concatenateFiles(files) {
  return new Promise((resolve, reject) => {
    let filesCounter = files.length;
    let list = [];
    for (let i = 0; i < filesCounter; i++) {
      fs.readJson(path.join(source, files[i]), "latin1")
        .then((ret) => list.push(ret))
        .then((_) => {
          return resolve(list);
        })
        .catch((err) => reject(err));
    }
  });
}

function sendEmail(cond, Name, Time, POS) {}

function createAPI() {
  return fs
    .readdir(source)
    .then((files) => {
      concatenateFiles(files).then((ret) => {
        api.dirMonitoring.push(ret);
        // console.log(off_range_sensors);
        knex("notifications")
          // PEGO DO BANCO
          .then((ndata) => {
            // PERCORRO O JSON
            // MAP DO BANCO
            ndata.map((banco) => {
              // MAP DO JSON
              ret[0].map((json) => {
                current_date = Date.now();
                if (json.ID === banco.ID_SENSOR) {
                  if (banco.COND === "ACIMA") {
                    if (json.VALUE[banco.POSITION] > banco.VALUE) {
                      // Verificar se existe ou não os valores no array
                      const include = off_range_sensors.findIndex(
                        (off_range) => {
                          return off_range.ID === json.ID;
                        }
                      );
                      // console.log('INCLUDE= ',off_range_sensors)
                      // Se não existir no array
                      if (include < 0) {
                        off_range_sensors.push(...off_range_sensors, {
                          ID: json.ID,
                          email: false,
                          time: current_date,
                        });
                      }
                      // Se existir eu calculo o tempo que pessaou
                      else {
                        // Pego o meu horário atual e subtraio com o horário que esta´no array
                        const repeatItem = off_range_sensors.findIndex(
                          (repeat) => repeat.ID === json.ID
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
                            console.log(
                              `\nO sensor ${json.NAME} está ${banco.COND} de ${
                                banco.VALUE
                              }, Início: ${moment(moment(off_range_sensors[repeatItem].time)).format(
                                "LLLL"
                              )}, Final:${moment(moment(current_date)).format(
                                "LLLL"
                              )}\n`
                                
                            );
                            off_range_sensors[repeatItem].email = true;
                          }
                        }
                        // Se tiver registrado que enviei o email
                        if (off_range_sensors[repeatItem].email === true) {
                          return;
                        }
                      }
                    }
                    //Se sair da faixa dos valores então apaga o registro
                    else {
                      // Procuro pelo o item que já existe
                      const include = off_range_sensors.findIndex(
                        (off_range) => {
                          return off_range.ID === json.ID;
                        }
                      );
                      // Tiro do array off_range_sensors
                      const filteredItems = off_range_sensors.filter(
                        (item) => item.ID !== include
                      );
                      off_range_sensors = filteredItems;
                    }
                  }
                }
              });
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      if (typeof err != "string" || err.indexOf(`Lista menor`) < 0) {
        console.log(err);
      }
      return;
    })
    .then((_) => setTimeout(createAPI, 2000));
}

createAPI();


app.listen(8000, () => {
  console.log("Rodando em http://localhost:8000");
});
