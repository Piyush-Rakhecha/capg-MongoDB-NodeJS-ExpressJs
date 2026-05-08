const fs = require("fs");
const readable = fs.createReadStream("./data.txt");

readable.on("data", (chunk) => {
  console.log(chunk.toString());
});

readable.on("error", (err) => {
  console.log("error occurred:", err.message);
});

readable.on("end", () => {
  console.log("finished reading");
});
