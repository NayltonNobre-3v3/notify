const path = require("path");
require('dotenv').config();
module.exports = {
  client: "mysql",
  connection: {
    host: process.env.HOST,
    user: process.env.USER,
    // password: "1234",
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
  migrations: {
    directory: path.resolve(__dirname, "src", "shared","infra","knex","migrations"),
  },
  useNullAsDefault: true,
};
