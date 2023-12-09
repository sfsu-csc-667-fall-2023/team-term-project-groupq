const database = require("../connection");
const { connection: db } = database;


const GET_ROUND_WINNER = `
  SELECT round_winner FROM games
  WHERE id=$1
`;

const GET_FOLDER_WINNER = `
  SELECT user_id FROM game_users
  WHERE game_id=$1 AND NOT user_id=$2
`;

const getRoundWinner = (gameId) =>
  db.one(GET_ROUND_WINNER, [gameId]);

const getFolderWinner = (gameId, userId) =>
  db.one(GET_FOLDER_WINNER, [gameId, userId]);

module.exports = { getRoundWinner, getFolderWinner };