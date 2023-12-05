const database = require("../connection");
const { connection: db } = database;


const GET_CHIP_COUNT = `
    SELECT chip_count FROM game_users
    WHERE user_id=$1 AND game_id=$2
`;

const getChipCount = (userId, gameId) =>
  db.one(GET_CHIP_COUNT, [userId, gameId]);

module.exports = { getChipCount };