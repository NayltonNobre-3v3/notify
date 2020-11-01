// import * as nodemailer from "nodemailer";
const nodemailer=require("nodemailer")
// import { port, host, user, pass,service } from "../config/Nodemail/mail.json";
const {port, host, user, pass,service}=require("../config/Nodemail/mail.json")
// import { resolve } from "path";
const path=require("path")
const hbs = require("nodemailer-express-handlebars");

const transport = nodemailer.createTransport({
  service,
  secure: true,
  auth: { user, pass },
});

transport.use(
  "compile",
  hbs({
    viewEngine: {
      defaultLayout: undefined,
      partialsDir: path.resolve("./src/resources/mail/"),
    },
    // Onde fica os templates de email
    viewPath: path.resolve("./src/resources/mail"),
    extName: ".html",
  })
);

module.exports=transport;