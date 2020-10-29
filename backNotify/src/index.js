// import express from "express";
const express = require("express");
// import cors from "cors";
const cors = require("cors");
// import bodyParser from "body-parser";
const bodyParser = require("body-parser");
// import route from "./routes";
const route = require("./routes");
// import getAllSensors from './WriteRead/function/concatTxt.js'
const getAllSensors = require("./WriteRead/function/ReadConcat");

const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "..", "..", "notify", "build")));

app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "notify", "build", "index.html")
  );
});

// Transforma TXT em JSON e realiza a leitura dos sensores
getAllSensors();

app.use(route);

app.listen(8000, () => {
  console.log("Rodando em http://localhost:8000");
});
