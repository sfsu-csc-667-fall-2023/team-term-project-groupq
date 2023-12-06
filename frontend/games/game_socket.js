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
const stateUpdated = ({ game_id, flopCards, turnCards, riverCards, players, current_player, numOfCards }) => {
  console.log(GAME_CONSTANTS.STATE_UPDATED, { game_id, flopCards, turnCards, riverCards, players, current_player, numOfCards })
  // console.log("LENGTH OF PLAYERS", Object.keys(players).length)

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