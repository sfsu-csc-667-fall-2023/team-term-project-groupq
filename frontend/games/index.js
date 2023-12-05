import { configure as gameSocketConfig } from "./game_socket";
import { configure as userSocketConfig } from "./user_socket";
import { checkForm, raiseForm, foldForm } from "./page-data"
import { ready } from "./ready"

const gameSocket = await gameSocketConfig()
const userSocket = await userSocketConfig()

ready(gameSocket, userSocket);






// The code below prevents the user from entering the new URL games/id/(check, raise or fold)


const handleUserAction = (event) => {
  event.preventDefault();

  const { action, method } = event.target.attributes;
  fetch(action.value, { method: method.value });

  return false;
};

checkForm.addEventListener("submit", handleUserAction);
raiseForm.addEventListener("submit", handleUserAction);
foldForm.addEventListener("submit", handleUserAction);
