console.log("start");

const fs = require("fs");

const stream = fs.createReadStream(__dirname);
console.log(__dirname);
console.log(__filename);

stream.close();
stream.on("close", () => {
  console.log("stream closed");
});

Promise.resolve().then(() => {
  console.log("promise resolved");
});

setTimeout(() => {
  console.log("setTimeout fired");
}, 0);

setImmediate(() => {
  console.log("setImmediate fired");
});

process.nextTick(() => {
  console.log("nextTick fired");
});
