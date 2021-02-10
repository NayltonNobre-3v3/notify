import * as nodemailer from "nodemailer";
import { port, host, user, pass,service } from "../config/Nodemail/mail.json";
// const { user, pass,service}=require("../config/Nodemail/mail.json")
import { resolve } from "path";
// const path=require("path")
import hbs from "nodemailer-express-handlebars";

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
      partialsDir: resolve("./resources/mail/"),
    },
    // Onde fica os templates de email
    viewPath: resolve("./resources/mail"),
    extName: ".html",
  })
);

module.exports=transport;