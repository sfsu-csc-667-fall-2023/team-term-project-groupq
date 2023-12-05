import { roomId } from "./page-data"

const connectionState = {
  game: false,
  user: false,
  updated: Date.now(),
}

const checkForReady = () => {
  const { game, user } = connectionState;

  if (game && user) {
    fetch(`/games/${roomId}/ready`, { method: "post" });
  }
}

const ready = (gameSocket, userSocket) => {

  console.log("READY CALLED", connectionState)

  gameSocket.on("connect", () => {
    connectionState.game = true;
    connectionState.updated = Date.now();

    checkForReady();
  })

  userSocket.on("connect", () => {
    connectionState.user = true;
    connectionState.updated = Date.now();

    checkForReady();
  })
}

export { ready }