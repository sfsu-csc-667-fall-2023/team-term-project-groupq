import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "../../constants/games";

let gameSocket;

const configure = (socketId) => {
  gameSocket = io({ query: { id: socketId } });

  Object.keys(GAME_CONSTANTS).forEach((key) => {
    gameSocket.on(GAME_CONSTANTS[key], (data) => {
      console.log({ event: GAME_CONSTANTS[key], data });
    });
  });

  console.log("Game socket configured");

  return Promise.resolve();
};

export { configure };
