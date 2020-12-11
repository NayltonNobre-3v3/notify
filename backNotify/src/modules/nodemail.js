// import * as nodemailer from "nodemailer";
const nodemailer=require("nodemailer")
// import { port, host, user, pass,service } from "../config/Nodemail/mail.json";
const { user, pass,service}=require("../config/Nodemail/mail.json")
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
      partialsDir: path.resolve("./resources/mail/"),
    },
    // Onde fica os templates de email
    viewPath: path.resolve("./resources/mail"),
    extName: ".html",
  })
);

module.exports=transport;