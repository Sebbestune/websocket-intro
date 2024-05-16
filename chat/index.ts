import express from "express";
const app = express();
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  (socket as any).username = socket.id;
  console.log("A user connected: named: " + (socket as any).username);

  socket.join("room1");

  socket.on("change room", (room) => {
    io.emit("chat message", "User: " + (socket as any).username + " changed room to: " + room);

    socket.leave(Array.from(socket.rooms)[1]);
    socket.join(room);
    const printableArray = Array.from(socket.rooms);

    console.log(
      (socket as any).username +
        " now in rooms " +
        printableArray +
        " total " +
        printableArray.length
    );
  });

  socket.on("chat message", (msg) => {
    io.to(Array.from(socket.rooms)[1]).emit(
      "chat message",
      (socket as any).username + " said: " + msg
    );
  });

  socket.on("change username", (username) => {
    const prevName = (socket as any).username;
    console.log("Prev name: " + prevName);
    (socket as any).username = username;
    console.log("New name: " + (socket as any).username);
    io.to(Array.from(socket.rooms)[1]).emit(
      "chat message",
      prevName + "changed name to " + (socket as any).username
    );
  });

  socket.on("disconnect", () => {
    console.log((socket as any).username + " disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
