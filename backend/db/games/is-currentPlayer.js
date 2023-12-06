const database = require("../connection");
const { connection: db } = database;

const IS_CURRENT_PLAYER = `
  SELECT current_player FROM game_users
  WHERE user_id=$1 AND game_id=$2
`;

// Returns a boolean
const isCurrentPlayer = (gameId, userId) =>
  db
    .one(IS_CURRENT_PLAYER, [userId, gameId])
    .then(({ current_player: playerId }) => playerId == 0);

module.exports = { isCurrentPlayer };
