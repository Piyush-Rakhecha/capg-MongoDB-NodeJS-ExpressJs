const fs = require("fs");
const writable = fs.createWriteStream("./message.txt");

writable.write("writing via stream", (err) => {
  if (err) throw err;
  console.log("write complete");
});
