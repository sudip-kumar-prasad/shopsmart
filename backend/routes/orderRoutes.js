const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById } = require('../controllers/orderController.js');

// Todo: add auth protection middleware
router.route('/').post(addOrderItems);
router.route('/:id').get(getOrderById);

module.exports = router;
