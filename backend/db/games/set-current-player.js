const database = require("../connection");
const { connection: db } = database;

// const SET_CURRENT_PLAYER = `
//   UPDATE games SET current_player=$1
//   WHERE id=$2
//   RETURNING current_player
// `;

const SET_CURRENT_PLAYER = `
  UPDATE game_users SET current_player=0
  WHERE user_id=$1 AND id=$2
`; 

const setCurrentPlayer = (playerId, gameId) =>
  db.none(SET_CURRENT_PLAYER, [playerId, gameId]);

module.exports = { setCurrentPlayer };

