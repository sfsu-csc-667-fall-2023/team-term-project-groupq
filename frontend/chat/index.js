import { io } from "socket.io-client";

const chatWindow = document.querySelector("#chat-window");

const chatSocket = io();

const roomId = document.querySelector("#room-id").value;

chatSocket.on(`chat:message:${roomId}`, ({ from, timestamp, message}) => {

    const div = document.querySelector("#chat-message").content.cloneNode(true);
    console.log(div)

    const p = div.querySelector("p");
    p.innerText = from + ": " + message;
    chatWindow.appendChild(div);


    // const div = document.createElement("div");
    // div.classList.add("message");
    // const p = document.createElement("p");
    // p.innerText = from + ": " + message;
    // div.appendChild(p);
    // chatWindow.appendChild(div);
});

document.querySelector("#message").addEventListener("keydown", event => {
    //console.log({event})
    //keycode 13
    if(event.keyCode == 13) {
        const message = event.target.value;
        const url = event.target.dataset.url;

        fetch(`${document.location.pathname}/chat` , {
            method: "post", 
            headers: { "Content-Type": "application/json"}, 
            body: JSON.stringify({message})
        })

        event.target.value = "";
    }
})