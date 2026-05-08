const express = require("express");

const app = express();

app.use(express.json());

let products = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Phone" },
];

app.get("/", (req, res) => {
  res.send("<h1>Welcome</h1>");
});

app.get("/products", (req, res) => {
  res.status(200).json(products);
});

app.post("/products", (req, res) => {
  products.push(req.body);
  res.status(201).json({
    message: "Product added",
    products,
  });
});

app.put("/products", (req, res) => {
  products = products.map((item) =>
    item.id === req.body.id ? { ...item, ...req.body } : item
  );
  res.status(200).json({
    message: "Product updated",
    products,
  });
});

app.patch("/products", (req, res) => {
  products = products.map((item) =>
    item.id === req.body.id ? { ...item, ...req.body } : item
  );
  res.status(200).json({
    message: "Product patched",
    products,
  });
});

app.delete("/products", (req, res) => {
  products = products.filter((item) => item.id !== req.body.id);
  res.status(200).json({
    message: "Product removed",
    products,
  });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
