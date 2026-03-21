const mongoose = require('mongoose');

const connectDB = async (retries = 5) => {
  while (retries > 0) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopsmart', {
        serverSelectionTimeoutMS: 5000,
        family: 4 // Force IPv4
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`MongoDB TLS/Connection Error: ${error.message}`);
      retries -= 1;
      if (retries === 0) {
        console.error("All connection retries failed. Exiting...");
        process.exit(1);
      }
      console.log(`Retrying connection... (${retries} attempts left)`);
      // Wait 1.5 seconds before retrying
      await new Promise(res => setTimeout(res, 1500));
    }
  }
};

module.exports = connectDB;
