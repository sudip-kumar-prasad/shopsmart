const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, getMyOrders } = require('../controllers/orderController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Todo: add auth protection middleware
router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(getOrderById);

module.exports = router;
