const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const User = require('./models/userModel.js');
const Product = require('./models/productModel.js');
const Order = require('./models/orderModel.js');
const connectDB = require('./config/db.js');

dotenv.config();
connectDB();

const importLargeData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Create a default admin user if none exists
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      isAdmin: true
    });

    const productsPath = path.join(__dirname, '../frontend/src/assets/products.json');
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

    const sampleProducts = productsData.map((product) => {
      // Ensure reviews have the required user field
      const reviews = (product.reviews || []).map(r => ({
        ...r,
        user: adminUser._id
      }));

      return { 
        ...product, 
        user: adminUser._id,
        reviews,
        _id: undefined // Let MongoDB generate new IDs
      };
    });

    await Product.insertMany(sampleProducts);

    console.log('Large Data Set (3000+ items) Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importLargeData();
