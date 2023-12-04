const { Games, Users } = require("../../db");

const method = "get";
const route = "/:id";

const handler = async (request, response) => {
  const { id } = request.params;
  const { id: userId } = request.session.user;

  const { game_socket_id: gameSocketId } = await Games.getGame(id);
  const { sid: userSocketId } = await Users.getUserSocket(userId);

  response.render("game", { id, gameSocketId, userSocketId });
};

module.exports = { method, route, handler };
