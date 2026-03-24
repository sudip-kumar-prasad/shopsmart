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

  async getTrendingProducts(limit = 1, days = 7) {
    // We need to require OrderRepository dynamically or simply inject it if needed
    // But since require is synchronous in Node, it's fine here to load it inline or at top
    const OrderRepository = require('../repositories/OrderRepository.js');
    let trending = await OrderRepository.getTopSellingProducts(limit, days);
    
    // Fallback if no recent orders exist
    if (!trending || trending.length === 0) {
      trending = await ProductRepository.getTopRated(limit);
    }
    
    return trending;
  }
}

module.exports = new ProductService();
