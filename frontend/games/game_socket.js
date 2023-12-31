import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "../../constants/games";
import { dealerHand, cardTemplate, gameSocketId } from "./page-data";

let socket;

const configure = () => {
  socket = io({ query: { id: gameSocketId } });

  socket.on(GAME_CONSTANTS.STATE_UPDATED, stateUpdated);

  socket.on("showPopup", (data) => {
    alert(data.message);
  });

  console.log("Game socket configured");
  return Promise.resolve(socket);
};

const dealerUpdate = (handContainer, cardList) => {
  cardList.forEach(({ suit, number }) => {
    const container = cardTemplate.content.cloneNode(true);
    const div = container.querySelector(".card");

    div.classList.add(`suit-${suit}`);
    div.classList.add(`number-${number}`);

    handContainer.appendChild(div);
  });
};

const potCountUpdate = (handContainer, pot_count) => {
  const p = document.createElement("p");
  p.textContent = `Dealer Pot $${pot_count}`;
  p.classList.add("pot-count");

  handContainer.appendChild(p);
};

const gamePhaseUpdate = (gamePhase) => {
  const p = document.getElementById("game-phase");
  p.textContent = `Current Game Phase: ${gamePhase}`;
};

const stateUpdated = ({
  flopCards,
  turnCards,
  riverCards,
  pot_count,
  updateGamePhase,
}) => {
  
  const filler = [{ suit: "filler", number: "filler" }];
  gamePhaseUpdate(updateGamePhase.game_phase);

  if (updateGamePhase.game_phase === "preflop") {
    // pre-flop (all cards are hidden)
    dealerHand.innerHTML = "";
    potCountUpdate(dealerHand, pot_count);
    dealerUpdate(dealerHand, filler);
    dealerUpdate(dealerHand, filler);
    dealerUpdate(dealerHand, filler);
    dealerUpdate(dealerHand, filler);
    dealerUpdate(dealerHand, filler);
  } else if (updateGamePhase.game_phase === "flop") {
    // flop 3 cards visible
    dealerHand.innerHTML = "";
    potCountUpdate(dealerHand, pot_count);
    dealerUpdate(dealerHand, flopCards);
    dealerUpdate(dealerHand, filler);
    dealerUpdate(dealerHand, filler);
  } else if (updateGamePhase.game_phase === "turn") {
    // turn 4 cards visible
    dealerHand.innerHTML = "";
    potCountUpdate(dealerHand, pot_count);
    dealerUpdate(dealerHand, flopCards);
    dealerUpdate(dealerHand, turnCards);
    dealerUpdate(dealerHand, filler);
  } else if (updateGamePhase.game_phase === "river") {
    // river 5 cards visible
    dealerHand.innerHTML = "";
    potCountUpdate(dealerHand), pot_count;
    dealerUpdate(dealerHand, flopCards);
    dealerUpdate(dealerHand, turnCards);
    dealerUpdate(dealerHand, riverCards);
  }
};

export { configure };
