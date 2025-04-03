const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers, // Potentially for matching or admin
  // deleteUser // Add later if needed
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Add filtering/pagination for matching later)
// @access  Private (Maybe Admin only, or specific logic for matching)
router.get('/', protect, getAllUsers); // Adjust access control as needed

// @route   GET /api/users/profile/:id
// @desc    Get user profile by ID
// @access  Private
router.get('/profile/:id', protect, getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update own user profile
// @access  Private
router.put('/profile', protect, updateUserProfile);

// Add delete route if necessary
// router.delete('/:id', protect, authorize('admin'), deleteUser); // Example Admin-only delete

module.exports = router;