import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "../../constants/games";

let userSocket;

const configure = (socketId) => {
  userSocket = io({ query: { id: socketId } });

  userSocket.on(GAME_CONSTANTS.STATE_UPDATED, (data) => {
    console.log({ event: GAME_CONSTANTS.STATE_UPDATED, data });
  });

  console.log("User socket configured");
  return Promise.resolve();
};

export { configure };
