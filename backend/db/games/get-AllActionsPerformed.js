const database = require("../connection");
const { connection: db } = database;


const SELECT_ALL_ACTIONS = `
  SELECT count(performed_action)
  FROM game_users
  WHERE NOT performed_action AND game_id=$1
`;

const getAllAction = (gameId) =>
  db.any(SELECT_ALL_ACTIONS, [gameId]);

module.exports = { getAllAction };