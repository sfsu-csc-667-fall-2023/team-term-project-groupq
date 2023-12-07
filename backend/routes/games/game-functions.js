const { Games } = require("../../db");

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

  module.exports = { set_game_phase, endofRound };