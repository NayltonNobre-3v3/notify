const path = require("path");
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
