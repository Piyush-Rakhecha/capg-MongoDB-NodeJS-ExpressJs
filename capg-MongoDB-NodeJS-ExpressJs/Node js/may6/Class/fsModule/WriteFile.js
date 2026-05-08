const fs = require("fs");

fs.writeFile("./message.txt", "hello from write file", (err) => {
  if (err) throw err;
  console.log("file written");
});
