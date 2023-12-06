const database = require("../connection");
const { connection: db } = database;


const GET_PERFORMED_ACTION = `
  SELECT performed_action 
  FROM game_users
  WHERE user_id=$1 AND game_id=$2
`;

const getPerformedAction = (userId, gameId) =>
  db.none(GET_PERFORMED_ACTION, [userId, gameId]);

module.exports = { getPerformedAction };