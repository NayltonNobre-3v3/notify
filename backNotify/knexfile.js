const path = require("path");
module.exports = {
  client: "mysql",
  connection: {
    host: "localhost",
    user: "root",
    password: "123v312",
    database: "newsir",
  },
  migrations: {
    directory: path.resolve(__dirname, "src", "database", "migrations"),
  },
  useNullAsDefault: true,
};
