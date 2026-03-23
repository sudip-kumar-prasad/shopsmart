const asyncHandler = require('express-async-handler');
const ProductService = require('../services/ProductService.js');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await ProductService.getAllProducts();
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(error.status || 500);
    throw new Error(error.message);
  }
});

module.exports = { getProducts, getProductById };
