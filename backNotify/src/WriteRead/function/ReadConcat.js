// Diretório 
const DIR = "/mnt/fcir/sns";
const api = require("../../variables_api/monitoring-variables");
// const DIR = "C:/Users/Davis/Documents/sns";
const fs = require("fs-extra");
const knex = require("../../database/connections");
const mailer = require("../../modules/nodemail");
const moment = require("moment-timezone");

let sensors_monit = [];
let off_range_sensors = [];
let current_date = Date.now();


const loop = () => {
  setTimeout(() => {
    listDirFiles(DIR)
      .then((arr) => Promise.all(arr.map((item) => readFile(`${DIR}/${item}`))))
      .then((arr) => {
        let data = arr.map((e) => JSON.parse(e));
        return data;
      })
      .then((arr) => {
        api.sensorMonitoring = arr;
        sensors_monit = arr;
      })
      .then((_) => {
        knex("notifications")
          .then((ndata) => {
            ndata.map((banco) => {
              // MAP DO JSON
              sensors_monit.map((json) => {
                // Horário atual -> a cada 2 segundos irá ser alterado
                current_date = Date.now();
                // SE O ID QUE ESTIVER NO BANCO FOR IGUAL AO ID DO JSON QUE ESTOU PERCORRENDO
                if (json.ID === banco.ID_SENSOR) {
                  if (banco.CONDITION === "ACIMA") {
                    if (json.VALUE[banco.POSITION] > banco.VALUE) {
                      // Verificar se existe ou nÃo os valores no array
                      const include = off_range_sensors.findIndex(
                        (off_range) => {
                          return (
                            off_range.ID === json.ID &&
                            off_range.CONDITION === banco.CONDITION &&
                            off_range.VALUE === banco.VALUE
                          );
                        }
                      );
                      // Se nÃ£o existir no array
                      if (include < 0) {
                        off_range_sensors.push({
                          ID: json.ID,
                          UID:banco.CREATED_AT,
                          CONDITION: banco.CONDITION,
                          email: false,
                          time: current_date,
                          VALUE: banco.VALUE,
                          VALUE_JSON: json.VALUE[banco.POSITION],
                        });
                      }
                      // Se existir e nÃ£o tive enviado o email entÃ£o calculo o tempo
                      else if (include >= 0) {
                        // Pego o meu horÃ¡rio atual e subtraio com o horÃ¡rio que estaÂ´no array
                        const repeatItem = off_range_sensors.findIndex(
                          (repeat) =>
                            repeat.ID === json.ID &&
                            repeat.CONDITION === banco.CONDITION &&
                            repeat.VALUE === banco.VALUE
                        );

                        let variacao =
                          moment(current_date).unix() -
                          moment(off_range_sensors[repeatItem].time).unix();
                        // Se estiver acima do valor que estÃ¡ no banco
                        if (variacao > banco.TIME) {
                          // Mudar a variÃ¡vel email para true
                          // Se nÃ£o tiver enviado o email
                          if (off_range_sensors[repeatItem].email === false) {
                            moment;
                            mailer.sendMail(
                              {
                                from: "Alertas3v3@gmail.com",
                                to: banco.EMAIL,
                                template: "auth/sensorAlert",
                                subject: "Alerta de sensor! 3v3",
                                context: {
                                  sensorName: json.NAME,
                                  cond: banco.CONDITION,
                                  value: banco.VALUE,
                                  medition_type:banco.MEDITION_TYPE,
                                  VALUE_JSON: json.VALUE[banco.POSITION],
                                  unit: banco.UNIT,
                                  start: moment(
                                    moment(off_range_sensors[repeatItem].time)
                                  )
                                    .tz("America/Fortaleza")
                                    .format("DD/MM/YYYY  HH:mm:ss"),
                                  end: moment(moment(current_date))
                                    .tz("America/Fortaleza")
                                    .format("DD/MM/YYYY  HH:mm:ss"),
                                },
                              },
                              (err) => {
                                if (err) {
                                  console.log("ERROR AO ENVIAR O EMAIL ", err);
                                }
                                // console.log("EMAIL ENVIADO COM SUCESSO!");
                              }
                            );
                            // Marco que enviei o email
                            off_range_sensors[repeatItem].email = true;
                          }
                        }
                        // Se já estiver enviado o email então realizo X operação
                        // if (off_range_sensors[repeatItem].email === true) {
                        // }
                      }
                      // Se já existir e o valor do json for alterado (atualizado) irá atualizar o VALUE do array off_range_sensors
                      else if (include >= 0) {
                        //
                        off_range_sensors.map(
                          (e) => (e.VALUE_JSON = json.VALUE[banco.POSITION])
                        );
                      }
                    }
                    //Se sair da faixa dos valores da condição ACIMA então irá apagar o registro do off_range_sensors
                    // OBS: irá apagar somente o valor que sair da faixa, condição muito específica
                    else {
                      const include = off_range_sensors.findIndex(
                        (off_range) => {
                          return (
                            off_range.ID === json.ID &&
                            off_range.CONDITION === banco.CONDITION &&
                            off_range.VALUE === banco.VALUE
                          );
                        }
                      );

                      if (include >= 0 && off_range_sensors[include].email === true) {
                        const filteredItems = off_range_sensors.filter(
                          (item) => {
                            return item.UID !== off_range_sensors[include].UID;
                          }
                        );
                        off_range_sensors = filteredItems;
                      }
                      return;
                    }
                  }
                  if (banco.CONDITION === "ABAIXO") {
                    if (json.VALUE[banco.POSITION] < banco.VALUE) {
                      // Verificar se tem o mesmo ID e se a condiÃ§Ã£o Ã© a mesma
                      const include = off_range_sensors.findIndex(
                        (off_range) => {
                          return (
                            off_range.ID === json.ID &&
                            off_range.CONDITION === banco.CONDITION &&
                            off_range.VALUE === banco.VALUE      
                          );
                        }
                      );
                      if (include < 0) {
                        off_range_sensors.push({
                          ID: json.ID,
                          UID:banco.CREATED_AT,
                          CONDITION: banco.CONDITION,
                          email: false,
                          time: current_date,
                          VALUE: banco.VALUE,
                          VALUE_JSON: json.VALUE[banco.POSITION],
                        });
                      }

                      else if (
                        include >= 0 &&
                        off_range_sensors[include].email === false
                      ) {
                        const repeatItem = off_range_sensors.findIndex(
                          (repeat) => {
                            return (
                              // Evitar que calcule o tempo dos sensores com mesmo ID
                              repeat.ID === json.ID &&
                              repeat.CONDITION === banco.CONDITION &&
                              repeat.VALUE === banco.VALUE
                            );
                          }
                        );

                        let variacao =
                          moment(current_date).unix() -
                          moment(off_range_sensors[repeatItem].time).unix();
                        if (variacao >= banco.TIME) {
                          if (off_range_sensors[repeatItem].email === false) {
                            mailer.sendMail(
                              {
                                from: "Alertas3v3@gmail.com",
                                to: banco.EMAIL,
                                template: "auth/sensorAlert",
                                subject: "Alerta de sensor! 3v3",
                                context: {
                                  sensorName: json.NAME,
                                  cond: banco.CONDITION,
                                  value: banco.VALUE,
                                  medition_type:banco.MEDITION_TYPE,
                                  VALUE_JSON: json.VALUE[banco.POSITION],
                                  unit: banco.UNIT,
                                  start: moment(
                                    moment(off_range_sensors[repeatItem].time)
                                  )
                                    .tz("America/Fortaleza")
                                    .format("DD/MM/YYYY  HH:mm:ss"),
                                  end: moment(moment(current_date))
                                    .tz("America/Fortaleza")
                                    .format("DD/MM/YYYY  HH:mm:ss"),
                                },
                              },
                              (err) => {
                                if (err) {
                                  console.log("ERROR AO ENVIAR O EMAIL ", err);
                                }
                              }
                            );
                            off_range_sensors[repeatItem].email = true;
                          }
                        }
                        // if (off_range_sensors[repeatItem].email === true) {
                        //   console.log("JÁ ENVIADO abaixo");
                        // }
                      }
                      else if (include >= 0) {
                        //
                        off_range_sensors.map(
                          (e) => (e.VALUE_JSON = json.VALUE[banco.POSITION])
                        );
                      }
                    }

                    else {
                      const include = off_range_sensors.findIndex(
                        (off_range) => {
                          return (
                            off_range.ID === json.ID &&
                            off_range.CONDITION === banco.CONDITION &&
                            off_range.VALUE === banco.VALUE
                          );
                        }
                      );
                      if (include >= 0  && off_range_sensors[include].email === true) {
                        let filteredItems = off_range_sensors.filter((item) => {
                          return item.UID !== off_range_sensors[include].UID;
                        });
                        off_range_sensors = filteredItems;
                      }
                      return;
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
      .catch((err) => console.log(err))
      .then(() => loop());
  }, 2000);
};


function listDirFiles(url) {
  return new Promise((fullfill, reject) => {
    fs.readdir(url, (err, data) => (err ? reject(err) : fullfill(data)));
  });
}

function readFile(dir) {
  return new Promise((fullfill, reject) => {
    fs.readFile(dir, "latin1", (err, data) =>
      err ? reject(err) : fullfill(data)
    );
  });
}

module.exports = loop;
