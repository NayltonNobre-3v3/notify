// Update with your config settings.
require('dotenv').config();
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.HOST,
    user: process.env.USER,
    // password: "1234",
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },

  useNullAsDefault: true
});

module.exports= knex
