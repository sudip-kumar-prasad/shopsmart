const Order = require('../models/orderModel.js');

class OrderRepository {
  async create(orderData) {
    const order = new Order(orderData);
    return await order.save();
  }

  async findByIdAndPopulateUser(id) {
    return await Order.findById(id).populate('user', 'name email');
  }
}

module.exports = new OrderRepository();
