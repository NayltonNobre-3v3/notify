const path = require("path");
module.exports = {
  client: "mysql",
  connection: {
    host: "localhost",
    user: "root",
    password: "1234",
    database: "test",
  },
  migrations: {
    directory: path.resolve(__dirname, "src", "database", "migrations"),
  },
  useNullAsDefault: true,
};
