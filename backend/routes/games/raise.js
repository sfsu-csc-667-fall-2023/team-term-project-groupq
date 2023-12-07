const { Games, Users } = require("../../db");
const { set_game_phase, endofRound } = require("./game-functions")

const method = "post";
const route = "/:id/raise";

const handler = async (request, response) => {
    const { id: gameId } = request.params;
    const { id: userId, username } = request.session.user;
    const { sid } = await Games.getUserSID(gameId, userId);
    console.log("USERNAME = ", username);
    const { is_initialized } = await Games.isInitialized(gameId);
    const io = request.app.get("io");
    // Add money into the pot
    // Decrement money from own chip stack
  
    const { raiseInput } = request.body;
    const { chip_count } = await Games.getChipCount(userId, gameId);
    if (parseInt(chip_count) < parseInt(raiseInput)) {
      io.to(sid).emit('showPopup', { message: 'CANNOT RAISE MORE THAN CURRENT CHIP COUNT' });
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
        io.to(gameState.game_socket_id).emit('showPopup', { message: `${username} IS THE WINNER!`});
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
};

module.exports = { method, route, handler };