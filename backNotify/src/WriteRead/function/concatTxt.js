// import { writeFile } from 'fs';

const fs = require('fs-extra')
const path = require('path')

const api = require('../../helpers/monitoring-variables');
// const source = 'C:/Users/davi/Downloads';
// Caminho do arquivo que irá ser concatenado
const source = 'mnt/fcir';

// Local + Nome do arquivo que irá gerar
const writePath = 'C:/Users/davi/Downloads/files.json'
// const writePath = 'C:/Users/davi/Downloads/files.json'



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
    // Array de sensores que irei usar para enviar para api.sensorMonitoring
    let allSensors = [];

    return getListFiles(`${source}/${directories[0]}/`, directories[0])
        .then(sensors => {
          
            // sensors = Arquivos dentro do diretório
            return makeArray(`${source}/${directories[0]}/`, directories[0], sensors);
        }).then(data => {
            allSensors = allSensors.concat(data);
            api.sensorMonitoring = allSensors.toString();
            // console.log()
            return fs.writeFile(writePath,`[${api.sensorMonitoring}]`, { flag: "w" })


        })
        .then(_ =>
            allSensors.length ? true : console.log('i', 'Api de sensores vazia.')
        ).catch(err => {
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