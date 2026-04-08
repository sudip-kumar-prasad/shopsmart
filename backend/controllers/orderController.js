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

const crypto = require('crypto');

const razorpayInstance = require('../config/razorpay.js');

// @desc    Create Razorpay Order
// @route   POST /api/orders/razorpay/create-order
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!razorpayInstance) {
    return res.status(500).json({ message: 'Razorpay is not configured on the server. Please check .env and npm install.' });
  }

  const options = {
    amount: Math.round(amount * 100), // amount in the smallest currency unit
    currency: 'INR',
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay Error Payload:', error);
    res.status(500).json({
      message: error.error?.description || error.message || 'Something went wrong creating the Razorpay order',
      details: error
    });
  }
});

// @desc    Verify Razorpay Payment
// @route   POST /api/orders/razorpay/verify
// @access  Private
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, dbOrderId } = req.body;

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (generatedSignature !== razorpaySignature) {
    res.status(400);
    throw new Error('Payment verification failed');
  }

  const paymentData = {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  };

  try {
    const updatedOrder = await OrderService.updateOrderToPaid(dbOrderId, paymentData);
    res.json({ message: 'Payment verified successfully', order: updatedOrder });
  } catch (error) {
    res.status(500);
    throw new Error('Failed to update order payment status');
  }
});

module.exports = { addOrderItems, getOrderById, getMyOrders, createRazorpayOrder, verifyRazorpayPayment };

