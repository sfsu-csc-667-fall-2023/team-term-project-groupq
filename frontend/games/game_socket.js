import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "../../constants/games";
import { dealerHand, cardTemplate, gameSocketId, otherHandContainers } from "./page-data"


let socket;

const configure = () => {
  socket = io({ query: { id: gameSocketId } });

  socket.on(GAME_CONSTANTS.STATE_UPDATED, stateUpdated);

  console.log("Game socket configured");
  return Promise.resolve(socket)
};

// const playerThreeHand = document.querySelector("#player3");
// const playerFourHand = document.querySelector("#player4");
// const playerFiveHand = document.querySelector("#player5");


const dealerUpdate = (handContainer, cardList, pot_count) => {

  cardList.forEach(({ suit, number }, index) => {
    const container = cardTemplate.content.cloneNode(true);
    const div = container.querySelector(".card");

    // This adds the input suit-{} number-{} as a class NAME -> EXTRACT FOR CSS
    div.classList.add(`suit-${suit}`);
    div.classList.add(`number-${number}`);

    handContainer.appendChild(div);
  });
  
};

const potCountUpdate = (handContainer, pot_count) => {
  const p = document.createElement("p");
  p.textContent = `Dealer Pot = ${pot_count}`;
  p.classList.add("pot-count");

  handContainer.appendChild(p);
};

const gamePhaseUpdate = (gamePhase) => {
  const p = document.getElementById("game-phase");
  p.textContent = `CURRENT GAME PHASE: ${gamePhase}`; //CURRENT GAME PHASE: PRE-FLOP
};

// get the data from game_state
const stateUpdated = ({ game_id, flopCards, turnCards, riverCards, players, current_player, numOfCards, pot_count, updateGamePhase }) => {
  console.log(GAME_CONSTANTS.STATE_UPDATED, { game_id, flopCards, turnCards, riverCards, players, current_player, numOfCards, pot_count, updateGamePhase })

  const filler = [{ suit: 'filler', number: 'filler'}];

  gamePhaseUpdate(updateGamePhase.game_phase);

  if (updateGamePhase.game_phase === "preflop") { // pre-flop (all cards are hidden)
    dealerHand.innerHTML = "";
    potCountUpdate(dealerHand, pot_count);
    dealerUpdate(dealerHand, filler, pot_count);
    dealerUpdate(dealerHand, filler, pot_count);
    dealerUpdate(dealerHand, filler, pot_count);
    dealerUpdate(dealerHand, filler, pot_count);
    dealerUpdate(dealerHand, filler, pot_count);
  }
  else if (updateGamePhase.game_phase === "flop") { // flop 3 cards visible
    dealerHand.innerHTML = "";
    potCountUpdate(dealerHand, pot_count);
    dealerUpdate(dealerHand, flopCards, pot_count);
    dealerUpdate(dealerHand, filler, pot_count);
    dealerUpdate(dealerHand, filler, pot_count);
  }
  else if (updateGamePhase.game_phase === "turn") { // turn 4 cards visible
    dealerHand.innerHTML = "";
    potCountUpdate(dealerHand, pot_count);
    dealerUpdate(dealerHand, flopCards, pot_count);
    dealerUpdate(dealerHand, turnCards, pot_count);
    dealerUpdate(dealerHand, filler, pot_count);
  }
  else if (updateGamePhase.game_phase === "river") { // river 5 cards visible
    dealerHand.innerHTML = "";
    potCountUpdate(dealerHand, pot_count);
    dealerUpdate(dealerHand, flopCards, pot_count);
    dealerUpdate(dealerHand, turnCards, pot_count);
    dealerUpdate(dealerHand, riverCards, pot_count);
  }

};

export { configure };