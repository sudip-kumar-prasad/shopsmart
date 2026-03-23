const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel.js');
const Product = require('./models/productModel.js');
const connectDB = require('./config/db.js');

dotenv.config();

connectDB();

const importDummyData = async () => {
  try {
    const adminUser = await User.findOne({ isAdmin: true });
    
    if (!adminUser) {
      console.error('No admin user found. Please ensure users are seeded first.');
      process.exit(1);
    }

    console.log('Fetching products from DummyJSON...');
    const response = await fetch('https://dummyjson.com/products?limit=0');
    const data = await response.json();
    
    console.log(`Fetched ${data.products.length} products total.`);
    
    // Define category mappings
    const electronicsCats = ['smartphones', 'laptops', 'mobile-accessories', 'tablets'];
    const fashionCats = ['womens-dresses', 'womens-shoes', 'mens-shirts', 'mens-shoes', 'mens-watches', 'womens-watches', 'womens-bags', 'womens-jewellery', 'sunglasses', 'tops'];
    const sportsCats = ['sports-accessories'];

    const filteredProducts = data.products.filter(p => 
      electronicsCats.includes(p.category) || 
      fashionCats.includes(p.category) || 
      sportsCats.includes(p.category)
    );

    console.log(`Filtered down to ${filteredProducts.length} Electronics, Fashion, and Sports products. Clearing existing database...`);
    await Product.deleteMany({});
    
    const sampleProducts = filteredProducts.map((p) => {
      // Map back to main categories
      let mainCategory = 'Home';
      if (electronicsCats.includes(p.category)) mainCategory = 'Electronics';
      if (fashionCats.includes(p.category)) mainCategory = 'Fashion';
      if (sportsCats.includes(p.category)) mainCategory = 'Sports';

      return {
        user: adminUser._id,
        name: p.title,
        image: p.images && p.images.length > 0 ? p.images[0] : p.thumbnail, // Use first real image for better quality
        brand: p.brand || mainCategory,
        category: mainCategory,
        description: p.description,
        rating: p.rating,
        numReviews: p.reviews ? p.reviews.length : Math.floor(Math.random() * 50),
        price: p.price,
        countInStock: p.stock
      };
    });

    console.log(`Inserting ${sampleProducts.length} refined products...`);
    await Product.insertMany(sampleProducts);
    
    console.log('DummyJSON Products Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importDummyData();
