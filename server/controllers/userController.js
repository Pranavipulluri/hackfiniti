const User = require('./models/User');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get user profile by ID
// @route   GET /api/users/profile/:id
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id); // Find by ID from URL param

  if (user) {
    res.json({
        success: true,
        data: user // Send full profile (excluding password by default)
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update own user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  // req.user is set by the 'protect' middleware
  const user = await User.findById(req.user.id);

  if (user) {
    // Update fields based on request body
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.bio = req.body.bio || user.bio;
    user.interests = req.body.interests || user.interests;
    user.languages = req.body.languages || user.languages;
    user.location = req.body.location || user.location;
    user.isHost = req.body.isHost !== undefined ? req.body.isHost : user.isHost;
    user.isExchangee = req.body.isExchangee !== undefined ? req.body.isExchangee : user.isExchangee;
    user.profilePicture = req.body.profilePicture || user.profilePicture; // Handle image uploads separately if needed
    // Add other updatable fields

    // Note: Email and username changes might need separate handling/verification
    // Password changes should go through a dedicated route/controller

    const updatedUser = await user.save(); // Triggers pre-save hook for updatedAt

    res.json({
        success: true,
        data: { // Return updated info, excluding password
             _id: updatedUser._id,
             username: updatedUser.username,
             email: updatedUser.email,
             firstName: updatedUser.firstName,
             lastName: updatedUser.lastName,
             bio: updatedUser.bio,
             interests: updatedUser.interests,
             languages: updatedUser.languages,
             location: updatedUser.location,
             isHost: updatedUser.isHost,
             isExchangee: updatedUser.isExchangee,
             profilePicture: updatedUser.profilePicture,
             isAdmin: updatedUser.isAdmin,
             createdAt: updatedUser.createdAt,
             updatedAt: updatedUser.updatedAt
        }
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users (Basic implementation - needs filtering/pagination for real use)
// @route   GET /api/users
// @access  Private (adjust as needed)
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  // Basic implementation: Fetches all users.
  // TODO: Implement pagination (e.g., using query params ?page=1&limit=10)
  // TODO: Implement filtering based on matching criteria (interests, location, languages, host/exchangee status)
  // TODO: Exclude current logged-in user from results if for matching
  // Example: const users = await User.find({ _id: { $ne: req.user.id } });

  const users = await User.find({}); // Fetch all for now
  res.status(200).json({
      success: true,
      count: users.length,
      data: users
  });
});

// Add other controller functions like deleteUser, getUserMatches etc.