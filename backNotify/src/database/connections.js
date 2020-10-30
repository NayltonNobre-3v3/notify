const path = require("path");
// Update with your config settings.

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'localhost',
    user : 'root',
    password : '123v312',
    database : 'newsir'
  },

  useNullAsDefault: true
});

module.exports= knex