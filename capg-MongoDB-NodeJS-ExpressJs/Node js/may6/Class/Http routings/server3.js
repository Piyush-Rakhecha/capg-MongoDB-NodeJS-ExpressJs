const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("content-type", "text/html");
  res.statusCode = 200;
  res.write("<h1>Hello from server</h1>");
  res.end();
});

server.listen(3000, (err) => {
  if (err) throw err;
  console.log("Server running at http://localhost:3000");
});
