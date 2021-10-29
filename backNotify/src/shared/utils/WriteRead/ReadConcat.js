// Diretório
const rootDIR = "C:/Users/davis/Documents/Sirv4Tests/fcir";
const folders = ['sns', 'dir', 'mtd', 'eqp']
// const DIR = "/mnt/fcir";
import monitoring_files from "../variables_api/monitoring-variables";

import {readAllDirs} from '../../utils/readAndOrganizeFiles'

import knex from "../../infra/knex/connections";
import MailProvider from "../../container/provider/MailProvider";
import moment from "moment-timezone";

// Array momentâneo no qual irá guardar os dados que estão na condição especificada
let off_range_sensors = [];

let current_date = Date.now();

const loop = () => {
  setTimeout(() => {
    readAllDirs(rootDIR,folders)
      .then(files => {
        // Torna disponível para toda a aplicação
        monitoring_files.files = files
        return files

      })
      .then((files) => {
        //Organizar os arquivos para leitura local 
        let only_files = []
        for (let items of Object.values(files)) {
          if (items.length) {
            items.forEach(file => {
              only_files.push(file)
            });
          }
        }
        return only_files
      })
      .then((monit_files) => Notification(monit_files))
      .catch((err) => console.log(err))
      .then(() => loop());
  }, 2000);
};

