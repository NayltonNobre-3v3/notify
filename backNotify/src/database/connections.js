const path = require("path");
// Update with your config settings.

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'localhost',
    user : 'root',
    password : '3v3',
    database : 'NOTIFY'
  },

  useNullAsDefault: true
});

export default knex