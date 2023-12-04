const crypto = require("crypto");

const { Games } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "get";
const route = "/create";

const handler = async (request, response) => {
  const { id: userId } = request.session.user;
  const io = request.app.get("io");

  const { id: gameId } = await Games.create(
    crypto.randomBytes(20).toString("hex"),
  );
  await Games.addUser(userId, gameId);

  io.emit(GAME_CONSTANTS.CREATED, { id: gameId, createdBy: userId });

  response.redirect(`/games/${gameId}`);
};

module.exports = { method, route, handler };
