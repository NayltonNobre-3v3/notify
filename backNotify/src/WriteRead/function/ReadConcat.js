// Diretório 
// const DIR = "/mnt/fcir/sns";
import api from "../../variables_api/monitoring-variables";
// import DIR from "C:/Users/Davis/Documents/sns";
const DIR ="C:/Users/davi/Downloads/sns";
// import fs from "fs-extra";
import fs from "fs-extra";
import knex from "../../database/connections";
import mailer from "../../modules/nodemail";
import moment from "moment-timezone";

let sensors_monit = [];
// Array momentâneo no qual irá guardar os dados que estão na condição especificada
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
          .then((banco) => {
            banco.map((data) => {
              // MAP DO JSON
              sensors_monit.map((json) => {
                // Horário atual -> a cada 2 segundos irá ser alterado
                current_date = Date.now();
                // SE O ID QUE ESTIVER NO BANCO FOR IGUAL AO ID DO JSON QUE ESTOU PERCORRENDO
                if (json.ID === data.ID_SENSOR) {
                  
                  if (data.CONDITION === "ACIMA") {
                    if (json.VALUE[banco.POSITION] > data.VALUE) {
                      // Verificar se existe ou nÃo os valores no array 
                      const include = off_range_sensors.findIndex(
                        (off_range) => {
                          return (
                            off_range.ID === json.ID &&
                            off_range.CONDITION === data.CONDITION &&
                            off_range.VALUE === data.VALUE
                          );
                        }
                      );
                      // Se nÃ£o existir no array
                      if (include < 0) {
                        off_range_sensors.push({
                          ID: json.ID,
                          UID:data.CREATED_AT,
                          CONDITION: data.CONDITION,
                          email: false,
                          time: current_date,
                          VALUE: data.VALUE,
                          VALUE_JSON: json.VALUE[data.POSITION],
                        });
                      }
                      // Se existir e nÃ£o tive enviado o email entÃ£o calculo o tempo
                      else if (include >= 0) {
                        // Pego o meu horÃ¡rio atual e subtraio com o horÃ¡rio que estaÂ´no array
                        const repeatItem = off_range_sensors.findIndex(
                          (repeat) =>
                            repeat.ID === json.ID &&
                            repeat.CONDITION === data.CONDITION &&
                            repeat.VALUE === data.VALUE
                        );

                        let variacao =
                          moment(current_date).unix() -
                          moment(off_range_sensors[repeatItem].time).unix();
                        // Se estiver acima do valor que estÃ¡ no banco
                        if (variacao > data.TIME) {
                          // Mudar a variÃ¡vel email para true
                          // Se nÃ£o tiver enviado o email
                          if (off_range_sensors[repeatItem].email === false) {
                            moment;
                            mailer.sendMail(
                              {
                                from: "Alertas3v3@gmail.com",
                                to: data.EMAIL,
                                template: "auth/sensorAlert",
                                subject: "Alerta de sensor! 3v3",
                                context: {
                                  sensorName: json.NAME,
                                  cond: data.CONDITION,
                                  value: data.VALUE,
                                  medition_type:data.MEDITION_TYPE,
                                  VALUE_JSON: json.VALUE[data.POSITION],
                                  unit: data.UNIT,
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
                          (e) => (e.VALUE_JSON = json.VALUE[data.POSITION])
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
                            off_range.CONDITION === data.CONDITION &&
                            off_range.VALUE === data.VALUE
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
                  if (data.CONDITION === "ABAIXO") {
                    if (json.VALUE[data.POSITION] < data.VALUE) {
                      // Verificar se tem o mesmo ID e se a condiÃ§Ã£o Ã© a mesma
                      const include = off_range_sensors.findIndex(
                        (off_range) => {
                          return (
                            off_range.ID === json.ID &&
                            off_range.CONDITION === data.CONDITION &&
                            off_range.VALUE === data.VALUE      
                          );
                        }
                      );
                      if (include < 0) {
                        off_range_sensors.push({
                          ID: json.ID,
                          UID:data.CREATED_AT,
                          CONDITION: data.CONDITION,
                          email: false,
                          time: current_date,
                          VALUE: data.VALUE,
                          VALUE_JSON: json.VALUE[data.POSITION],
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
                              repeat.CONDITION === data.CONDITION &&
                              repeat.VALUE === data.VALUE
                            );
                          }
                        );

                        let variacao =
                          moment(current_date).unix() -
                          moment(off_range_sensors[repeatItem].time).unix();
                        if (variacao >= data.TIME) {
                          if (off_range_sensors[repeatItem].email === false) {
                            mailer.sendMail(
                              {
                                from: "Alertas3v3@gmail.com",
                                to: data.EMAIL,
                                template: "auth/sensorAlert",
                                subject: "Alerta de sensor! 3v3",
                                context: {
                                  sensorName: json.NAME,
                                  cond: data.CONDITION,
                                  value: data.VALUE,
                                  medition_type:data.MEDITION_TYPE,
                                  VALUE_JSON: json.VALUE[data.POSITION],
                                  unit: data.UNIT,
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
                          (e) => (e.VALUE_JSON = json.VALUE[data.POSITION])
                        );
                      }
                    }

                    else {
                      const include = off_range_sensors.findIndex(
                        (off_range) => {
                          return (
                            off_range.ID === json.ID &&
                            off_range.CONDITION === data.CONDITION &&
                            off_range.VALUE === data.VALUE
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

export default loop;
