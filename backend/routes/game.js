const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const { Games, Users } = require("../db");
const GAME_CONSTANTS = require("../../constants/games");

router.get("/create", async (request, response) => {
  const { id: userId } = request.session.user;
  const io = request.app.get("io");

  // generates an encrypted_game_id and outputs that as gameId
  const { id: gameId } = await Games.create(
    crypto.randomBytes(20).toString("hex"),
  );
  await Games.addUser(userId, gameId);

  io.emit(GAME_CONSTANTS.CREATED, { id: gameId });

  response.redirect(`/games/${gameId}`);
});

router.post("/:id/test", async (request, response) => {
  const { id: gameId } = request.params;
  const { id: userId, username: user } = request.session.user;
  const { sid: userSocketId } = await Users.getUserSocket(userId);
  const { game_socket_id: gameSocketId } = await Games.getGame(gameId);

  const io = request.app.get("io");

  // Emits a message to a specific user from userSocketId or gameSocketId (through console)
  io.to(userSocketId).emit("game:test", {
    source: "User socket",
    gameId,
    userId,
    userSocketId,
    gameSocketId,
  });
  io.to(gameSocketId).emit("game:test", {
    source: "Game socket",
    gameId,
    userId,
    userSocketId,
    gameSocketId,
  });

  response.status(200).send();
});

// For example, if URL is /123/join (id = 123 here), then after the destructuring assignment, gameId = 123
router.get("/:id/join", async (request, response) => {
  // Get the gameID from the URL
  // Get the userID and username from the stored session in the websocket
  const { id: gameId } = request.params;
  const { id: userId, username: user } = request.session.user;
  const io = request.app.get("io");

  // Knowing both the userId and the gameId, add the user into postgresql
  await Games.addUser(userId, gameId);
  io.emit(GAME_CONSTANTS.USER_ADDED, { userId, user, gameId });

  const userCount = await Games.userCount(gameId);
  console.log({ userCount });

  // If the userCount reaches 2, then initialize the game (shuffle the deck)
  if (userCount == 2) {
    const gameState = await Games.initialize(gameId);
    const { game_socket_id: gameSocketId } = await Games.getGame(gameId);

    io.to(gameSocketId).emit(GAME_CONSTANTS.START, {
      currentPlayer: gameState.current_player,
    });
    Object.keys(gameState.hands).forEach((playerId) => {
      const playerIdAsInt = parseInt(playerId, 10);
      const playerSocket = Users.getUserSocket(playerIdAsInt);
      console.log("sidjfpsoidhf RIGHT EHRHE");
      console.log(playerId);
      console.log(playerIdAsInt);
      io.to(playerSocket).emit(GAME_CONSTANTS.STATE_UPDATED, {
        hand: gameState.hands[playerId],
      });
    });
  }

  response.redirect(`/games/${gameId}`);
});

router.get("/:id", async (request, response) => {
  const { id } = request.params; // Get the game Id from the URL link
  const { id: userId, username: user } = request.session.user; // get userID and username from the saved session (NOT POSTGRESQL)
  const { game_socket_id: gameSocketId } = await Games.getGame(id); // game_socket_id is a row obtained from the postgresql table
  const { sid: userSocketId } = await Users.getUserSocket(userId); // userSocketId can be accessed from postgresql

  //const result = await Users.getUserSocket(request.session.id);
  //console.log(result)
  //const { sid } = await Users.getUserSocket(request.session.user.id);
  response.render("game", { id, gameSocketId, userSocketId });
});

module.exports = router;
