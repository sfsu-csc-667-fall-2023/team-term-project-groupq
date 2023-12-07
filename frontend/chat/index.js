import { io } from "socket.io-client";

const chatWindow = document.querySelector("#chat-window");

const chatSocket = io();

const roomId = document.querySelector("#room-id").value;

chatSocket.on(`chat:message:${roomId}`, ({ from, timestamp, message }) => {
  const div = document.querySelector("#chat-message").content.cloneNode(true);
  console.log(div);

  const p = div.querySelector("p");
  p.innerText = from + ": " + message;

  chatWindow.scrollTop = chatWindow.scrollHeight;
  chatWindow.appendChild(div);
});

document.querySelector("#message").addEventListener("keydown", (event) => {
  if (event.keyCode == 13) {
    const message = event.target.value;
    const url = event.target.dataset.url;

    fetch(`${document.location.pathname}/chat`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    event.target.value = "";
  }
});
