const database = require("../connection");
const { connection: db } = database;

const { getCurrentPlayer } = require("./get-current-player");
const { getGame } = require("./get-game");
const { getUsers } = require("./get-users");
const { getCardsAlreadyDealt } = require("./get-cards-alreadyDealt");
const { getChipCount } = require("./get-chipCount");


const getState = async (gameId) => {
  const { game_socket_id } = await getGame(gameId);

  //const current_player = await getCurrentPlayer(gameId);
  const users = await getUsers(gameId);

  // console.log("THE USERS IN GET-TSTATE");
  // console.log(users);
  users.push({ user_id: -1 });
  users.push({ user_id: -2 });
  users.push({ user_id: -3 });

  

  const dealtCards = await getCardsAlreadyDealt(gameId);

  for (const user of users) {
    user.hand = dealtCards.filter((card) => card.user_id === user.user_id);
    user.turnOrder = user.current_player;
    user.current_person_playing = user.current_player == 0;

    if (user.user_id > 0) {
      const test = await getChipCount(user.user_id, gameId);

      user.chip_count = (await getChipCount(user.user_id, gameId)).chip_count;
    } else {
      user.chip_count = -1;
    }
  };

  // console.log("THE USERS IN GET-TSTATE");
  // console.log(users);

  return {
    game_id: gameId,
    game_socket_id,
    players: users,
  };
};

module.exports = { getState };
