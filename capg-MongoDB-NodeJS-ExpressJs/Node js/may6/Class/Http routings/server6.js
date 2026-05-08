const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "content-type": "text/plain" });
    res.end("Home Page");
  } else if (req.url === "/about" && req.method === "GET") {
    res.writeHead(200, { "content-type": "text/html" });
    res.write("<h1>About Page</h1>");
    res.end();
  } else if (req.url === "/api/heroes" && req.method === "GET") {
    const hero = { name: "Thor", power: "Lightning" };
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(hero));
  } else {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("404 Not Found");
  }
});

server.listen(3000, (err) => {
  if (err) throw err;
  console.log("Server running at http://localhost:3000");
});
