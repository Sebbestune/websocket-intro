import { Server } from "socket.io";

const io = new Server(3000);

io.on("connection", (socket) => {
    socket.emit("message", "Hello world!");

    socket.on("response", (message) => {
        console.log(message);
    });
});