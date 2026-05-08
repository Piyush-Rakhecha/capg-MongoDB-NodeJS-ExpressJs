const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("content-type", "text/plain");
  res.statusCode = 200;
  res.statusMessage = "OK";
  res.write("Hello from server");
  res.end();
});

server.listen(3000, (err) => {
  if (err) throw err;
  console.log("Server running at http://localhost:3000");
});
