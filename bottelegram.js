const { Telegraf } = require('telegraf')

const BOT_TOKEN = "2138693355:AAGIENksrmbZ3jfgeUsTDDsJb8yZlTitnAc";
const CHAT_ID = "-1001751528466"
//Variável responsável pelo TOKEN.

const bot = new Telegraf(BOT_TOKEN, { polling: true })

const cron = require('node-cron')

let data = new Date();
let hora = data.getHours();
let min = data.getMinutes();
let seg = data.getSeconds();
let str_hora = hora + ':' + min + ':' + seg;
//Variáveis responsáveis por retornar a data e hora atual.
cron.schedule('*/2 * * * * *', () => {
bot.telegram.sendMessage(CHAT_ID, 'Varredura executada as ' + str_hora + '.'
)})

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))



//bot.hears('Olá', (ctx) => ctx.reply('Hello ' + ctx.from.first_name + '!'));

/*bot.command ('teclado', (ctx) => { 
    ctx.reply ( 
      'Teclado', 
      Markup.inlineKeyboard ([ 
        Markup.button.callback ('Primeira opção', 'primeiro'), 
        Markup.button.callback (' Segunda opção ',' segunda '), 
      ]) 
    ); 
  });
 bot.launch();*/

 //bot.command('quit', (ctx) => {
    // Explicit usage
    //ctx.telegram.leaveChat(ctx.message.chat.id)
  
    // Using context shortcut