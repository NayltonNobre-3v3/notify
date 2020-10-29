// import { writeFile } from 'fs';


const path = require('path')

const api = require('../../helpers/monitoring-variables');
// const source = 'C:/Users/davi/Downloads';
// Caminho do arquivo que irá ser concatenado
// const source = '/mnt/fcirclear';

// Local + Nome do arquivo que irá gerar
const writePath = 'C:/Users/davi/Downloads/files.json'
// const writePath = 'C:/Users/davi/Downloads/files.json'


const source = "C:/Users/davi/Downloads/files.json";

let off_range_sensors = [];
let current_date = Date.now();


function makeArray(path, directory, fileNames) {
    return new Promise((resolve, reject) => {
        
        // Paga a quantidade de arquivos dentro do diretório
        let filesCounter = fileNames.length;
        //   Se não tiver arquivos então retorno um array vazio
        if (!filesCounter) resolve([]);
        let list = [];
        //   Percorro os valores do array dos arquivos dentro do diretório
        for (let i = 0; i < filesCounter; i++) {
            fs.readFile(path + fileNames[i], 'latin1')

                //   .then(ret => organizeObj(directory, ret))
                // Adiciono no array os valores dos arquivos que estou lendo
                .then(ret => {
                    // console.log('RET ',ret)
                    return list.push(ret)
                })
                .then(_ => {
                    // Se o i do laço for estiver o mesmo valor do tamanho da lista de arquivos dentro do diretório
                    if (i + 1 == filesCounter) {
                        // Retorno o valor da lista só quando ela estiver com todos os arquivos do diretório que estou lendo
                        
                        if (list.length == filesCounter) return resolve(list);
                        else reject(`Lista menor que o número de arquivos de  ${directory}.`);
                    }
                }).catch(err => reject(err));
        }
    });
}
//   Pega os arquivos dentro do diretório
function getListFiles(path, directory) {
    // Irá listar os arquivos dentro do diretório
    return fs.readdir(path).then(files => {
        //Se tiver arquivos retorno os arquivos dentro do diretório
        // console.log('FILES= ',path,directory)
        if (files.length) return files;
        //   Se não tiver arquivos então imprimo o error
        else {
            console.log('w', `Não há arquivos de monitoramento na pasta ${directory}`);
            return []
        }
    }).catch(err => {
        console.log('e', `Erro ao tentar obter lista de arquivos de monitoramento de SENSOR. Pasta ${directory}`);
        console.log(err);
        return [];
    });
}


module.exports= function getAllSensors() {
    let directories = [
        'sns'
    ];
    let allSensors = [];
    // Array de sensores que irei usar para enviar para api.sensorMonitoring

    return getListFiles(`${source}/${directories[0]}/`, directories[0])
        .then(sensors => {
            // sensors = Arquivos dentro do diretório
            return makeArray(`${source}/${directories[0]}/`, directories[0], sensors);
        }).then(data => {
            
            allSensors = allSensors.concat(data);
            allSensors.map(e=>{
                api.sensorMonitoring.push(JSON.parse(e))
            })
            return true

            // console.log('API SENSOR= ',api.sensorMonitoring)
            // return fs.writeFile(writePath,`[${api.sensorMonitoring}]`, { flag: "w" })



        })
        .then(data=>{
            knex("notifications")
            // PEGO DO BANCO
            .then((ndata) => {
              // MAP DO BANCO - PERCORRENDO O ARRAY
              ndata.map((banco) => {
                // MAP DO JSON
                api.sensorMonitoring.map((json) => {
                //   console.log('API SENSOR= ',json)
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
                                  to:banco.EMAIL,
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
        
        .catch(err => {
            if (typeof err != 'string' || err.indexOf(`Lista menor`) < 0) {
                console.log(err);
            }
            return;
        })
    .then(_ =>
        setTimeout(getAllSensors, 2000)
    );
}

// getAllSensors()