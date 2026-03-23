const Product = require('../models/productModel.js');

class ProductRepository {
  async findAll() {
    return await Product.find({});
  }

  async findById(id) {
    return await Product.findById(id);
  }
}

module.exports = new ProductRepository();
