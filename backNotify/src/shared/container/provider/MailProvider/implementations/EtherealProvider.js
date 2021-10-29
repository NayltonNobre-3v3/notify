import nodemailer from "nodemailer";
import fs from 'fs'
import handlebars from 'handlebars'

class EtherealProvider {
  client = null
  constructor() {
    nodemailer
        .createTestAccount()
        .then((account)=>{
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass,
                },
            });
            this.client = transporter;
        })
        .catch((err) => console.error('[ERROR] - EtherealProvider -> ',err));
    
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
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
        }

        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });

  }
}
export {
  EtherealProvider
};