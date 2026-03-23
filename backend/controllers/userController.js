const asyncHandler = require('express-async-handler');
const UserService = require('../services/UserService.js');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const userData = await UserService.login(email, password);
    res.json(userData);
  } catch (error) {
    res.status(error.status || 500);
    throw new Error(error.message);
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userData = await UserService.register(name, email, password);
    res.status(201).json(userData);
  } catch (error) {
    res.status(error.status || 500);
    throw new Error(error.message);
  }
});

module.exports = { authUser, registerUser };
