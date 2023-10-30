const pgp = require("pg-promise")();
const connection = pgp("postgres://victor:9988@localhost:5432/teamq");
module.exports = connection;
