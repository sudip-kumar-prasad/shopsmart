const asyncHandler = require('express-async-handler');
const UserService = require('../services/UserService.js');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const userData = await UserService.login(email, password);
  res.json(userData);
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userData = await UserService.register(name, email, password);
  res.status(201).json(userData);
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await UserService.getProfile(req.user._id);
  res.json(user);
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res, next) => {
  const updatedUser = await UserService.updateUser(req.user._id, req.body);
  res.json(updatedUser);
});

module.exports = { authUser, registerUser, getUserProfile, updateUserProfile };
