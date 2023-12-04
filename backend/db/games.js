const database = require("./connection");
const { connection: db, pgp } = database;
const Users = require("./users");

const { addUser } = require("./games/add-user");
const { getGame } = require("./games/get-game");
const { userCount } = require("./games/user-count");
const { createShuffledDeck } = require("./games/shuffle-deck");
const { create } = require("./games/create-game");
const { getAvailableGames } = require("./games/get-availableGames");
const { getUsers } = require("./games/get-users");
const { getPlayerByTurnOrder } = require("./games/get-player-by-turnOrder");
const { setCurrentPlayer } = require("./games/set-current-player");
const { getCardsperPlayers } = require("./games/get-cards-per-players");
const { isInitialized } = require("./games/is-initialized");
const { readyPlayer } = require("./games/players-ready");
const { dealCards } = require("./games/deal-cards");
const { setInitialized } = require("./games/set-initialized");
const { getState } = require("./games/get-state");
const { isCurrentPlayer } = require("./games/is-currentPlayer");
const { getCurrentPlayer } = require("./games/get-current-player");
const { initialize } = require("./games/initialize");

module.exports = {
  create,
  addUser,
  userCount,
  createShuffledDeck,
  getUsers,
  getPlayerByTurnOrder,
  setCurrentPlayer,
  getCardsperPlayers,
  getGame,
  getAvailableGames,
  initialize,
  isInitialized,
  readyPlayer,
  dealCards,
  setInitialized,
  getState,
  isCurrentPlayer,
  getCurrentPlayer
};