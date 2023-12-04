const database = require("../connection");
const { connection: db } = database;

const IS_CURRENT_PLAYER = `
  SELECT current_player FROM games
  WHERE id=$1
`;

// Returns a boolean
const isCurrentPlayer = (gameId, userId) =>
  db
    .one(IS_CURRENT_PLAYER, [gameId])
    .then(({ current_player: playerId }) => playerId === userId);

module.exports = { isCurrentPlayer };
