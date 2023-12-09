const { Games } = require("../db");

const folded_reset = async (gameId, userId) => {
  await Games.setGamePhase(gameId, "preflop");
  await Games.setAllActiontoFalse(gameId);
  const { pot_count } = await Games.getPotCount(gameId);
  const { user_id } = await Games.getFolderWinner(gameId, userId)
  const { chip_count } = await Games.getChipCount(user_id, gameId);
  await Games.setChipCount(user_id, gameId, chip_count+pot_count);
  await Games.setPotCount(gameId, 0);
};

const set_game_phase = async (gameId) => {
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
      else if (game_phase === "river") {
        return true;
      }
      await Games.setAllActiontoFalse(gameId);
    }
    return false; 
  };
  
  const endofRound = async(userId, gameId) => {
    const { game_phase } = await Games.getGamePhase(gameId);
    const allActions = await Games.getAllAction(gameId);
  
    await setRoundWinner(userId, gameId);
  
    const { pot_count } = await Games.getPotCount(gameId);
    const { round_winner } = await Games.getRoundWinner(gameId);
    const { chip_count } = await Games.getChipCount(round_winner, gameId);
  
    await Games.setChipCount(round_winner, gameId, chip_count+pot_count);
  
    await Games.setGamePhase(gameId, "preflop");
    await Games.setPotCount(gameId, 0); 
  };
  
  module.exports = { set_game_phase, endofRound, folded_reset };