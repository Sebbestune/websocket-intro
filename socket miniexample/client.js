import {io} from "socket.io-client";

const socket = io("ws://localhost:3000");

socket.on("message", (message)=> {
    console.log(message);
})

socket.emit("response", "Hello there to you too!");