const Product = require("../models/Product");

exports.getAllProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.status(200).json({
        message: "Products Fetched",
        success: true,
        count: products.length,
        products,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    });
};

exports.getProductById = (req, res) => {
  Product.findOne({
    id: Number(req.params.id),
  })
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.status(200).json({
        success: true,
        product,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    });
};
