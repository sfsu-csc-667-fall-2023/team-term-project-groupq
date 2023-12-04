const { Games } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "post";
const route = "/:id/ready";

const handler = async (request, response) => {
  const io = request.app.get("io");

  const { id: gameId } = request.params;
  const { id: userId } = request.session.user;

  const { initialized } = await Games.isInitialized(gameId);
  const { ready_count, player_count } = await Games.readyPlayer(userId, gameId);
  console.log({ ready_count, player_count, initialized });

  //hardcoded 2 players here, need to figure
  //out the condition that starts the game
  const method = ready_count !== 2 || initialized ? "getState" : "initialize";

  const gameState = await Games[method](parseInt(gameId));

  console.log({ gameState, method });

  io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.STATE_UPDATED, gameState);

  response.status(200).send();
};

module.exports = { method, route, handler };
