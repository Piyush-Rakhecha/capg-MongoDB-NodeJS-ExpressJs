const express = require("express");
const router = express.Router();

router.get("/users/:id", (req, res) => {
  res.send(`Fetching user with id: ${req.params.id}`);
});

router.post("/users/:id", (req, res) => {
  res.send(`Creating user with id: ${req.params.id}`);
});

router.put("/users/:id", (req, res) => {
  res.send(`Full update for user id: ${req.params.id}`);
});

router.patch("/users/:id", (req, res) => {
  res.send(`Partial update for user id: ${req.params.id}`);
});

router.delete("/users/:id", (req, res) => {
  res.send(`Deleting user with id: ${req.params.id}`);
});

module.exports = router;
