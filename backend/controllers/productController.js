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

// @desc    Fetch top trending products
// @route   GET /api/products/trending
// @access  Public
const getTrending = asyncHandler(async (req, res) => {
  try {
    const products = await ProductService.getTrendingProducts(1, 7);
    res.json(products);
  } catch (error) {
    res.status(error.status || 500);
    throw new Error(error.message);
  }
});

// @desc    Fetch deals products
// @route   GET /api/products/deals
// @access  Public
const getDeals = asyncHandler(async (req, res) => {
  try {
    const products = await ProductService.getDealsProducts(20);
    res.json(products);
  } catch (error) {
    res.status(error.status || 500);
    throw new Error(error.message);
  }
});

const Product = require('../models/productModel.js');

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added', product });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = { getProducts, getProductById, getTrending, getDeals, createProductReview };
