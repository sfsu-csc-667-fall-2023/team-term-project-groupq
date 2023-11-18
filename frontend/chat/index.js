import { io } from "socket.io-client";

const chatWindow = document.querySelector("#chat-window");

const chatSocket = io();

chatSocket.on("chat:message:0", ({ from, timestamp, message}) => {
    const div = document.createElement("div")
    div.classList.add("message");
    
    const img = document.createElement("img");
    img.src = `https://gravatar.com/avatar/${hash}?s=30`;
    img.alt = `Avatar of ${from}`

    const p = document.createElement("p");
    p.innerText = message;

    div.appendChild(img);
    div.appendChild(p);

    chatWindow.appendChild(div);
});

document.querySelector("#message").addEventListener("keydown", event => {
    //console.log({event})
    //keycode 13
    if(event.keyCode == 13) {
        const message = event.target.value;

        fetch("/chat/0", {
            method: "post", 
            headers: { "Content-Type": "application/json"}, 
            body: JSON.stringify({message})
        })

        event.target.value = "";
    }
})