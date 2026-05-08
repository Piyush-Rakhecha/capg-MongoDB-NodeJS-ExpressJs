const express = require("express");
const app = express();
const PORT = 4000;

app.get("/", (req, res) => {
  res.send("App is up and running!");
});

app.get("/html", (req, res) => {
  res.send("<h1>Hello from the HTML route!</h1>");
});

app.get("/json", (req, res) => {
  res.json({
    status: "success",
    message: "JSON response from server",
  });
});

app.get("/array", (req, res) => {
  res.json([10, 20, 30, 40, 50]);
});

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`App running on http://localhost:${PORT}`);
});
