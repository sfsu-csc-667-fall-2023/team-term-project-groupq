const { Games, Users } = require("../../db");
const { set_game_phase, endofRound } = require("./game-functions")

const method = "post";
const route = "/:id/check";

const handler = async (request, response) => {
    const { id: gameId } = request.params;
    const { id: userId, username } = request.session.user;
    const { sid } = await Games.getUserSID(gameId, userId);
    const io = request.app.get("io");
    
    // check if player is in game
    const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);
    const { ready_count } = await Games.readyPlayer(userId, gameId);
    const { is_initialized } = await Games.isInitialized(gameId);
  
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
