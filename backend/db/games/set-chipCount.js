const database = require("../connection");
const { connection: db } = database;


const UPDATE_CHIP_COUNT = `
  UPDATE game_users
  SET chip_count=$3
  WHERE user_id=$1 AND game_id=$2
`;

const setChipCount = (userId, gameId, chipCount) =>
  db.none(UPDATE_CHIP_COUNT, [userId, gameId, chipCount]);

module.exports = { setChipCount };