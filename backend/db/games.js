const database = require("./connection");
const { connection: db, pgp } = database;
const Users = require("./users");

const { addUser } = require("./games/add-user");
const { getGame } = require("./games/get-game");
const { userCount } = require("./games/user-count");
const { createShuffledDeck } = require("./games/shuffle-deck");
const { create } = require("./games/create-game");
const { getAvailableGames, getLeftGames } = require("./games/get-availableGames");
const { getUsers, getUserSID, getActivePlayers, isAlreadyInGame, getPlayerGameCount } = require("./games/get-users");
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
const { isPlayerInGame } = require("./games/is-player-inGame");
const { getAllPlayersinGame } = require("./games/get-all-playersinGame");
const { getTurnOrder } = require("./games/get-turnOrder");
const { setPlayerTurnOrder } = require("./games/set-player-turnOrder");
const { getChipCount, getStartingChips, stillHaveChips } = require("./games/get-chipCount");
const { getPotCount } = require("./games/get-dealerPot");
const { setPotCount } = require("./games/set-dealerPot");
const { getPerformedAction } = require("./games/get-performedAction");
const { setPerformedAction } = require("./games/set-performedAction");
const { setAllActiontoFalse } = require("./games/set-AllActionToFalse");
const { getAllAction } = require("./games/get-AllActionsPerformed");
const { setGamePhase } = require("./games/set-gamePhase");
const { getGamePhase } = require("./games/get-gamePhase");
const { setRoundWinner } = require("./games/set-roundWinner");
const { getRoundWinner, getFolderWinner } = require("./games/get-roundWinner");
const { setChipCount, setStartingChip } = require("./games/set-chipCount");
const { setStartingPlayersAllowed, getStartingPlayersAllowed } = require("./games/maxPlayers");
const { nextRound } = require("./games/next-round");

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
  getCurrentPlayer,
  isPlayerInGame,
  getAllPlayersinGame,
  getTurnOrder,
  setPlayerTurnOrder,
  setChipCount,
  setStartingChip,
  getChipCount,
  setPotCount,
  getPotCount,
  setPerformedAction,
  getPerformedAction,
  setAllActiontoFalse,
  getAllAction,
  setGamePhase,
  getGamePhase,
  setRoundWinner,
  getRoundWinner,
  getUserSID,
  getActivePlayers,
  isAlreadyInGame,
  getLeftGames,
  setStartingPlayersAllowed,
  getStartingPlayersAllowed,
  getStartingChips, 
  stillHaveChips,
  nextRound,
  getFolderWinner,
  getPlayerGameCount,
};
