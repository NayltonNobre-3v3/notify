//NPM dependences
import fs from "fs-extra";
import express, { Router } from "express";
import path from "path";

//local dependencs
const router = Router();

const api = require("../variables_api/monitoring-variables");
const source = path.resolve(__dirname, "..", "json", "GET");
// const source ='../json/GET/'

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

export function createAPI() {
  return fs
    .readdir(source)
    .then((files) => {
      concatenateFiles(files).then((ret) => {
        api.dirMonitoring = ret;
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
