const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const db = require('./config/db.js');
const userRoutes = require('./routes/userRoutes.js');

dotenv.config();

// Connect to database
db();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('ShopSmart API is running...');
});

// Routes
app.use('/api/users', userRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
