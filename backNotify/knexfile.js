// const path=require('path')
// Update with your config settings.

// var knex = require('knex')({
//   client: 'mysql',
//   connection: {
//     host : 'localhost',
//     user : 'root',
//     password : '1234',
//     database : 'test'
//   },
//   migrations: {
//     tableName: 'notifications'
//   },
//   useNullAsDefault: true
// });

// export default knex


const path=require('path')
module.exports = {
    client: 'mysql',
    connection:{
      host : 'localhost',
      user:'root',
      password : '1234',
      database : 'test'
    },
    useNullAsDefault: true

}