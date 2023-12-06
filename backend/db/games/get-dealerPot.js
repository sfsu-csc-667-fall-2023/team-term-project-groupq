const database = require("../connection");
const { connection: db } = database;


const GET_POT_COUNT = `
  SELECT pot_count FROM games
  WHERE id=$1
`;

const getPotCount = (gameId) =>
  db.one(GET_POT_COUNT, [gameId]);

module.exports = { getPotCount };