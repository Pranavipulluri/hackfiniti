const express = require('express');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
// Optional: Add validation middleware
// const { check } = require('express-validator');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', /* Add validation checks here if using express-validator */ registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', /* Add validation checks here */ loginUser);

// @route   GET /api/auth/me
// @desc    Get current logged-in user details
// @access  Private
router.get('/me', protect, getMe);

module.exports = router;