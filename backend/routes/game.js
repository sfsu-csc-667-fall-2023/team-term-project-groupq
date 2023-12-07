const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const { Games, Users } = require("../db");
const GAME_CONSTANTS = require("../../constants/games");
const { setRoundWinner } = require("../db/games");

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
  const { id: userId, username } = request.session.user;
  const io = request.app.get("io");

  // Add the user that just joined into the game_users table
  await Games.addUser(userId, gameId);
  io.emit(GAME_CONSTANTS.USER_ADDED, { userId, username, gameId });

  const userCount = await Games.userCount(gameId);

  response.redirect(`/games/${gameId}`);
});

router.post("/:id/ready", async (request, response) => {
  const { id: gameId } = request.params;
  const { id: userId, username } = request.session.user;
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
  const { game_id, players, current_player } = gameState;

  const flopCards = players.find((player) => player.user_id === -3).hand;
  const turnCards = players.find((player) => player.user_id === -2).hand;
  const riverCards = players.find((player) => player.user_id === -1).hand;

  const { pot_count } = await Games.getPotCount(parseInt(gameId));
  const updateGamePhase = await Games.getGamePhase(gameId);

  io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.STATE_UPDATED, {
    game_id,
    flopCards,
    turnCards,
    riverCards,
    current_player,
    players,
    pot_count,
    updateGamePhase
  });

  const simplifiedPlayers = players.map(({ user_id, current_player, chip_count, username }) => ({ user_id, current_player, chip_count, username }));

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
  const { id: userId, username } = request.session.user;
  const { sid } = await Games.getUserSID(gameId, userId);
  const io = request.app.get("io");
  
  // check if player is in game
  const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);
  const { ready_count } = await Games.readyPlayer(userId, gameId);
  const { is_initialized } = await Games.isInitialized(gameId);
  console.log({ isPlayerInGame, gameId, userId });

  if (!isPlayerInGame) {
    response.status(200).send();
    return;
  }
  else if (!is_initialized) {
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
    io.to(sid).emit('showPopup', { message: 'NOT CURRENT PLAYER' });
    return;
  }

  await set_game_phase(gameId);

  const updateGamePhase = await Games.getGamePhase(gameId);

  gameState = await Games.getState(parseInt(gameId));
  const { players, current_player } = gameState;
  const { pot_count } = await Games.getPotCount(gameId);

  const flopCards = players.find((player) => player.user_id === -3).hand;
  const turnCards = players.find((player) => player.user_id === -2).hand;
  const riverCards = players.find((player) => player.user_id === -1).hand;

  const { round_winner } = await Games.getRoundWinner(gameId);
    if (round_winner > 0) {
      io.to(gameState.game_socket_id).emit('showPopup', { message: `${username} IS THE WINNER!` });
      await setRoundWinner(-1, gameId);
    }
    
  io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.STATE_UPDATED, {
    gameId,
    flopCards,
    turnCards,
    riverCards,
    current_player,
    players,
    pot_count,
    updateGamePhase,
  });

  const simplifiedPlayers = players.map(({ user_id, current_player, chip_count, username }) => ({ user_id, current_player, chip_count, username }));
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
  const { id: userId, username } = request.session.user;
  const { sid } = await Games.getUserSID(gameId, userId);
  const { is_initialized } = await Games.isInitialized(gameId);
  const io = request.app.get("io");
  // Add money into the pot
  // Decrement money from own chip stack

  const { raiseInput } = request.body;
  const { chip_count } = await Games.getChipCount(userId, gameId);
    if (parseInt(chip_count) < parseInt(raiseInput)) {
      io.to(sid).emit('showPopup', { message: `CANNOT RAISE MORE THAN ${chip_count}` });
      return;
    }

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
        await Games.setPotCount(gameId, pot_count+raiseInput);
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
    const { sid } = await Games.getUserSID(gameId, userId);
    io.to(sid).emit('showPopup', { message: 'NOT CURRENT PLAYER' });
    return;
  }

  await set_game_phase(gameId);
  const updateGamePhase = await Games.getGamePhase(gameId);

  gameState = await Games.getState(parseInt(gameId));
  const { players, current_player } = gameState;
  const { pot_count } = await Games.getPotCount(gameId);

  const flopCards = players.find((player) => player.user_id === -3).hand;
  const turnCards = players.find((player) => player.user_id === -2).hand;
  const riverCards = players.find((player) => player.user_id === -1).hand;

  const { round_winner } = await Games.getRoundWinner(gameId);
    if (round_winner > 0) {
      io.to(gameState.game_socket_id).emit('showPopup', { message: `${username} IS THE WINNER!` });
      await setRoundWinner(-1, gameId);
    }

  io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.STATE_UPDATED, {
    gameId,
    flopCards,
    turnCards,
    riverCards,
    current_player,
    players,
    pot_count,
    updateGamePhase
  });

  const simplifiedPlayers = players.map(({ user_id, current_player, chip_count, username }) => ({ user_id, current_player, chip_count, username }));
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

router.get("/:id/match_end", (request, response) => {
  const { id } = request.params;
  response.render("match_end", { id });
});



const set_game_phase = async (gameId, players) => {
  const allActions = await Games.getAllAction(gameId);
  const { game_phase } = await Games.getGamePhase(gameId);
  const { is_initialized } = await Games.isInitialized(gameId);

  if (parseInt(allActions[0].count) === 0 && is_initialized) {
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
    else if (game_phase === "river") {
      await endofRound(gameId, players);
    }
    await Games.setAllActiontoFalse(gameId);
  }

};

const endofRound = async(gameId, players) => {
  const { game_phase } = await Games.getGamePhase(gameId);
  const allActions = await Games.getAllAction(gameId);

  //const dealerCards = players.filter((player) => player.user_id < 0).map(({ hand }) => hand);

  // THIS TAKES A USER_ID
  await setRoundWinner(1, gameId);

  console.log("END OF ROUND");
  const { pot_count } = await Games.getPotCount(gameId);
  const { round_winner } = await Games.getRoundWinner(gameId);
  
  // WINNER CHIP COUNT
  const { chip_count } = await Games.getChipCount(round_winner, gameId);

  await Games.setChipCount(round_winner, gameId, chip_count+pot_count);

  // re-initialize settings
  await Games.setGamePhase(gameId, "preflop");
  await Games.setPotCount(gameId, 0);
  
};


module.exports = router;
