const roomId = document.querySelector("#room-id").value;
const gameSocketId = document.querySelector("#game-socket-id").value;
const userSocketId = document.querySelector("#user-socket-id").value;

const cardTemplate = document.querySelector("#card");
const dealerHand = document.querySelector("#community-cards");
const gameBoard = document.querySelector("#game-board");

const checkForm = document.querySelector("#check-form");
const raiseForm = document.querySelector("#raise-form");
const foldForm = document.querySelector("#fold-form");

const playerOneHandContainer = document.querySelector("#player1");
const playerTwoHandContainer = document.querySelector("#player2");
const playerThreeHandContainer = document.querySelector("#player3");
const playerFourHandContainer = document.querySelector("#player4");
const playerFiveHandContainer = document.querySelector("#player5");

const otherHandContainers = [playerTwoHandContainer, playerThreeHandContainer, playerFourHandContainer, playerFiveHandContainer];

export {
  roomId,
  gameSocketId,
  userSocketId,
  cardTemplate,
  checkForm,
  raiseForm,
  foldForm,
  dealerHand,
  playerOneHandContainer,
  otherHandContainers
}