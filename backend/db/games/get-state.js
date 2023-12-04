const database = require("../connection");
const { connection: db } = database;

const { getCurrentPlayer } = require("./get-current-player");
const { getGame } = require("./get-game");
const { getUsers } = require("./get-users");
const { getCardsAlreadyDealt } = require("./get-cards-alreadyDealt");

const getState = async (gameId) => {
  const { game_socket_id } = await getGame(gameId);

  const current_player = await getCurrentPlayer(gameId);
  const users = await getUsers(gameId);
  //users.push({ user_id: -1 }); for the community cards?

  const dealtCards = await getCardsAlreadyDealt(gameId);

  users.forEach((user) => {
    user.hand = dealtCards.filter((card) => card.user_id === user.user_id);
    user.turnOrder = user.current_player;
    user.current_player = current_player === user.user_id;
  });

  return {
    game_id: gameId,
    game_socket_id,
    current_player,
    players: users,
  };
};

module.exports = { getState };
