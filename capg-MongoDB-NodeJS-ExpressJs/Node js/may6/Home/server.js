const http = require("http");
const { MongoClient } = require("mongodb");

const MONGO_URI = "mongodb://127.0.0.1:27017";
const DB_NAME = "nodeAssignment";
const COL_NAME = "users";

let col;

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => { raw += chunk.toString(); });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function respond(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload, null, 2));
}

const server = http.createServer(async (req, res) => {
  const { url, method } = req;
  const segments = url.split("/");
  const userId = Number(segments[2]);

  try {
    if (url === "/" && method === "GET") {
      return respond(res, 200, { message: "Welcome to Node.js CRUD API" });
    }

    if (url === "/users" && method === "GET") {
      const users = await col.find({}).toArray();
      return respond(res, 200, { success: true, users });
    }

    if (segments[1] === "users" && method === "GET" && userId) {
      const user = await col.findOne({ id: userId });
      if (!user) return respond(res, 404, { success: false, message: "User not found" });
      return respond(res, 200, { success: true, user });
    }

    if (url === "/users" && method === "POST") {
      const body = await parseBody(req);
      const last = await col.find({}).sort({ id: -1 }).limit(1).toArray();
      body.id = last.length > 0 ? last[0].id + 1 : 1;
      await col.insertOne(body);
      return respond(res, 201, { success: true, message: "User created", user: body });
    }

    if (segments[1] === "users" && method === "PUT" && userId) {
      const body = await parseBody(req);
      body.id = userId;
      const result = await col.replaceOne({ id: userId }, body);
      if (result.matchedCount === 0) return respond(res, 404, { success: false, message: "User not found" });
      return respond(res, 200, { success: true, message: "User replaced" });
    }

    if (segments[1] === "users" && method === "PATCH" && userId) {
      const body = await parseBody(req);
      const result = await col.updateOne({ id: userId }, { $set: body });
      if (result.matchedCount === 0) return respond(res, 404, { success: false, message: "User not found" });
      return respond(res, 200, { success: true, message: "User updated" });
    }

    if (segments[1] === "users" && method === "DELETE" && userId) {
      const result = await col.deleteOne({ id: userId });
      if (result.deletedCount === 0) return respond(res, 404, { success: false, message: "User not found" });
      return respond(res, 200, { success: true, message: "User deleted" });
    }

    respond(res, 404, { success: false, message: "Route not found" });
  } catch (err) {
    respond(res, 500, { success: false, error: err.message });
  }
});

async function startServer() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log("MongoDB connected");
    col = client.db(DB_NAME).collection(COL_NAME);
    server.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  } catch (err) {
    console.log(err.message);
  }
}

startServer();
