// Update with your config settings.
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'localhost',
    user : 'root',
    password : '123v312',
    database : 'newsir'
  }
});

export default knex