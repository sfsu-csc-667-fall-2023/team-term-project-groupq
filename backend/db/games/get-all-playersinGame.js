const database = require("../connection");
const { connection: db } = database;

const GET_PLAYERS_IN_GAME = `
  SELECT id, user_id, game_id, current_player FROM game_users
  WHERE game_id=$1
  ORDER BY user_id
`;

// Returns a boolean
const getAllPlayersinGame = (gameId) => db.many(GET_PLAYERS_IN_GAME, [gameId]);

module.exports = { getAllPlayersinGame };
