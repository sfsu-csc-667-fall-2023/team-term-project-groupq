import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "../../constants/games";
import {
  userSocketId,
  cardTemplate,
  playerOneHandContainer,
  otherHandContainers,
} from "./page-data";

let socket;

const configure = () => {
  socket = io({ query: { id: userSocketId } });

  socket.on(
    GAME_CONSTANTS.HAND_UPDATED,
    ({ user_id, hand, ready_count, simplifiedPlayers }) => {
      const filteredPlayers = simplifiedPlayers.filter(
        (player) => player.user_id >= 0,
      );

      let num = 0;
      filteredPlayers.forEach(({ user_id: playerId, chip_count, username }) => {
        if (playerId === user_id) {
          updatePlayerHand(hand, chip_count, username);
        } else {
          updateHiddenHand(
            otherHandContainers[num],
            hand,
            chip_count,
            username,
          );
          num++;
        }
      });

      num = 0;
      if (ready_count >= 2) {
        filteredPlayers.forEach(
          (
            { user_id: filteredUserId, current_player: filteredCurrentPlayer },
            index,
          ) => {
            if (filteredUserId == user_id && filteredCurrentPlayer == 0) {
              const circle1 = document.createElement("div");
              circle1.classList.add(`dot`);
              playerOneHandContainer.appendChild(circle1);
            } else if (filteredUserId == user_id && filteredCurrentPlayer > 0) {
              const circle1 = document.createElement("div");
              circle1.classList.add(`dotHidden`);
              playerOneHandContainer.appendChild(circle1);
            } else {
              if (filteredCurrentPlayer == 0) {
                const circle2 = document.createElement("div");
                circle2.classList.add(`dot`);
                otherHandContainers[num].appendChild(circle2);
                num++;
              }
            }
          },
        );
      }
    },
  );

  socket.on(GAME_CONSTANTS.PLAYER_LOSS, (_) => {
    location.assign("/match_end");
  });

  console.log("This is socketID = ", userSocketId);
  console.log("User socket configured");
  return Promise.resolve(socket);
};

const updatePlayerHand = (cardList, chip_count, username) => {
  playerOneHandContainer.innerHTML = "";

  const seatPosition = String(username);
  //const p = document.createElement("p");
  //p.textContent = `Player ${seatPosition}, Total Chip: $${chip_count}`;

  const playerInfoSpan = document.createElement("p");
  playerInfoSpan.textContent = `Player ${seatPosition}`;

  const lineBreak = document.createElement("br");

  const totalChipSpan = document.createElement("p");
  totalChipSpan.textContent = `, Total Chip: $${chip_count}`;

  playerOneHandContainer.appendChild(playerInfoSpan);
  playerOneHandContainer.appendChild(lineBreak);
  playerOneHandContainer.appendChild(totalChipSpan);

  //playerOneHandContainer.appendChild(p);

  cardList.forEach(({ suit, number }, index) => {
    const container = cardTemplate.content.cloneNode(true);
    const div = container.querySelector(".card");

    div.classList.add(`suit-${suit}`);
    div.classList.add(`number-${number}`);

    playerOneHandContainer.appendChild(div);
  });
};

const updateHiddenHand = (container, cardList, chip_count, username) => {
  container.innerHTML = "";

  const seatPosition = String(username);
  //const p = document.createElement("p");
  //p.textContent = `Player ${seatPosition}, chip_count = ${chip_count}`;

  const playerInfoSpan = document.createElement("p");
  playerInfoSpan.textContent = `Player ${seatPosition}`;

  const lineBreak = document.createElement("br");

  const totalChipSpan = document.createElement("p");
  totalChipSpan.textContent = `Total Chip: $${chip_count}`;

  container.appendChild(playerInfoSpan);
  container.appendChild(lineBreak);
  container.appendChild(totalChipSpan);

  //container.appendChild(p);

  cardList.forEach((_) => {
    const containerhand = cardTemplate.content.cloneNode(true);
    const div = containerhand.querySelector(".card");

    div.classList.add(`player-${seatPosition}`);
    div.classList.add(`card-${seatPosition}`);

    container.appendChild(div);
  });
};

export { configure };
