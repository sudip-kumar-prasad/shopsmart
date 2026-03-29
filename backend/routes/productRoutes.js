const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware.js');
const { getProducts, getProductById, getTrending, getDeals, createProductReview } = require('../controllers/productController.js');

router.route('/trending').get(getTrending);
router.route('/deals').get(getDeals);
router.route('/').get(getProducts);
router.route('/:id').get(getProductById);
router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;
