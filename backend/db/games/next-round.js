const database = require("../connection");
const { connection: db, pgp } = database;
const Users = require("../users");

const { getGame } = require("./get-game");
const { createShuffledDeck } = require("./shuffle-deck");
const { getUsers } = require("./get-users");
const { dealCards } = require("./deal-cards");
const { getChipCount, getStartingChips } = require("./get-chipCount");
const { setRoundWinner } = require("./set-roundWinner");
const { getCardsperPlayers } = require("./get-cards-per-players");

const nextRound = async (gameId) => {
    const { game_socket_id } = await getGame(gameId);
    await createShuffledDeck(gameId);
    const users = await getUsers(gameId);
    const cards = await getCardsperPlayers(gameId, users.length * 2 + 5);

    users.push({ user_id: -1 });
    users.push({ user_id: -2 });
    users.push({ user_id: -3 });

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

      await setRoundWinner(-1, gameId); 

    return {
    game_id: gameId,
    game_socket_id,
    players: users,
    };

};

module.exports = { nextRound };