const database = require("./connection");
const { connection: db, pgp } = database;

const CREATE = "INSERT INTO games (game_socket_id) VALUES ($1) RETURNING id";
const ADD_USER =
  "INSERT INTO game_users (user_id, game_id, seat) VALUES ($1, $2, $3)";
const GET_GAME = "SELECT * FROM games WHERE id=$1";
const GET_AVAILABLE_GAMES = "SELECT * FROM games";

// Get the count of users when the game_id has the required number of users
const GET_USER_COUNT = "SELECT COUNT(*) FROM game_users WHERE game_id=$1";

const create = (gameSocketId) => db.one(CREATE, [gameSocketId]);

const addUser = (userId, gameId) =>
  userCount(gameId).then((playerCount) =>
    db.none(ADD_USER, [userId, gameId, playerCount]),
  );

const getGame = (gameId) => db.one(GET_GAME, gameId);

const getAvailableGames = () => db.any(GET_AVAILABLE_GAMES);

// Get the userCount by providing gameId, and then get the count field, which is a string
const userCount = (gameId) =>
  db.one(GET_USER_COUNT, [gameId]).then(({ count }) => parseInt(count));

const SHUFFLED_DECK = "SELECT *, random() AS rand FROM cards ORDER BY rand";

const initialize = async (gameId) => {
  //create a game_deck of shuffled cards
  const shuffledDeck = await db.many(SHUFFLED_DECK);
  const columns = new pgp.helpers.ColumnSet(["user_id", "game_id", "card_id"], {
    table: "game_cards",
  });
  const values = shuffledDeck.map(({ id }) => ({
    user_id: 0,
    game_id: gameId,
    card_id: id,
  }));

  const query = pgp.helpers.insert(values, columns);
  await db.none(query);

  //set the turn

  //deal cards to each player
  //send each player their cards
};

module.exports = {
  create,
  addUser,
  getGame,
  getAvailableGames,
  userCount,
  initialize,
};
