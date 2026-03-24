const express = require('express');
const router = express.Router();
const { getProducts, getProductById, getTrending, getDeals } = require('../controllers/productController.js');

router.route('/trending').get(getTrending);
router.route('/deals').get(getDeals);
router.route('/').get(getProducts);
router.route('/:id').get(getProductById);

module.exports = router;
