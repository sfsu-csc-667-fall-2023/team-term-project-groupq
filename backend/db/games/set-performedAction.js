const database = require("../connection");
const { connection: db } = database;


const UPDATE_PERFORMED_ACTION = `
  UPDATE game_users
  SET performed_action=$3
  WHERE user_id=$1 AND game_id=$2
`;

const setPerformedAction = (userId, gameId, performedAction) =>
  db.none(UPDATE_PERFORMED_ACTION, [userId, gameId, performedAction]);

module.exports = { setPerformedAction };