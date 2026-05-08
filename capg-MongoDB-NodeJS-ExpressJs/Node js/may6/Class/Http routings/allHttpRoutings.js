const http = require("http");

let users = [
  { id: 1, name: "Sachin" },
  { id: 2, name: "Rohit" },
];

const server = http.createServer((req, res) => {
  if (req.url === "/users" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  } else if (req.url === "/users" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => { body += chunk.toString(); });
    req.on("end", () => {
      const newUser = JSON.parse(body);
      users.push(newUser);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User added", users }));
    });
  } else if (req.url === "/users" && req.method === "PUT") {
    let body = "";
    req.on("data", (chunk) => { body += chunk.toString(); });
    req.on("end", () => {
      const updated = JSON.parse(body);
      users = users.map((u) => (u.id === updated.id ? updated : u));
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User updated", users }));
    });
  } else if (req.url === "/users" && req.method === "DELETE") {
    let body = "";
    req.on("data", (chunk) => { body += chunk.toString(); });
    req.on("end", () => {
      const toDelete = JSON.parse(body);
      users = users.filter((u) => u.id !== toDelete.id);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User deleted", users }));
    });
  } else if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Node.js CRUD Server");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
