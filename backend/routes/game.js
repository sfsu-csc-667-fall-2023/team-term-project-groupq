const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const match_end = require("./match_end");

const { Games, Users } = require("../db");
const GAME_CONSTANTS = require("../../constants/games");
const { getStartingPlayersAllowed, stillHaveChips, getChipCount } = require("../db/games");
const { getBestCards } = require("./card_strength");
const { set_game_phase, endofRound, folded_reset } = require("./game_helpers");

// This is the page the first person comes in - but waiting for other people to join
router.get("/create", async (request, response) => {
  const { id: userId } = request.session.user;
  const io = request.app.get("io");

  // generates an encrypted_game_id and outputs that as gameId
  // const { id: gameId } = await Games.create(
  //   crypto.randomBytes(20).toString("hex"),
  // );

  // Add the creator of the game to the game_users table
  // await Games.addUser(userId, gameId);

  // io.emit(GAME_CONSTANTS.CREATED, { id: gameId, createdBy: userId });

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

router.get("/:id/join", async (request, response) => {

  const { id: gameId } = request.params;
  const { id: userId, username } = request.session.user;
  const io = request.app.get("io");

  // Add the user that just joined into the game_users table
  const isAlreadyPlaying = await Games.isAlreadyInGame(gameId, userId);

  if (isAlreadyPlaying[0].count != 1) {
    await Games.addUser(userId, gameId);
    io.emit(GAME_CONSTANTS.USER_ADDED, { userId, username, gameId });
  }

  response.redirect(`/games/${gameId}`);
});

router.post("/:id/ready", async (request, response) => {
  const { id: gameId } = request.params;
  const { id: userId, username } = request.session.user;
  const { sid: userSocketId } = await Users.getUserSocket(userId);
  const { is_initialized } = await Games.isInitialized(gameId);
  const { ready_count, player_count } = await Games.readyPlayer(userId, gameId);
  const { players_allowed } = await getStartingPlayersAllowed(gameId);
  const io = request.app.get("io");

  let method;
  let gameState;
  if (ready_count !== parseInt(players_allowed) || is_initialized) {
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
  
  const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);
  const isCurrentPlayer = await Games.isCurrentPlayer(gameId, userId);
  const { ready_count } = await Games.readyPlayer(userId, gameId);
  const { is_initialized } = await Games.isInitialized(gameId);
  console.log({ isPlayerInGame, gameId, userId });

  if (!isPlayerInGame) { // check if player is in game
    response.status(200).send();
    return;
  }
  else if (!is_initialized) { // check if game has been initialized
    response.status(200).send();
    return;
  }

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

  gameState = await Games.getState(parseInt(gameId));
  const updateGamePhase = await Games.getGamePhase(gameId);
  const { players, current_player } = gameState;
  const { pot_count } = await Games.getPotCount(gameId);
  const flopCards = players.find((player) => player.user_id === -3).hand;
  const turnCards = players.find((player) => player.user_id === -2).hand;
  const riverCards = players.find((player) => player.user_id === -1).hand;

  const isEndofRound = await set_game_phase(gameId);
  if (isEndofRound) {
    const { bestUsername, bestHand, bestUserId } = getBestCards(players);
    await endofRound(bestUserId, gameId);
    const { round_winner } = await Games.getRoundWinner(gameId);
    if (round_winner > 0) {
      const message = `THE WINNER IS ${bestUsername} WITH A HAND OF ${bestHand}`;
      io.to(gameState.game_socket_id).emit('showPopup', { message });
      gameState = await Games.nextRound(parseInt(gameId));
    }
    const { chip_count } = await getChipCount(userId, gameId);
    if (parseInt(chip_count) === 0) {
      response.redirect(`/games/${gameId}/match_end`);
    }
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
  const isCurrentPlayer = await Games.isCurrentPlayer(gameId, userId);
  const { raiseInput } = request.body;
  const { chip_count } = await Games.getChipCount(userId, gameId);
    if (parseInt(chip_count) < parseInt(raiseInput)) {
      io.to(sid).emit('showPopup', { message: `CANNOT RAISE MORE THAN ${chip_count}` });
      return;
    }

  const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);
  const { ready_count } = await Games.readyPlayer(userId, gameId);

  if (!isPlayerInGame) {
    response.status(200).send();
    return;
  }

  if (isCurrentPlayer) {
    const turnOrders = await Games.getTurnOrder(gameId);
    await Games.setPerformedAction(userId, gameId, true);

    for (const { user_id, current_player } of turnOrders) {
      if (current_player == 0) {
        await Games.setPlayerTurnOrder(1, user_id, gameId);

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
  
  gameState = await Games.getState(parseInt(gameId));
  const updateGamePhase = await Games.getGamePhase(gameId);
  const { players, current_player } = gameState;
  const { pot_count } = await Games.getPotCount(gameId);
  const flopCards = players.find((player) => player.user_id === -3).hand;
  const turnCards = players.find((player) => player.user_id === -2).hand;
  const riverCards = players.find((player) => player.user_id === -1).hand;
  const isEndofRound = await set_game_phase(gameId);

  if (isEndofRound) {
    const { bestUsername, bestHand, bestUserId } = getBestCards(players);
    await endofRound(bestUserId, gameId);
    const { round_winner } = await Games.getRoundWinner(gameId);
    
    if (round_winner > 0) {
      const message = `THE WINNER IS ${bestUsername} WITH A HAND OF ${bestHand}`;
      io.to(gameState.game_socket_id).emit('showPopup', { message });
      gameState = await Games.nextRound(parseInt(gameId));
    }
    const noMoreChips = await stillHaveChips(userId, gameId);
    console.log("NO MORE CHIPS", noMoreChips);
    console.log(username, noMoreChips.chip_count, parseInt(noMoreChips.chip_count)===0);
    if (noMoreChips) {
      response.redirect(`/games/${gameId}/match_end`);
    }
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

router.post("/:id/fold", async (request, response) => {
  const { id: gameId } = request.params;
  const { id: userId, username } = request.session.user;
  const { sid } = await Games.getUserSID(gameId, userId);
  const { is_initialized } = await Games.isInitialized(gameId);
  const { ready_count } = await Games.readyPlayer(userId, gameId);
  gameState = await Games.getState(parseInt(gameId));
  const io = request.app.get("io");

  if (ready_count == 2) {
    await folded_reset(gameId, userId);
    const message = `${username} HAS FOLDED THIS ROUND`;
    io.to(gameState.game_socket_id).emit('showPopup', { message });
    gameState = await Games.nextRound(parseInt(gameId));
  }

  response.status(200).send();

});

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

module.exports = router;
