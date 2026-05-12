const express = require("express");

const productRouter = express.Router();

const {
  getAllProducts,
  getProductById,
} = require("../controllers/productController");

productRouter.get("/products", getAllProducts);

productRouter.get("/products/:id", getProductById);

module.exports = productRouter;
