const database = require("../connection");
const { connection: db } = database;


const UPDATE_GAME_PHASE = `
  UPDATE games
  SET game_phase=$2
  WHERE id=$1
`;

const setGamePhase = (gameId, gamePhase) =>
  db.none(UPDATE_GAME_PHASE, [gameId, gamePhase]);

module.exports = { setGamePhase };