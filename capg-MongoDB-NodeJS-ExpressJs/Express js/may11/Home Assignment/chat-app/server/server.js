const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let onlineUsers = 0;

io.on("connection", (socket) => {
  onlineUsers++;

  console.log(`New connection: ${socket.id}`);

  io.emit("user_count", onlineUsers);

  socket.broadcast.emit("system_message", "Someone joined the chat");

  socket.on("chat_message", (data) => {
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

    io.emit("user_count", onlineUsers);

    io.emit("system_message", "Someone left the chat");

    console.log(`Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
