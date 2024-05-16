import express from "express";
const app = express();
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const room = ["room1", "room2"];

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.join("room1");

  socket.on("change room", (room) => {
    io.emit(
      "chat message",
      "User: " +
        socket.id +
        " changed room to: " +
        room
    );

    socket.leave(Array.from(socket.rooms)[1]);
    socket.join(room);
    const printableArray = Array.from(socket.rooms);

    console.log(socket.id + " now in rooms " + printableArray + " total " + printableArray.length);
  });

  socket.on("chat message", (msg) => {
    io.to(Array.from(socket.rooms)[1]).emit("chat message", msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
