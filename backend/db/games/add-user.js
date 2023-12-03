const database = require("../connection");
const { connection: db } = database;
const { userCount } = require("./user-count");

const ADD_USER =
  "INSERT INTO game_users (user_id, game_id, current_player) VALUES ($1, $2, $3)";

// AddUser = count the number of users in game, and the playercount becomes the seat number (turn order)
const addUser = (userId, gameId) =>
  userCount(gameId).then((playerCount) =>
    db.none(ADD_USER, [userId, gameId, playerCount]),
  );

module.exports = { addUser };
