const database = require("../connection");
const { connection: db } = database;


const GET_CHIP_COUNT = `
    SELECT chip_count FROM game_users
    WHERE user_id=$1 AND game_id=$2
`;

const GET_STARTING_CHIP = `
  SELECT starting_chips FROM games
  WHERE id=$1
`;

const STILL_HAVE_CHIPS = `
  SELECT chip_count FROM game_users
  WHERE user_id=$1 AND game_id=$2
`; 

const getChipCount = (userId, gameId) =>
  db.one(GET_CHIP_COUNT, [userId, gameId]);

const getStartingChips = (gameId) =>
db.one(GET_STARTING_CHIP, [gameId]);

const stillHaveChips = (userId, gameId) =>
db.one(STILL_HAVE_CHIPS, [userId, gameId]).then(({ chip_count }) => chip_count === 0);

module.exports = { getChipCount, getStartingChips, stillHaveChips };