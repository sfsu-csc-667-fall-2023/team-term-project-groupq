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

const initialize = async (gameId) => {
  const { game_socket_id } = await getGame(gameId);
  await createShuffledDeck(gameId);

  //set the turn - Set the first player (which is the person creating the room)
  const { user_id: firstPlayer } = await getPlayerByTurnOrder(0, gameId);
  await setCurrentPlayer(firstPlayer, gameId);

  const users = await getUsers(gameId);

  console.log("WHO ARE THE USERS, THERE SHOULD ONLY BE 2");
  console.log(users);

  // users.forEach(async (user) => {
  //   await setChipCount(user.user_id, gameId, 1000);
  // });

  for (const user of users) {
    await setChipCount(user.user_id, gameId, 1000);
  };

  // Get the total cards that need to be sent to players
  const cards = await getCardsperPlayers(gameId, users.length * 2 + 5); // users -> number of players x 2
  console.log("THESE ARE THE CARDS CARDS CARDS");
  console.log(cards);

  users.push({ user_id: -1 });
  users.push({ user_id: -2 });
  users.push({ user_id: -3 });


  // Using the users, cards and gameId, deals the first cards to the players (Poker = 2)
  const dealtCards = await dealCards(users, cards, gameId);
  console.log("THESE ARE THE DEALT CARDS");
  console.log(dealtCards);

  for (const user of users) {
    user.hand = dealtCards.filter((card) => card.user_id === user.user_id);
    user.turnOrder = user.current_player;
    user.current_person_playing = user.current_player == 0;

    if (user.user_id > 0) {
      const test = await getChipCount(user.user_id, gameId);
      // console.log(test);
      // console.log(test.chip_count);

      user.chip_count = (await getChipCount(user.user_id, gameId)).chip_count;
    } else {
      user.chip_count = -1;
    }
  };

  console.log("THE USERS IN INITIALIZE");
  console.log(users);
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
