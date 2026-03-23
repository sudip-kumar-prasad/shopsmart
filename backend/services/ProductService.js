const ProductRepository = require('../repositories/ProductRepository.js');

class ProductService {
  async getAllProducts() {
    return await ProductRepository.findAll();
  }

  async getProductById(id) {
    const product = await ProductRepository.findById(id);
    if (!product) {
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }
    return product;
  }
}

module.exports = new ProductService();
