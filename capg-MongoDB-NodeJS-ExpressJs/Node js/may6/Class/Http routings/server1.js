const http = require("http");

const server = http.createServer((req, res) => {
  res.write("Server is up");
  res.end();
});

server.listen(3000, (err) => {
  if (err) throw err;
  console.log("Server running at http://localhost:3000");
});
