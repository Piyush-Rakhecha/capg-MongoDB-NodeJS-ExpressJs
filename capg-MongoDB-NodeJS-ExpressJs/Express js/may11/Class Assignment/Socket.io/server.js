const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

let onlineUsers = 0;

io.on("connection", (socket) => {
  onlineUsers++;
  console.log(`New connection: ${socket.id} | Total online: ${onlineUsers}`);

  io.emit("user_count", onlineUsers);

  socket.broadcast.emit("system_message", "Someone joined the chat");

  socket.on("chat_message", (data) => {
    console.log(`[${socket.id.slice(0, 6)}]: ${data.text}`);

    io.emit("chat_message", {
      id: socket.id.slice(0, 6),
      text: data.text,
      timestamp: new Date().toLocaleTimeString(),
    });
  });

  socket.on("typing", (isTyping) => {
    socket.broadcast.emit("typing", {
      userId: socket.id.slice(0, 6),
      isTyping,
    });
  });

  socket.on("disconnect", () => {
    onlineUsers--;
    console.log(`Connection closed: ${socket.id} | Total online: ${onlineUsers}`);
    io.emit("user_count", onlineUsers);
    io.emit("system_message", "Someone left the chat");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Chat server is live at http://localhost:${PORT}`);
});
