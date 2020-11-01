const path = require("path");
// Update with your config settings.

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'localhost',
    user : 'root',
    password: "1234",
    database: "test",
  },

  useNullAsDefault: true
});

module.exports= knex