const database = require("../connection");
const { connection: db } = database;

const GET_PLAYER_BY_SEAT =
  "SELECT user_id FROM game_users WHERE current_player=$1 AND game_id=$2";

const getPlayerByTurnOrder = (seatIndex, gameId) =>
  db.one(GET_PLAYER_BY_SEAT, [seatIndex, gameId]);

module.exports = { getPlayerByTurnOrder };
