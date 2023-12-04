const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const { Games, Users } = require("../db");
const GAME_CONSTANTS = require("../../constants/games");

// This is the page the first person comes in - but waiting for other people to join
router.get("/create", async (request, response) => {
  const { id: userId } = request.session.user;
  const io = request.app.get("io");

  // generates an encrypted_game_id and outputs that as gameId
  const { id: gameId } = await Games.create(
    crypto.randomBytes(20).toString("hex"),
  );

  // Add the creator of the game to the game_users table
  await Games.addUser(userId, gameId);

  io.emit(GAME_CONSTANTS.CREATED, { id: gameId, createdBy: userId });

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

  // Add the user that just joined into the game_users table
  await Games.addUser(userId, gameId);
  io.emit(GAME_CONSTANTS.USER_ADDED, { userId, user, gameId });

  const userCount = await Games.userCount(gameId);

  response.redirect(`/games/${gameId}`);
});

router.post("/:id/ready", async (request, response) => {
  const { id: gameId } = request.params;
  const { id: userId, username: user } = request.session.user;

  const { sid: userSocketId } = await Users.getUserSocket(userId);
  const { game_socket_id: gameSocketId } = await Games.getGame(gameId);

  const io = request.app.get("io");

  const { is_initialized } = await Games.isInitialized(gameId);
  const { ready_count, player_count } = await Games.readyPlayer(userId, gameId);

  console.log("WE ARE IN THE :id/READY PAGE");
  console.log({ ready_count, player_count, is_initialized });

  let method;
  let gameState;

  console.log("THIS IS THE READY COUNT");
  console.log(ready_count, is_initialized);

  if (ready_count !== 2 || is_initialized) {
    method = "getState";
    gameState = await Games.getState(parseInt(gameId));
  } else {
    method = "initialize";
    gameState = await Games.initialize(parseInt(gameId));
  }

  console.log("THIS IS THE READY VIEW GAMESTATE:");
  console.log(method, gameState);
  console.log(gameState.players[0].hand);

  io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.STATE_UPDATED, gameState);
  //io.emit(GAME_CONSTANTS.STATE_UPDATED, gameState);

  response.status(200).send();
});

router.post("/:id/check", async (request, response) => {
  const { id: gameId } = request.params;
  const { id: userId, username: user } = request.session.user;
  // check if player is in game
  // check if this is current player
  const isCurrentPlayer = await Games.isCurrentPlayer(gameId, userId);
  const currentPlayer = await Games.getCurrentPlayer(gameId);

  console.log(currentPlayer);
  if (!isCurrentPlayer) {
    // return gameState?
    // Add error message: Not your turn
    // Emit directly to player (userSocket)

    return;
  }
  // nothing happens and the current player is now +1
});

router.post("/:id/raise", async (request, response) => {
  // check if player is in game
  // check if this is current player
  // Add money into the pot
  // Decrement money from own chip stack
});

router.post("/:id/fold", async (request, response) => {});

router.get("/:id", async (request, response) => {
  const { id: gameId } = request.params; // Get the game Id from the URL link
  const { id: userId, username: user } = request.session.user; // get userID and username from the saved session (NOT POSTGRESQL)
  const { game_socket_id: gameSocketId } = await Games.getGame(gameId); // game_socket_id is a row obtained from the postgresql table
  const { sid: userSocketId } = await Users.getUserSocket(userId); // userSocketId can be accessed from postgresql

  const io = request.app.get("io");
  io.to(gameSocketId).emit(GAME_CONSTANTS.START, "hello world");

  response.render("game", { gameId, gameSocketId, userSocketId }); // these are sent as hidden field in the game.ejs file
});

module.exports = router;
