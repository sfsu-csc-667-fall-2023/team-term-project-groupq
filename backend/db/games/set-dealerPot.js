const database = require("../connection");
const { connection: db } = database;


const UPDATE_POT_COUNT = `
  UPDATE games
  SET pot_count=$2
  WHERE id=$1
`;

const setPotCount = (gameId, potCount) =>
  db.none(UPDATE_POT_COUNT, [gameId, potCount]);

module.exports = { setPotCount };