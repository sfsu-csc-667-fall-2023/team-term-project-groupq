const db = require("./connection");

const USER_EXISTENCE = "SELECT username FROM users WHERE username=$1;";
const ADD_USER =
  "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username;";
const SIGN_USER_IN = "SELECT * FROM users WHERE username=$1;";
const SELECT_ONE = "SELECT * FROM users LIMIT 1;";

const username_exists = (username) =>
  db
    .one(USER_EXISTENCE, [username])
    .then((_) => true)
    .catch((_) => false);

const create = (username, password) => db.one(ADD_USER, [username, password]);

const find_username = (username) => db.one(SIGN_USER_IN, [username]);

const select_one = () => db.one(SELECT_ONE);

module.exports = {
  username_exists,
  create,
  find_username,
  select_one,
};
