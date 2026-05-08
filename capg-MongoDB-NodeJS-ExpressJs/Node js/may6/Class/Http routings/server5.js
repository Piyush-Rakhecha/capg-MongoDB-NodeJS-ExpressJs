const http = require("http");

const server = http.createServer((req, res) => {
  const hero = {
    name: "Thor",
    power: "Lightning",
  };

  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify(hero));
});

server.listen(3000, (err) => {
  if (err) throw err;
  console.log("Server running at http://localhost:3000");
});
