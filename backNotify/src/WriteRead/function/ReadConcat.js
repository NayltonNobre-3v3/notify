// const DIR = "/mnt/fcir/sns";
const DIR = "C:/Users/davi/Downloads/sns";
const fs = require("fs-extra");
const knex = require("../../database/connections");
const moment=require("moment")
const mailer=require("../../modules/nodemail")
let sensors_monit = [];
const api=require("../../variables_api/monitoring-variables")

let off_range_sensors = [];
let current_date = Date.now();

const loop = () => {
  setTimeout(() => {
    listDirFiles(DIR)
      .then((arr) =>Promise.all(arr.map((item) => readFile(`${DIR}/${item}`))))
      .then((arr) => {
       arr.map(e=>{
         sensors_monit.push(JSON.parse(e))
       })
       return arr
      })
      .then(arr=>api.sensorMonitoring=arr)
      .then((_) => {
        
        knex("notifications")
          // PEGO DO BANCO
          .then((ndata) => {
            // MAP DO BANCO - PERCORRENDO O ARRAY
            ndata.map((banco) => {
              // MAP DO JSON
              sensors_monit.map((json) => {
                // console.log('API SENSOR= ',json)
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
                            // console.log('JSON= ',json.NAME)
                            mailer.sendMail(
                              {
                                from: "sir3v3@gmail.com",
                                to:"davispenha@gmail.com",
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
      .catch((err) => console.log(err))
      .then(() => loop());
  }, 3000);
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


module.exports=loop