// Update with your config settings.

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'localhost',
    user : 'root',
    password: "1234",
    // password: "123v312",
    database: "newsir",
  },

  useNullAsDefault: true
});

module.exports= knex
