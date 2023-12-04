const { Games } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "get";
const route = "/:id/join";

const handler = async (request, response) => {
  const { id: gameId } = request.params;
  const { id: userId } = request.session.user;

  const gameUsers = await Games.usersInGame(gameId);
  const userInGameAlready = gameUsers.includes(
    (entry) => entry.user_id === userId,
  );

  if (!userInGameAlready) {
    await Games.addUser(userId, gameId);
  }
  response.redirect(`/games/${gameId}`);
};

module.exports = { method, route, handler };
