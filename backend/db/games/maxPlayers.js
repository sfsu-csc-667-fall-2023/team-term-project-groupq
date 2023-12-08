const database = require("../connection");
const { connection: db } = database;


const UPDATE_START_COUNT = `
  UPDATE games
  SET players_allowed=$2
  WHERE id=$1
`;

const SELECT_START_COUNT = `
  SELECT players_allowed FROM games
  WHERE id=$1
`;


const setStartingPlayersAllowed = (gameId, chipCount) =>
  db.none(UPDATE_START_COUNT, [gameId, chipCount]);

const getStartingPlayersAllowed = (gameId) =>
  db.one(SELECT_START_COUNT, [gameId]);

module.exports = { setStartingPlayersAllowed, getStartingPlayersAllowed };