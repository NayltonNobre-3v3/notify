const path = require("path");
// Update with your config settings.

// var knex = require('knex')({
//   client: 'mysql',
//   connection: {
//     host : 'localhost',
//     user : 'root',
//     password : '123v312',
//     database : 'newsir'
//   },

//   useNullAsDefault: true
// });

// export default knex

// const path=require('path')
// module.exports = {
//     client: 'mysql',
//     connection:{
//       host : 'localhost',
//       user:'root',
//       password : '123v312',
//       database : 'newsir'
//     },
//     useNullAsDefault: true

// }

// import path from "path";
module.exports = {
  client: "mysql",
  connection: {
    host: "localhost",
    user: "root",
    password: "3v3",
    database: "NOTIFY",
  },
  migrations: {
    directory: path.resolve(__dirname, "src", "database", "migrations"),
  },
  useNullAsDefault: true,
};
