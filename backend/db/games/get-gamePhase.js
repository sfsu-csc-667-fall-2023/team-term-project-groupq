const database = require("../connection");
const { connection: db } = database;


const SELECT_GAME_PHASE = `
  SELECT game_phase FROM games
  WHERE id=$1
`;

const getGamePhase = (gameId) =>
  db.none(SELECT_GAME_PHASE, [gameId]);

module.exports = { getGamePhase };