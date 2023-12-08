const database = require("../connection");
const { connection: db } = database;


const UPDATE_CHIP_COUNT = `
  UPDATE game_users
  SET chip_count=$3
  WHERE user_id=$1 AND game_id=$2
`;

const SET_STARTING_CHIP = `
UPDATE games
SET starting_chips=$2
WHERE id=$1
`;


const setChipCount = (userId, gameId, chipCount) =>
  db.none(UPDATE_CHIP_COUNT, [userId, gameId, chipCount]);

const setStartingChip = (gameId, chipCount) =>
db.none(SET_STARTING_CHIP, [gameId, chipCount]);

module.exports = { setChipCount, setStartingChip };