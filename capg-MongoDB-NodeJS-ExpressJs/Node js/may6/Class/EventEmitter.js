const EventEmitter = require("events");
const emitter = new EventEmitter();

emitter.on("connect", () => {
  console.log("User connected");
});

emitter.on("disconnect", () => {
  console.log("User disconnected");
});

emitter.emit("connect");
emitter.emit("disconnect");
