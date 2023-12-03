import { configure as gameSocketConfig } from "./game_socket";
import { configure as userSocketConfig } from "./user_socket";

//import * as GAME_CONSTANTS from "../../constants/games";

// We passed the game/user socket ID through the hidden field, and this code below extracts it from backend to frontend
// Its a way to pass information from the server to the client through a specific game socket or a specific user
const gameSocketId = document.querySelector("#game-socket-id").value;
const userSocketId = document.querySelector("#user-socket-id").value;
const roomId = document.querySelector("#room-id").value;

console.log("HELLO THIS IS THE ROOM ID:");
console.log(roomId, gameSocketId, userSocketId);

// Once the gamesocket and the usersocket are both available -> created OR joined a room, then pass this code through
gameSocketConfig(gameSocketId)
  .then((_) => userSocketConfig(userSocketId))
  .then((_) => {
    console.log("Fetching");
    fetch(`/games/${roomId}/ready`, { method: "post" });
  });
