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

const initialize = async (gameId) => {
  const { game_socket_id } = await getGame(gameId);
  await createShuffledDeck(gameId);

  //set the turn - Set the first player (which is the person creating the room)
  const { user_id: firstPlayer } = await getPlayerByTurnOrder(0, gameId);
  await setCurrentPlayer(firstPlayer, gameId);

  const users = await getUsers(gameId);

  // Get the total cards that need to be sent to players
  const cards = await getCardsperPlayers(gameId, users.length * 2); // users -> number of players x 2

  // Using the users, cards and gameId, deals the first cards to the players (Poker = 2)
  const dealtCards = await dealCards(users, cards, gameId);

  console.log("DEALT CARDS HERE:");
  console.log({ dealtCards });

  users.forEach((user) => {
    console.log({ user });

    // Create a new field under user, and only sending the cards that match the user_id
    user.hand = dealtCards.filter((card) => card.user_id === user.user_id);
    user.current_player = firstPlayer === user.user_id;
  });

  // When the game is ready to be initialized - playerCount is reached, set the is_initialize field to True
  await setInitialized(gameId);

  const hands = await db.many(
    "SELECT game_cards.*, cards.* FROM game_cards, cards WHERE game_id=$1 AND game_cards.card_id=cards.id",
    [gameId],
  );

  return {
    game_id: gameId,
    game_socket_id,
    current_player: firstPlayer,
    players: users,
  };
};

module.exports = {
  initialize,
};
