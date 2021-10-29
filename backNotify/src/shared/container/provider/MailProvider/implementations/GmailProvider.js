import nodemailer from "nodemailer";
import { port, host, user, pass, service } from "../../../../../config/Nodemail/mail.json";
// const { user, pass,service}=require("../config/Nodemail/mail.json")
import { resolve } from "path";
// const path=require("path")
// import hbs from "nodemailer-express-handlebars";
import fs from 'fs'
import handlebars from 'handlebars'

class GmailProvider {
  client = null
  constructor() {
    this.client = nodemailer.createTransport({
      service,
      host: "mail.hover.com",
      port: 465,
      secure: true,
      auth: { user, pass },
      tls: {
        secureProtocol: "TLSv1_method"
      }
    });
  }
  async sendMail(
    {
      to,
      subject,
      template_path,
      context
    }
  ) {
    const templateHbs = fs.readFileSync(template_path).toString("utf-8")
    const templateParse = handlebars.compile(templateHbs)
    const templateHTML = templateParse(context)
    let message = {
      from: "Davi <Alertas3v3@gmail.com>",
      to,
      subject: `${subject}`,
      html: templateHTML
    }
    await this.client.sendMail(message, (err, info) => {
      if (err) {
        console.log("Error occurred. " + err.message);
        return process.exit(1);
      }

      console.log("Message sent: %s", info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log(`Enviado para ${to}`);
    })

  }
}
export {
  GmailProvider
};