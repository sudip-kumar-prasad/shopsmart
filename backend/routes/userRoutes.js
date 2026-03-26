const express = require('express');
const router = express.Router();
const passport = require('passport');
const { authUser, registerUser, getUserProfile, updateUserProfile } = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');
const generateToken = require('../utils/generateToken.js');

router.route('/').post(registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

// Google OAuth Routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
  (req, res) => {
    // Generate JWT for the authenticated user
    const token = generateToken(req.user._id);
    const userData = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      token,
    };
    // Redirect frontend with user data encoded in URL
    const encoded = encodeURIComponent(JSON.stringify(userData));
    res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?user=${encoded}`);
  }
);

module.exports = router;
