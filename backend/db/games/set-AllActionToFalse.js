const database = require("../connection");
const { connection: db } = database;


const UPDATE_ACTION_TO_FALSE = `
  UPDATE game_users
  SET performed_action='false'
  WHERE game_id=$1
`;

const setAllActiontoFalse = (gameId) =>
  db.none(UPDATE_ACTION_TO_FALSE, [gameId]);

module.exports = { setAllActiontoFalse };