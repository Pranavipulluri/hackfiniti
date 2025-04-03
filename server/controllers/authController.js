const User = require('./models/User');
const asyncHandler = require('../middleware/asyncHandler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expiration time
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password, firstName, lastName, isHost, isExchangee, interests, languages, location, bio } = req.body;

  // Basic Validation (Consider using express-validator for robust validation)
  if (!username || !email || !password) {
      res.status(400);
      throw new Error('Please provide username, email, and password');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }
  const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      res.status(400);
      throw new Error('Username is already taken');
    }


  // Create user
  const user = await User.create({
    username,
    email,
    password, // Password will be hashed by the pre-save hook in User model
    firstName,
    lastName,
    isHost,
    isExchangee,
    interests,
    languages,
    location,
    bio
    // Add other fields as needed
  });

  if (user) {
    // Generate token
    const token = generateToken(user._id);

    // Respond with token and user info (excluding password)
    res.status(201).json({
      success: true,
      token,
      user: { // Send back user details needed by the frontend
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        // Add other relevant fields
      }
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Basic Validation
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Find user by email, explicitly select password
  const user = await User.findOne({ email }).select('+password');

  // Check if user exists and password matches
  if (user && (await user.matchPassword(password))) {
     // Generate token
     const token = generateToken(user._id);

     // Respond with token and user info (excluding password)
     res.status(200).json({
       success: true,
       token,
       user: {
         _id: user._id,
         username: user.username,
         email: user.email,
         firstName: user.firstName,
         lastName: user.lastName,
         isAdmin: user.isAdmin,
         // Add other relevant fields
       }
     });
  } else {
    res.status(401); // Unauthorized
    throw new Error('Invalid credentials');
  }
});

// @desc    Get current logged-in user details
// @route   GET /api/auth/me
// @access  Private (requires token)
exports.getMe = asyncHandler(async (req, res, next) => {
  // User is already attached to req by the 'protect' middleware
  // We fetched user excluding password in the middleware
  const user = await User.findById(req.user.id); // Re-fetch if you need latest data or specific population

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});