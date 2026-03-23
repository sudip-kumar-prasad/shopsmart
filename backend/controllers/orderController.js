const asyncHandler = require('express-async-handler');
const OrderService = require('../services/OrderService.js');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  try {
    const createdOrder = await OrderService.createOrder(req.body, req.user._id);
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(error.status || 500);
    throw new Error(error.message);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await OrderService.getOrderById(req.params.id);
    res.json(order);
  } catch (error) {
    res.status(error.status || 500);
    throw new Error(error.message);
  }
});

module.exports = { addOrderItems, getOrderById };
