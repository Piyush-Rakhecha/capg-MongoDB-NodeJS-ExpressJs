const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017";

let db;

const initDb = async () => {
  const client = await MongoClient.connect(MONGO_URL);
  db = client.db("jecrc");
  console.log("jecrc database connected");
  await db.createCollection("users");
};

initDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h1>Express With MongoDB</h1>");
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

app.post("/register", async (req, res) => {
  const data = req.body;
  console.log(data);
  await db.collection("users").insertOne(data);
  res.status(200).send({ message: "User registered", data });
});

app.get("/users", async (req, res) => {
  const users = await db.collection("users").find().toArray();
  res.send(users);
});

app.get("/users/:email", async (req, res) => {
  const user = await db.collection("users").findOne({ email: req.params.email });
  res.send(user);
});

app.put("/users", async (req, res) => {
  const result = await db.collection("users").updateOne(
    { email: req.body.email },
    { $set: req.body }
  );
  res.send({ message: "User updated", result });
});

app.patch("/users", async (req, res) => {
  const result = await db.collection("users").updateOne(
    { email: req.body.email },
    { $set: req.body }
  );
  res.send({ message: "User patched", result });
});

app.delete("/users", async (req, res) => {
  const result = await db.collection("users").deleteOne({ email: req.body.email });
  res.send({ message: "User deleted", result });
});

app.get("/DisplayUsers", async (req, res) => {
  const users = await db.collection("users").find().toArray();
  let output = "";
  users.forEach((u) => {
    output += `
      <div>
        <p><strong>${u.name}</strong></p>
        <p>Email: ${u.email}</p>
        <p>Phone: ${u.phone}</p>
        <p>City: ${u.city}</p>
        <hr>
      </div>
    `;
  });
  res.send(output);
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
