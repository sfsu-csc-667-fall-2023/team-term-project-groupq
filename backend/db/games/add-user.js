const database = require("../connection");
const { connection: db } = database;
const { userCount } = require("./user-count");

const USERS_EXISTS =
  "SELECT count(*) FROM game_users WHERE user_id=$1 AND game_id=$2";

const ADD_USER =
  "INSERT INTO game_users (user_id, game_id, current_player) VALUES ($1, $2, $3)";

// AddUser = count the number of users in game, and the playercount becomes the seat number (turn order)

const userExistsAlready = (userId, gameId) =>
  db.any(USERS_EXISTS, [userId, gameId]);

const addUser = (userId, gameId) =>
  userCount(gameId).then((playerCount) =>
    db.none(ADD_USER, [userId, gameId, playerCount]),
  );

// const test = (userId, gameId) => {

//   return userExistsAlready(userId, gameId)
//     .then((playerCount) => {

//       if (playerCount == 0) {
//         return db.none(ADD_USER, [userId, gameId, playerCount]);
//       }
//       else {
//         return null;
//       }
//     })
// };

module.exports = { addUser };
