const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
const MONGO_URL = "mongodb://localhost:27017";

let db;

const initDb = async () => {
  const client = await MongoClient.connect(MONGO_URL);
  db = client.db("jecrc");
  console.log("Connected to jecrc database");
  await db.createCollection("users");
  console.log("users collection ready");
};

initDb();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Express + MongoDB</h1>");
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

app.post("/register", async (req, res) => {
  const data = req.body;
  console.log(data);
  await db.collection("users").insertOne(data);
  res.status(200).send({
    message: "Registration successful",
    data,
  });
});

app.get("/users", async (req, res) => {
  const users = await db.collection("users").find().toArray();
  res.send(users);
});

app.get("/users/:email", async (req, res) => {
  const { email } = req.params;
  const user = await db.collection("users").findOne({ email });
  res.send(user);
});

app.put("/users", async (req, res) => {
  const { email } = req.body;
  const result = await db.collection("users").updateOne(
    { email },
    { $set: req.body }
  );
  res.send({ message: "User updated", result });
});

app.patch("/users", async (req, res) => {
  const { email } = req.body;
  const result = await db.collection("users").updateOne(
    { email },
    { $set: req.body }
  );
  res.send({ message: "User patched", result });
});

app.delete("/users", async (req, res) => {
  const { email } = req.body;
  const result = await db.collection("users").deleteOne({ email });
  res.send({ message: "User removed", result });
});

app.get("/allusers", async (req, res) => {
  const users = await db.collection("users").find().toArray();
  let html = "";
  users.forEach((u) => {
    html += `
      <div>
        <p>${u.name}</p>
        <p>Email: ${u.email}</p>
        <p>Phone: ${u.phone}</p>
        <p>City: ${u.city}</p>
        <hr>
      </div>
    `;
  });
  res.send(html);
});

app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.listen(3000, (err) => {
  if (err) throw err;
  console.log("Server running at http://localhost:3000");
});
