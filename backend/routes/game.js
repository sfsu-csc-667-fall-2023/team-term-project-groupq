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
  const { id: userId } = request.session.user;
  const { sid: userSocketId } = await Users.getUserSocket(userId);

  const io = request.app.get("io");

  const { is_initialized } = await Games.isInitialized(gameId);
  const { ready_count, player_count } = await Games.readyPlayer(userId, gameId);

  let method;
  let gameState;

  if (ready_count !== 2 || is_initialized) {
    method = "getState";
    gameState = await Games.getState(parseInt(gameId));
  } else {
    method = "initialize";
    gameState = await Games.initialize(parseInt(gameId));
  }

  const allActions = await Games.getAllAction(gameId);
  const { game_phase } = await Games.getGamePhase(gameId);
  console.log(game_phase, allActions[0].count, is_initialized);

  if (allActions[0].count === 0 && is_initialized) {
    if (game_phase === "preflop") {
      await Games.setGamePhase(gameId, "flop");
    }
    else if (game_phase === "flop") {
      await Games.setGamePhase(gameId, "turn");
    }
    else if (game_phase === "turn") {
      await Games.setGamePhase(gameId, "river");
    }
    // ELSE NEED TO MAKE A WIN CONDITION
    await Games.setAllActiontoFalse(gameId);
  }

  const { game_id, players, current_player } = gameState;

  console.log("THIS IS GAMESTATE: ", gameState);

  const flopCards = players.find((player) => player.user_id === -3).hand;
  const turnCards = players.find((player) => player.user_id === -2).hand;
  const riverCards = players.find((player) => player.user_id === -1).hand;

  console.log("THIS IS FLORP CARD: ", flopCards);

  const { pot_count } = await Games.getPotCount(parseInt(gameId));

  io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.STATE_UPDATED, {
    game_id,
    flopCards,
    turnCards,
    riverCards,
    current_player,
    players,
    pot_count,
    game_phase
  });

    // let playerInfo;
    // gameState.players.forEach((player) => {

    // });
    const simplifiedPlayers = players.map(({ user_id, current_player, chip_count }) => ({ user_id, current_player, chip_count }));

  players.forEach(({ user_id, current_person_playing, hand, web_position, sid }) => {
    io.to(sid).emit(GAME_CONSTANTS.HAND_UPDATED, {
      user_id,
      current_person_playing,
      hand,
      web_position,
      ready_count,
      current_player,
      simplifiedPlayers,
    });
  });

  response.status(200).send();
});

router.post("/:id/check", async (request, response) => {
  const { id: gameId } = request.params;
  const { id: userId, username: user } = request.session.user;
  const io = request.app.get("io");
  
  // check if player is in game
  const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);
  const { ready_count } = await Games.readyPlayer(userId, gameId);
  console.log({ isPlayerInGame, gameId, userId });

  if (!isPlayerInGame) {
    response.status(200).send();
    return;
  }

  // check if this is current player
  const isCurrentPlayer = await Games.isCurrentPlayer(gameId, userId);

  // THIS MOVES THE DEALER BUTTON -> MAKE IT A METHOD SOMEHWERE
  if (isCurrentPlayer) {
    const turnOrders = await Games.getTurnOrder(gameId);
    await Games.setPerformedAction(userId, gameId, true);

    for (const { user_id, current_player } of turnOrders) {
      if (current_player == 0) {
        await Games.setPlayerTurnOrder(1, user_id, gameId);
      } 
      else {
        if (current_player === turnOrders.length - 1) {
          await Games.setPlayerTurnOrder(0, user_id, gameId);
        } 
        else {
          await Games.setPlayerTurnOrder(
            parseInt(current_player) + 1,
            user_id,
            gameId,
          );
        }
      }
    }
  }

  else {
    console.log("NOT THE CURRENT PLAYER");
    // Add error message: Not your turn
    // Emit directly to player (userSocket)
    return;
  }

  gameState = await Games.getState(parseInt(gameId));
  const { players, current_player } = gameState;
  const { pot_count } = await Games.getPotCount(gameId);

  const flopCards = players.find((player) => player.user_id === -3).hand;
  const turnCards = players.find((player) => player.user_id === -2).hand;
  const riverCards = players.find((player) => player.user_id === -1).hand;

  io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.STATE_UPDATED, {
    gameId,
    flopCards,
    turnCards,
    riverCards,
    current_player,
    players,
    pot_count,
    game_phase

  });

  const simplifiedPlayers = players.map(({ user_id, current_player, chip_count }) => ({ user_id, current_player, chip_count }));
  players.forEach(({ user_id, current_person_playing, hand, web_position, sid }) => {
    io.to(sid).emit(GAME_CONSTANTS.HAND_UPDATED, {
      user_id,
      current_person_playing,
      hand,
      web_position,
      ready_count,
      current_player,
      simplifiedPlayers,
    });
  });

  response.status(200).send();
});

