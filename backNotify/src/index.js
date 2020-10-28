import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import route from "./routes";
import getAllSensors from './WriteRead/function/concatTxt.js'

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Transforma TXT em JSON para realizar a leitura dos sensores
getAllSensors()


app.use(route);

app.listen(8000, () => {
  console.log("Rodando em http://localhost:8000");
});