async function Notification(monit_files) {
  const notifications = await knex("notifications")

  notifications.forEach((notif) => {
    const sensor = monit_files.find(sensor => sensor.ID === notif.ID_SENSOR);
    current_date = Date.now();
    if (!sensor) {
      throw "Sensor not found";
    }

    if (notif.CONDITION === "ACIMA") {
      // Sensor com valor específico acima do que está no banco
      if (sensor.VALUE[notif.POSITION] > notif.VALUE) {
        // Verificar se existe ou não os valores no array de sensores
        //  que satisfazem tal condição
        const include = off_range_sensors.findIndex((off_range) => {
          return off_range.ID === notif.ID;
        });
        // Se nÃ£o existir no array irá adicioanar o sensor dentro da especificação
        if (include < 0) {
          off_range_sensors.push({
            ID: notif.ID,
            ID_SENSOR: notif.ID_SENSOR,
            CONDITION: notif.CONDITION,
            //Se foi enviado o e-mail ou não
            email: false,
            time: current_date,
            VALUE: notif.VALUE,
            //   VALOR ATUAL DO SENSOR
            VALUE_JSON: sensor.VALUE[notif.POSITION],
            MEDITION_TYPE: notif.MEDITION_TYPE,
            UNIT: notif.UNIT,
            TIME: notif.TIME,
            POS: notif.POSITION,
            EMAIL: notif.EMAIL,
            NAME: notif.NAME,
            CREATED_NOTIF: notif.CREATED_AT,
          });
        }
        // Se existir e nÃ£o tive enviado o email entÃ£o calculo o tempo
        else if (include >= 0) {
          // Pego o meu horário atual e subtraio com o horário que estão no array
          const repeatItem = off_range_sensors.findIndex(
            (repeat) => repeat.ID === notif.ID
          );

          let variacao =
            moment(current_date).unix() -
            moment(off_range_sensors[repeatItem].time).unix();
          // Se estiver acima do valor que estÃ¡ no banco
          if (variacao > notif.TIME) {
            // Mudar a variável email para true
            // Se não tiver enviado o email
            if (off_range_sensors[repeatItem].email === false) {
              moment;
              MailProvider.gmail.sendMail(
                {
                  from: "Alertas3v3@gmail.com",
                  to: notif.EMAIL,
                  template: "auth/sensorAlert",
                  subject: "Alerta de sensor! 3v3",
                  context: {
                    sensorName: sensor.NAME,
                    cond: notif.CONDITION,
                    value: notif.VALUE,
                    medition_type: notif.MEDITION_TYPE,
                    VALUE_JSON: sensor.VALUE[notif.POSITION],
                    unit: notif.UNIT,
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
              console.log("Condição acima -> EMAIL ENVIADO PARA -> ", off_range_sensors[repeatItem].EMAIL);
              console.log(off_range_sensors[repeatItem]);
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
            (e) => (e.VALUE_JSON = sensor.VALUE[notif.POSITION])
          );
        }
      }

      //Se sair da faixa dos valores da condição ACIMA então irá apagar o registro do off_range_sensors
      // OBS: irá apagar somente o valor que sair da faixa, condição muito específica
      else {
        const include = off_range_sensors.findIndex((off_range) => {
          return (
            off_range.ID === notif.ID
          );
        });

        if (
          include >= 0 &&
          off_range_sensors[include].email === true
        ) {
          const filteredItems = off_range_sensors.filter((item) => {
            return item.UID !== off_range_sensors[include].UID;
          });
          off_range_sensors = filteredItems;
        }
        return;
      }
    }
    //   CONDIÇÃO ABAIXO
    else {
      // Sensor com valor específico acima do que está no banco
      if (sensor.VALUE[notif.POSITION] < notif.VALUE) {
        // Verificar se existe ou não os valores no array de sensores
        //  que satisfazem tal condição
        const include = off_range_sensors.findIndex((off_range) => {
          return off_range.ID === notif.ID;
        });
        // Se nÃ£o existir no array irá adicioanar o sensor dentro da especificação
        if (include < 0) {
          off_range_sensors.push({
            ID: notif.ID,
            ID_SENSOR: notif.ID_SENSOR,
            CONDITION: notif.CONDITION,
            //Se foi enviado o e-mail ou não
            email: false,
            time: current_date,
            VALUE: notif.VALUE,
            //   VALOR ATUAL DO SENSOR
            VALUE_JSON: sensor.VALUE[notif.POSITION],
            MEDITION_TYPE: notif.MEDITION_TYPE,
            UNIT: notif.UNIT,
            TIME: notif.TIME,
            POS: notif.POSITION,
            EMAIL: notif.EMAIL,
            NAME: notif.NAME,
            CREATED_NOTIF: notif.CREATED_AT,
          });
        }
        // Se existir e nÃ£o tive enviado o email entÃ£o calculo o tempo
        else if (include >= 0) {
          // Pego o meu horário atual e subtraio com o horário que estão no array
          const repeatItem = off_range_sensors.findIndex(
            (repeat) => repeat.ID === notif.ID
          );

          let variacao =
            moment(current_date).unix() -
            moment(off_range_sensors[repeatItem].time).unix();
          // Se estiver acima do valor que estÃ¡ no banco
          if (variacao > notif.TIME) {
            // Mudar a variável email para true
            // Se não tiver enviado o email
            if (off_range_sensors[repeatItem].email === false) {
              moment;
              MailProvider.gmail.sendMail.sendMail(
                {
                  from: "Alertas3v3@gmail.com",
                  to: notif.EMAIL,
                  template: "auth/sensorAlert",
                  subject: "Alerta de sensor! 3v3",
                  context: {
                    sensorName: sensor.NAME,
                    cond: notif.CONDITION,
                    value: notif.VALUE,
                    medition_type: notif.MEDITION_TYPE,
                    VALUE_JSON: sensor.VALUE[notif.POSITION],
                    unit: notif.UNIT,
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
              console.log("Condição abaixo -> EMAIL ENVIADO PARA -> ", off_range_sensors[repeatItem].EMAIL);
              console.log(off_range_sensors[repeatItem]);
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
            (e) => (e.VALUE_JSON = sensor.VALUE[notif.POSITION])
          );
        }
      }

      //Se sair da faixa dos valores da condição ACIMA então irá apagar o registro do off_range_sensors
      // OBS: irá apagar somente o valor que sair da faixa, condição muito específica
      else {
        const include = off_range_sensors.findIndex((off_range) => {
          return (
            off_range.ID === notif.ID
          );
        });

        if (
          include >= 0 &&
          off_range_sensors[include].email === true
        ) {
          const filteredItems = off_range_sensors.filter((item) => {
            return item.UID !== off_range_sensors[include].UID;
          });
          off_range_sensors = filteredItems;
        }
        return;
      }
    }
  });
}



export default loop;
