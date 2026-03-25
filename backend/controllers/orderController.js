const asyncHandler = require('express-async-handler');
const OrderService = require('../services/OrderService.js');
const Order = require('../models/orderModel.js');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  try {
    const createdOrder = await OrderService.createOrder(req.body, req.user?._id);
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

// @desc    Get orders for logged in user
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

module.exports = { addOrderItems, getOrderById, getMyOrders };

