const database = require("../connection");
const { connection: db } = database;

const SET_PLAYER_TURN_ORDER = `
  UPDATE game_users SET current_player=$1
  WHERE user_id=$2 AND game_id=$3
`;

const setPlayerTurnOrder = (TurnOrder, playerId, gameId) =>
  db.none(SET_PLAYER_TURN_ORDER, [TurnOrder, playerId, gameId]);

module.exports = { setPlayerTurnOrder };
