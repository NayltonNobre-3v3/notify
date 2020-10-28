import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import route from "./routes";
import getAllSensors from './WriteRead/function/concatTxt.js'

const fs = require('fs-extra')
const path = require('path')

const api = require('./helpers/monitoring-variables');
const source = 'C:/Users/davi/Downloads';
const writePath = 'C:/Users/davi/Downloads/files.json'


const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

getAllSensors()


app.use(route);

app.listen(8000, () => {
  console.log("Rodando em http://localhost:8000");
});
