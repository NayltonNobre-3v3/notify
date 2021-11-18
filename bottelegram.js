const { Telegraf } = require('telegraf')

const BOT_TOKEN = "2138693355:AAGIENksrmbZ3jfgeUsTDDsJb8yZlTitnAc";
const CHAT_ID = "-1001751528466"
//Variável responsável pelo TOKEN.


const bot = new Telegraf(BOT_TOKEN)

const cron = require('node-cron')
const express = require("express");

app = express();

const envtelegram = new cron.schedule('*/5 * * * *', () => {
  let data = new Date();
  let hora = data.getHours();
  let min = data.getMinutes();
  let hourcomplete = hora + ':' + min;
//Variáveis responsáveis por retornar a data e hora atual.
  bot.telegram.sendMessage(CHAT_ID, 
    '\u{1F501}' + 'Verificação executada as ' 
    + hourcomplete  + '. ' + '\u{1F55C}'
    + '\nhá [X] Dispositivos com problema' + ', '
    + '\nhá [X] Atuadores com problema' + ', ' 
    + '\nhá [X] Sensores com problema, \n\nSegue abaixo suas especificações:' + ' \u{1F4AC}'
    + ' \n\n\u{1F4F6}' + 'Dispositivos:' 
    + '\nXXXXXXXXXXXXXXXX'
    + '\nXXXXXXXXXXXXXXXX'
    + ' \n\n\u{1F4A7}' + 'Atuadores:'    
    + '\nXXXXXXXXXXXXXXXX'
    + '\nXXXXXXXXXXXXXXXX'
    + ' \n\n\u{1F321}' + 'Sensores:'    
    + '\nXXXXXXXXXXXXXXXX'
    + '\nXXXXXXXXXXXXXXXX'
    )});
//função responsável pela mensagem da varredura dos alertas.
const envtelegram2 = new cron.schedule('0 7 * * *', () =>{
  bot.telegram.sendMessage(CHAT_ID, 'Bom dia a todos!')
  
});
//teste - função responsável por ser educado part1

const envtelegram3 = new cron.schedule('1 13 * * *', () => {
  bot.telegram.sendMessage(CHAT_ID, 'Boa tarde a todos!')
})
//teste - função responsável por ser educado part2

const envtelegram4 = new cron.schedule('0 18 * * *', () => {
  bot.telegram.sendMessage(CHAT_ID, 'Boa noite a todos!')
})
//teste - função responsável por ser educado part3

  bot.launch();

