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

const DEAL_CARD =
  "UPDATE game_cards SET user_id=$1 WHERE game_id=$2 AND card_id=$3";

const initialize = async (gameId) => {
  const { game_socket_id } = await getGame(gameId);
  await createShuffledDeck(gameId);

  //set the turn
  const { userId: firstPlayer } = await getPlayerByTurnOrder(0, gameId); //getPlayerByTurnOrder(0, gameId)
  await setCurrentPlayer(firstPlayer, gameId);

  // //deal cards to each player
  // const users = await getUsers(gameId) // Get the number of players in the gameId  getUsers(gameId)
  //   .then((userResult) => {
  //     // In the first then, returns the number of users in JSON format
  //     console.log({ userResult });

  //     return userResult;
  //   })
  //   .then((userResult) =>
  //     Promise.all([
  //       userResult,
  //       ...userResult.map(({ user_id }) =>
  //         Users.getUserSocket(parseInt(user_id)),
  //       ),
  //     ]),
  //   )
  //   .then(([userResult, ...userSids]) =>
  //     userResult.map(({ user_id }, index) => ({
  //       user_id,
  //       sid: userSids[index].sid,
  //     })),
  //   );

  const users = await getUsers(gameId);
  const cards = await getCardsperPlayers(gameId, users.length * 2); // users -> number of players x 2
  const dealtCards = await dealCards(users, cards, gameId);

  console.log("DEALT CARDS HERE:");
  console.log({ dealtCards });

  users.forEach((user) => {
    console.log({ user });

    user.hand = dealtCards.filter((card) => card.user_id === user.user_id);
    user.current_player = firstPlayer === user.user_id;
  });

  await setInitialized(gameId);

  // await Promise.all(
  //   cards
  //     .slice(0, cards.length - 2)
  //     .map(({ card_id }, index) =>
  //       db.none(DEAL_CARD, [
  //         users[index % users.length].user_id,
  //         gameId,
  //         card_id,
  //       ]),
  //     ),
  // );

  // await Promise.all(
  //   cards
  //     .slice(cards.length - 2)
  //     .map(({ card_id }) => db.none(DEAL_CARD, [-1, gameId, card_id])),
  // );

  //send each player their cards
  // current state of game: firstPlayer and money?

  const hands = await db.many(
    "SELECT game_cards.*, cards.* FROM game_cards, cards WHERE game_id=$1 AND game_cards.card_id=cards.id",
    [gameId],
  );

  //console.log({ hands });

  // return {
  //   current_player: firstPlayer,
  //   hands: hands.reduce((memo, entry) => {
  //     if (entry.user_id !== 0) {
  //       memo[entry.user_id] = memo[entry.user_id] || [];
  //       memo[entry.user_id].push(entry);
  //     }

  //     return memo;
  //   }, {}),
  // };
  return {
    game_id: gameId,
    game_socket_id,
    current_player: firstPlayer,
    players: users,
  };
};

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
};
