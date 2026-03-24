const express = require('express');
const router = express.Router();
const { getProducts, getProductById, getTrending } = require('../controllers/productController.js');

router.route('/trending').get(getTrending);
router.route('/').get(getProducts);
router.route('/:id').get(getProductById);

module.exports = router;
