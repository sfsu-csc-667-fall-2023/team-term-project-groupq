const database = require("../connection");
const { connection: db } = database;

const GET_TURN_ORDER = `
  SELECT user_id, current_player
  FROM game_users
  WHERE game_id=$1
`;

const getTurnOrder = (gameId) => db.many(GET_TURN_ORDER, [gameId]);

module.exports = { getTurnOrder };
