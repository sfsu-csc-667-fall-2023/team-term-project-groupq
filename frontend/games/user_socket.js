import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "../../constants/games";
import { userSocketId, cardTemplate, otherHandContainers } from "./page-data"


let socket;

const configure = () => {
  socket = io({ query: { id: userSocketId } });

  socket.on(GAME_CONSTANTS.HAND_UPDATED, ({ user_id, current_person_playing, hand, ready_count, current_player, simplifiedPlayers }) => {
    console.log(GAME_CONSTANTS.HAND_UPDATED, { user_id, current_person_playing, hand, ready_count, current_player, simplifiedPlayers })

    console.log(simplifiedPlayers);
    const playerId = user_id;
    let count = 1;
    simplifiedPlayers.forEach(({ user_id, chip_count, username }) => {
      if (user_id > 0 ) {
        if (playerId === user_id) {
          updatePlayerHand(hand, chip_count, username);
        }
        else {
          updateHiddenHand(otherHandContainers[count], hand, chip_count, username);
          count++;
        }
      }
    });

    const filteredPlayers = simplifiedPlayers.filter(player => player.user_id >= 0);

    if (ready_count >= 2) {
      filteredPlayers.forEach(({ user_id: filteredUserId, current_player: filteredCurrentPlayer}) => {

        if (filteredUserId > 0) {
          
          if (filteredUserId == user_id && filteredCurrentPlayer == 0) {
            const circle1 = document.createElement("div");
            circle1.classList.add(`dot`);
            otherHandContainers[0].appendChild(circle1);
          }

          else if (filteredUserId == user_id && filteredCurrentPlayer > 0) {
            const circle1 = document.createElement("div");
            circle1.classList.add(`dotHidden`);
            otherHandContainers[0].appendChild(circle1);
          }
          else {
            if (filteredCurrentPlayer == 0) {
              const circle2 = document.createElement("div");
              circle2.classList.add(`dot`);
              otherHandContainers[1].appendChild(circle2);
            }
          }
        }
      });
    }

    
  })

  console.log("This is socketID = ", userSocketId)
  console.log("User socket configured");
  return Promise.resolve(socket)
};

const updatePlayerHand = (cardList, chip_count, user_id) => {

  otherHandContainers[0].innerHTML = "";

  const seatPosition = String(user_id);
  const p = document.createElement("p");
  p.textContent = `Player ${seatPosition}, chip_count = ${chip_count}`;

  otherHandContainers[0].appendChild(p);

  cardList.forEach(({ suit, number }, index) => {
    const container = cardTemplate.content.cloneNode(true);
    const div = container.querySelector(".card");

    div.classList.add(`suit-${suit}`);
    div.classList.add(`number-${number}`);

    otherHandContainers[0].appendChild(div);
  });
};

const updateHiddenHand = (container, cardList, chip_count, user_id) => {

  container.innerHTML = "";

  const seatPosition = String(user_id);
  const p = document.createElement("p");
  p.textContent = `Player ${seatPosition}, chip_count = ${chip_count}`;

  container.appendChild(p);

  cardList.forEach(({ suit, number }, index) => {
    const containerhand = cardTemplate.content.cloneNode(true);
    const div = containerhand.querySelector(".card");

    div.classList.add(`player-${seatPosition}`);
    div.classList.add(`card-${seatPosition}`);

    container.appendChild(div);
  });
};


export { configure };
