const database = require("../connection");
const { connection: db } = database;

const GET_AVAILABLE_GAMES = "SELECT * FROM games";
const GET_LEFT_GAMES = `SELECT game_id FROM game_users WHERE user_id=$1`;

const getAvailableGames = () => db.any(GET_AVAILABLE_GAMES);
const getLeftGames = (userId) => db.any(GET_LEFT_GAMES, [userId]);

module.exports = { getAvailableGames, getLeftGames };
