const Order = require('../models/orderModel.js');

class OrderRepository {
  async create(orderData) {
    const order = new Order(orderData);
    return await order.save();
  }

  async findByIdAndPopulateUser(id) {
    return await Order.findById(id).populate('user', 'name email');
  }
  async getTopSellingProducts(limit = 1, days = 7) {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - days);

    return await Order.aggregate([
      // Match orders created in the last X days 
      { $match: { createdAt: { $gte: pastDate } } },
      
      // Flatten the orderItems array so each item is a separate document
      { $unwind: '$orderItems' },
      
      // Group by productId and sum the quantities bought
      {
        $group: {
          _id: '$orderItems.product',
          totalQtySold: { $sum: '$orderItems.qty' }
        }
      },
      
      // Sort by the sum in descending order (highest sold first)
      { $sort: { totalQtySold: -1 } },
      
      // Limit to top results
      { $limit: limit },
      
      // Join the products collection to get product details
      {
        $lookup: {
          from: 'products', // matches MongoDB collection name explicitly
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      
      // Unwind the joined array to get an object instead of array
      { $unwind: '$productDetails' },
      
      // Push specific properties to root
      {
        $project: {
          _id: '$productDetails._id',
          name: '$productDetails.name',
          image: '$productDetails.image',
          brand: '$productDetails.brand',
          category: '$productDetails.category',
          price: '$productDetails.price',
          rating: '$productDetails.rating',
          numReviews: '$productDetails.numReviews',
          totalQtySold: 1
        }
      }
    ]);
  }
}

module.exports = new OrderRepository();
