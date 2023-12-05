import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "../../constants/games";
import { userSocketId, playerOneHandContainer, cardTemplate } from "./page-data"

let socket;

const configure = () => {
  socket = io({ query: { id: userSocketId } });

  socket.on(GAME_CONSTANTS.HAND_UPDATED, ({ current_person_playing, hand, chip_count }) => {
    console.log(GAME_CONSTANTS.HAND_UPDATED, { current_person_playing, hand, chip_count })

    updateHand(hand, chip_count);
    // updateHand(playerTwoHand, seatTwoCards, 1, secondPlayerChipCount);
  })

  console.log("User socket configured");
  return Promise.resolve(socket)
};

const updateHand = (cardList, chip_count, seat) => {
  console.log("UPDATE HAND", { cardList, chip_count, seat }, Array.isArray(cardList))
  playerOneHandContainer.innerHTML = "";

  const seatPosition = String(seat);
  const p = document.createElement("p");
  p.textContent = `PLAYER ${seatPosition} HERE: CHIP_COUNT = ${chip_count}`;

  playerOneHandContainer.appendChild(p);

  // cardList = hand
  cardList.forEach(({ suit, number }, index) => {
    const container = cardTemplate.content.cloneNode(true);
    const div = container.querySelector(".card");

    // This adds the input suit-{} number-{} as a class NAME -> EXTRACT FOR CSS
    div.classList.add(`suit-${suit}`);
    div.classList.add(`number-${number}`);

    playerOneHandContainer.appendChild(div);
  });
};

export { configure };
