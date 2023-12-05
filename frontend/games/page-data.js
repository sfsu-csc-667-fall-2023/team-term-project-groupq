const roomId = document.querySelector("#room-id").value;
const gameSocketId = document.querySelector("#game-socket-id").value;
const userSocketId = document.querySelector("#user-socket-id").value;

const cardTemplate = document.querySelector("#card");

const checkForm = document.querySelector("#check-form");
const raiseForm = document.querySelector("#raise-form");
const foldForm = document.querySelector("#fold-form");

const playerOneHandContainer = document.querySelector("#player1")

export {
  roomId,
  gameSocketId,
  userSocketId,
  cardTemplate,
  checkForm,
  raiseForm,
  foldForm,
  playerOneHandContainer
}