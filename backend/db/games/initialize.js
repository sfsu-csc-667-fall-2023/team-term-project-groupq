const database = require("../connection");
const { connection: db, pgp } = database;
const Users = require("../users");

const { getGame } = require("./get-game");
const { createShuffledDeck } = require("./shuffle-deck");
const { getUsers } = require("./get-users");
const { getPlayerByTurnOrder } = require("./get-player-by-turnOrder");
const { setCurrentPlayer } = require("./set-current-player");
const { getCardsperPlayers } = require("./get-cards-per-players");
const { dealCards } = require("./deal-cards");
const { setInitialized } = require("./set-initialized");
const { setChipCount } = require("./set-chipCount");
const { getChipCount } = require("./get-chipCount");
const { setPotCount } = require("./set-dealerPot");
const { setAllActiontoFalse } = require("./set-AllActionToFalse");

const initialize = async (gameId) => {
  const { game_socket_id } = await getGame(gameId);
  await createShuffledDeck(gameId);

  //set the turn - Set the first player (which is the person creating the room)
  // const { user_id: firstPlayer } = await getPlayerByTurnOrder(0, gameId);
  // await setCurrentPlayer(firstPlayer, gameId);

  const users = await getUsers(gameId);

  for (const user of users) {
    await setChipCount(user.user_id, gameId, 1000);
  };

  // Get the total cards that need to be sent to players
  const cards = await getCardsperPlayers(gameId, users.length * 2 + 5); // users -> number of players x 2


  users.push({ user_id: -1 });
  users.push({ user_id: -2 });
  users.push({ user_id: -3 });


  // Using the users, cards and gameId, deals the first cards to the players (Poker = 2)
  const dealtCards = await dealCards(users, cards, gameId);

  for (const user of users) {
    user.hand = dealtCards.filter((card) => card.user_id === user.user_id);
    user.turnOrder = user.current_player;
    user.current_person_playing = user.current_player == 0;

    if (user.user_id > 0) {
      user.chip_count = (await getChipCount(user.user_id, gameId)).chip_count;
    } else {
      user.chip_count = -1;
    }
  };

  await setPotCount(gameId, 0);
  await setAllActiontoFalse(gameId);

  // When the game is ready to be initialized - playerCount is reached, set the is_initialize field to True
  await setInitialized(gameId);

  return {
    game_id: gameId,
    game_socket_id,
    players: users,
  };
};

module.exports = {
  initialize,
};
