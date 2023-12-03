const database = require("../connection");
const { connection: db } = database;

const SET_CURRENT_PLAYER = `
  UPDATE games SET current_player=$1
  WHERE id=$2
  RETURNING current_player
`;

const setCurrentPlayer = (playerId, gameId) =>
  db.one(SET_CURRENT_PLAYER, [playerId, gameId]);

module.exports = { setCurrentPlayer };
