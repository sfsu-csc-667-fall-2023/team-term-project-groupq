const database = require("../connection");
const { connection: db } = database;


const GET_ROUND_WINNER = `
  SELECT round_winner FROM games
  WHERE id=$1
`;

const getRoundWinner = (gameId) =>
  db.one(GET_ROUND_WINNER, [gameId]);

module.exports = { getRoundWinner };