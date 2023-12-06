const database = require("../connection");
const { connection: db } = database;


const SET_ROUND_WINNER = `
  UPDATE games SET round_winner=$1
  WHERE id=$2
`;

const setRoundWinner = (userId, gameId) =>
  db.none(SET_ROUND_WINNER, [userId, gameId]);

module.exports = { setRoundWinner };