router.post("/:id/raise", async (request, response) => {

  const { id: gameId } = request.params;
  const { id: userId, username: user } = request.session.user;
  const io = request.app.get("io");
  // Add money into the pot
  // Decrement money from own chip stack

  const { raiseInput } = request.body;
  console.log({ raiseInput });

  // check if player is in game
  const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);
  const { ready_count } = await Games.readyPlayer(userId, gameId);
  console.log({ isPlayerInGame, gameId, userId });

  if (!isPlayerInGame) {
    response.status(200).send();
    return;
  }
  // check if this is current player
  const isCurrentPlayer = await Games.isCurrentPlayer(gameId, userId);


  if (isCurrentPlayer) {
    const turnOrders = await Games.getTurnOrder(gameId);
    await Games.setPerformedAction(userId, gameId, true);

    for (const { user_id, current_player } of turnOrders) {
      console.log("USER_ID IS = ", user_id);
      if (current_player == 0) {

        await Games.setPlayerTurnOrder(1, user_id, gameId); //changing current_player in game_users - NO EFFECT ON users_id or chip_count
        const { chip_count } = await Games.getChipCount(user_id, gameId);
        await Games.setChipCount(user_id, gameId, chip_count - raiseInput);
        const { pot_count } = await Games.getPotCount(gameId);
        await Games.setPotCount(gameId, pot_count+chip_count);
      } 
      else {
        if (current_player === turnOrders.length - 1) {
          await Games.setPlayerTurnOrder(0, user_id, gameId);
        } 
        else {
          await Games.setPlayerTurnOrder(
            parseInt(current_player) + 1,
            user_id,
            gameId,
          );
        }
      }
    }
  }

  else {
    console.log("NOT THE CURRENT PLAYER");
    // Add error message: Not your turn
    // Emit directly to player (userSocket)
    return;
  }

  gameState = await Games.getState(parseInt(gameId));
  const { players, current_player } = gameState;
  const { pot_count } = await Games.getPotCount(gameId);

  const flopCards = players.find((player) => player.user_id === -3).hand;
  const turnCards = players.find((player) => player.user_id === -2).hand;
  const riverCards = players.find((player) => player.user_id === -1).hand;

  io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.STATE_UPDATED, {
    gameId,
    flopCards,
    turnCards,
    riverCards,
    current_player,
    players,
    pot_count,
    game_phase
  });

  const simplifiedPlayers = players.map(({ user_id, current_player, chip_count }) => ({ user_id, current_player, chip_count }));
  players.forEach(({ user_id, current_person_playing, hand, web_position, sid }) => {
    io.to(sid).emit(GAME_CONSTANTS.HAND_UPDATED, {
      user_id,
      current_person_playing,
      hand,
      web_position,
      ready_count,
      current_player,
      simplifiedPlayers,
    });
  });

  response.status(200).send();

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
