const Product = require('../models/productModel.js');

class ProductRepository {
  async findAll() {
    return await Product.find({});
  }

  async findById(id) {
    return await Product.findById(id);
  }
  async getTopRated(limit = 1) {
    return await Product.find({}).sort({ rating: -1, numReviews: -1 }).limit(limit);
  }
}

module.exports = new ProductRepository();
