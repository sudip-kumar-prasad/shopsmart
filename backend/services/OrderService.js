const OrderRepository = require('../repositories/OrderRepository.js');

class OrderService {
  async createOrder(orderData, userId) {
    if (orderData.orderItems && orderData.orderItems.length === 0) {
      const error = new Error('No order items');
      error.status = 400;
      throw error;
    }

    const newOrderData = {
      ...orderData,
      user: userId,
    };

    return await OrderRepository.create(newOrderData);
  }

  async getOrderById(id) {
    const order = await OrderRepository.findByIdAndPopulateUser(id);
    if (!order) {
      const error = new Error('Order not found');
      error.status = 404;
      throw error;
    }
    return order;
  }

  async updateOrderToPaid(id, paymentData) {
    const order = await this.getOrderById(id);
    
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentMethod = 'razorpay';
    order.razorpayOrderId = paymentData.razorpayOrderId;
    order.razorpayPaymentId = paymentData.razorpayPaymentId;
    order.razorpaySignature = paymentData.razorpaySignature;

    return await order.save();
  }
}

module.exports = new OrderService();
