const database = require("../connection");
const { connection: db } = database;

const GET_CURRENT_PLAYER = `
  SELECT user_id FROM game_users WHERE current_player=0 AND game_id=$1`;

const getCurrentPlayer = (gameId) => db.one(GET_CURRENT_PLAYER, [gameId]);

module.exports = { getCurrentPlayer };
