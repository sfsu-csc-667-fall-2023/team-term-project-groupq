import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "../../constants/games";
import { gameSocketId } from "./page-data"


let socket;

const configure = () => {
  socket = io({ query: { id: gameSocketId } });

  socket.on(GAME_CONSTANTS.STATE_UPDATED, stateUpdated);

  console.log("Game socket configured");
  return Promise.resolve(socket)
};

const cardTemplate = document.querySelector("#card");

const playerOneHand = document.querySelector(".player-one-hand");
const playerTwoHand = document.querySelector(".player-two-hand");
const dealerHand = document.querySelector("#community-cards");

// const playerThreeHand = document.querySelector("#player3");
// const playerFourHand = document.querySelector("#player4");
// const playerFiveHand = document.querySelector("#player5");

const dealerUpdate = (handContainer, cardList) => {
  // cardList = hand
  cardList.forEach(({ suit, number }, index) => {
    const container = cardTemplate.content.cloneNode(true);
    const div = container.querySelector(".card");

    // This adds the input suit-{} number-{} as a class NAME -> EXTRACT FOR CSS
    div.classList.add(`suit-${suit}`);
    div.classList.add(`number-${number}`);

    handContainer.appendChild(div);
  });
};

// get the data from game_state
const stateUpdated = ({ game_id, flopCards, turnCards, riverCards }) => {
  console.log(GAME_CONSTANTS.STATE_UPDATED, { game_id, flopCards, turnCards, riverCards })

  // let firstPosition;
  // let secondPosition;

  console.log("WEB POSITION HERE");
  // players.forEach((player) => {
  //   if (player.web_position == 0) {
  //     firstPosition = player.user_id;
  //   } else if (player.web_position == 1) {
  //     secondPosition = player.user_id;
  //   }
  // });

  // let firstPlayerChipCount;
  // let secondPlayerChipCount;

  // players.forEach((player) => {
  //   if (player.web_position == 0) {
  //     firstPlayerChipCount = player.chip_count;
  //   } else if (player.web_position == 1) {
  //     secondPlayerChipCount = player.chip_count;
  //   }
  // });

  // console.log("WHAT IS PLAYERS HERE");
  // console.log(players);

  // const seatOneCards = players.find(
  //   (player) => player.user_id === firstPosition,
  // ).hand;
  // const seatTwoCards = players.find(
  //   (player) => player.user_id === secondPosition,
  // ).hand;
  // console.log("DOES IT LOG?");
  // console.log({ seatOneCards, seatTwoCards });

  dealerHand.innerHTML = "";
  dealerUpdate(dealerHand, flopCards);
  dealerUpdate(dealerHand, turnCards);
  dealerUpdate(dealerHand, riverCards);
};

export { configure };

/*
The info sent to the stateUpdated is GAMESTATE, which contains this for example:
gameState: {
  game_id: 39,
  game_socket_id: '8daa8a275faf67505b2bb2378f1eef2340dc17bd',
  current_player: { current_player: 2 },
  players: [ [Object], [Object], [Object] ]
},

players:
[
  {
    user_id: 1,
    sid: '6_dLjVLpRkb2BdP1zQRdre1k3rBNLSdQ',
    hand: [ [Object], [Object] ],
    current_player: true
  },

  {
    user_id: 2,
    sid: '0HfR-odpDVxUxju--0lmvkjoMZKOYIND',
    hand: [ [Object], [Object] ],
    current_player: false
  }
]

hand:
[
  {
    user_id: 2,
    game_id: 44,
    card_id: 29,
    card_order: 3,
    id: 29,
    suit: 'spades',
    number: 3
  },
  {
    user_id: 2,
    game_id: 44,
    card_id: 33,
    card_order: 1,

    id: 33,
    suit: 'spades',
    number: 7
  }
]

*/