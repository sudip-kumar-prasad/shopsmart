const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, getMyOrders, createRazorpayOrder, verifyRazorpayPayment } = require('../controllers/orderController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Todo: add auth protection middleware
router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/razorpay/create-order').post(protect, createRazorpayOrder);
router.route('/razorpay/verify').post(protect, verifyRazorpayPayment);
router.route('/:id').get(protect, getOrderById);

module.exports = router;
