// Diretório 
const DIR = "/mnt/fcir/sns";
// const DIR = "C:/Users/Davis/Documents/sns";
const fs = require("fs-extra");
const knex = require("../../database/connections");
// const moment = require("moment;")
const mailer = require("../../modules/nodemail");
let sensors_monit = [];
const api = require("../../variables_api/monitoring-variables");

let off_range_sensors = [];
let current_date = Date.now();
const moment = require("moment-timezone");
const loop = () => {
  setTimeout(() => {
    // console.log('off_range= ',off_range_sensors)
    listDirFiles(DIR)
      .then((arr) => Promise.all(arr.map((item) => readFile(`${DIR}/${item}`))))
      .then((arr) => {
        let data = arr.map((e) => JSON.parse(e));
        return data;
      })
      .then((arr) => {
        // console.log(' sensors_monit= ',arr)
        api.sensorMonitoring = arr;
        sensors_monit = arr;
      })
      .then((_) => {
        knex("notifications")
          // PEGO DO BANCO
          .then((ndata) => {
            // MAP DO BANCO - PERCORRENDO O ARRAY
            ndata.map((banco) => {
              // MAP DO JSON
              sensors_monit.map((json) => {
                // Horário atual -> a cada 2 segundos irá ser alterado
                current_date = Date.now();
                // SE O ID QUE ESTIVER NO BANCO FOR IGUAL AO ID DO JSON QUE ESTOU PERCORRENDO
                if (json.ID === banco.ID_SENSOR) {
                  if (banco.COND === "ACIMA") {
                    // console.log("REPETIDOS= ", off_range_sensors);

                    // console.log('API SENSOR= ',json)
                    if (json.VALUE[banco.POSITION] > banco.VALUE) {
                      // Verificar se existe ou nÃ£o os valores no array
                      const include = off_range_sensors.findIndex(
                        (off_range) => {
                          return (
                            off_range.ID === json.ID &&
                            off_range.COND === banco.COND &&
                            off_range.VALUE === banco.VALUE
                          );
                        }
                      );
                      // Se nÃ£o existir no array
                      if (include < 0) {
                        off_range_sensors.push({
                          ID: json.ID,
                          UID:banco.created_at,
                          COND: banco.COND,
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
                            repeat.COND === banco.COND &&
                            repeat.VALUE === banco.VALUE
                        );

                        let variacao =
                          moment(current_date).unix() -
                          moment(off_range_sensors[repeatItem].time).unix();
                        // Se estiver acima do valor que estÃ¡ no banco
                        // console.log('VARIAÇÃO= ', variacao)
                        if (variacao > banco.TIME) {
                          // Mudar a variÃ¡vel email para true
                          // Se nÃ£o tiver enviado o email
                          // console.log('OFF RANGE SENSOR= ',(off_range_sensors))
                          if (off_range_sensors[repeatItem].email === false) {
                            // Envio o email
                            // console.log('JSON= ',json.NAME)
                            // console.log(off_range_sensors);
                            moment;
                            mailer.sendMail(
                              {
                                from: "Alertas3v3@gmail.com",
                                to: banco.EMAIL,
                                template: "auth/sensorAlert",
                                subject: "Alerta de sensor! 3v3",
                                context: {
                                  sensorName: json.NAME,
                                  cond: banco.COND,
                                  value: banco.VALUE,
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
                                console.log("EMAIL ENVIADO COM SUCESSO!");
                              }
                            );
                            // Marco que enviei o email
                            off_range_sensors[repeatItem].email = true;
                          }
                        }
                        // Se já estiver enviado o email então realizo X operação
                        if (off_range_sensors[repeatItem].email === true) {
                          // console.log("JÁ ENVIADO acima");
                          // return;
                        }
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
                      // Procuro pelo o item que jÃ¡ existe
                      const include = off_range_sensors.findIndex(
                        (off_range) => {
                          return (
                            off_range.ID === json.ID &&
                            off_range.COND === banco.COND &&
                            off_range.VALUE === banco.VALUE
                          );
                        }
                      );
                      // Se tiver encontrado algum item repetido entÃ£o tirarÃ¡ do array
                      if (include >= 0 && off_range_sensors[include].email === true) {
                        // Tiro do array off_range_sensors
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
                  // Se a condiÃ§Ã£o for ABAIXO
                  if (banco.COND === "ABAIXO") {
                    if (json.VALUE[banco.POSITION] < banco.VALUE) {
                      // console.log('SENSOR MONIT= ',sensors_monit.length)
                      // Verificar se tem o mesmo ID e se a condiÃ§Ã£o Ã© a mesma
                      const include = off_range_sensors.findIndex(
                        (off_range) => {
                          // Vai procurar se no array em que registro os alertas que irÃ£o ser
                          // verificados se tem algum que tenha o mesmo ID e mesma condiÃ§Ã£i
                          return (
                            off_range.ID === json.ID &&
                            off_range.COND === banco.COND &&
                            off_range.VALUE === banco.VALUE      
                          );
                        }
                      );
                      // Se o valor que está no banco não estiver no array então eu cadastro no array
                      if (include < 0) {
                        off_range_sensors.push({
                          ID: json.ID,
                          UID:banco.created_at,
                          COND: banco.COND,
                          email: false,
                          time: current_date,
                          VALUE: banco.VALUE,
                          VALUE_JSON: json.VALUE[banco.POSITION],
                        });
                      }
                      // Se o valor que está no banco já existir no arra e não estiver enviado o email
                      else if (
                        include >= 0 &&
                        off_range_sensors[include].email === false
                      ) {
                        // console.log(off_range_sensors);
                        // Verifico se no array tem o elemento com o mesmo ID  do json e mesma condição do BANCO
                        // para evitar repetição
                        const repeatItem = off_range_sensors.findIndex(
                          (repeat) => {
                            return (
                              // Evitar que calcule o tempo dos sensores com mesmo ID
                              repeat.ID === json.ID &&
                              repeat.COND === banco.COND &&
                              repeat.VALUE === banco.VALUE
                            );
                          }
                        );

                        // Pego o meu horÃ¡rio atual e subtraio com o horÃ¡rio que estaÂ´no array
                        let variacao =
                          moment(current_date).unix() -
                          moment(off_range_sensors[repeatItem].time).unix();
                        // console.log(moment.unix(variacao).format("mm:ss"));
                        // Se estiver acima do valor que estÃ¡ no banco

                        // console.log('off_range_sensors ',variacao,' ',off_range_sensors,'\n')
                        if (variacao >= banco.TIME) {
                          // Mudar a variÃ¡vel email para true
                          // Se nÃ£o tiver enviado o email
                          if (off_range_sensors[repeatItem].email === false) {
                            // Envio o email
                            // Marco que enviei o email
                            mailer.sendMail(
                              {
                                from: "Alertas3v3@gmail.com",
                                to: banco.EMAIL,
                                template: "auth/sensorAlert",
                                subject: "Alerta de sensor! 3v3",
                                context: {
                                  sensorName: json.NAME,
                                  cond: banco.COND,
                                  value: banco.VALUE,
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
                                console.log("EMAIL ENVIADO COM SUCESSO!");
                              }
                            );
                            off_range_sensors[repeatItem].email = true;
                          }
                        }
                        // Se tiver registrado que enviei o email e
                        if (off_range_sensors[repeatItem].email === true) {
                          console.log("JÁ ENVIADO abaixo");
                          // return;
                        }
                      }

                      // Se já existir e o valor do json for alterado (atualizado) irá atualizar o valor do array off_range_sensors
                      else if (include >= 0) {
                        //
                        off_range_sensors.map(
                          (e) => (e.VALUE_JSON = json.VALUE[banco.POSITION])
                        );
                      }
                    }
                    //Se sair da faixa dos valores entÃ£o apaga o registro
                    else {
                      // Procuro pelo o item que jÃ¡ existe
                      const include = off_range_sensors.findIndex(
                        (off_range) => {
                          return (
                            off_range.ID === json.ID &&
                            off_range.COND === banco.COND &&
                            off_range.VALUE === banco.VALUE
                          );
                        }
                      );
                      // Se tiver encontrado algum item repetido entÃ£o tirarÃ¡ do array
                      if (include >= 0  && off_range_sensors[include].email === true) {
                        // Tiro do array off_range_sensors
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

// Lista os arquivos presentes em um diretÃ³rio
function listDirFiles(url) {
  return new Promise((fullfill, reject) => {
    fs.readdir(url, (err, data) => (err ? reject(err) : fullfill(data)));
  });
}

// Leitura dos arquivos
function readFile(dir) {
  return new Promise((fullfill, reject) => {
    fs.readFile(dir, "latin1", (err, data) =>
      err ? reject(err) : fullfill(data)
    );
  });
}

module.exports = loop;
