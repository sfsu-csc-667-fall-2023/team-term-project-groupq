const database = require("../connection");
const { connection: db } = database;

const GET_AVAILABLE_GAMES = "SELECT * FROM games";

const getAvailableGames = () => db.any(GET_AVAILABLE_GAMES);

module.exports = { getAvailableGames };
