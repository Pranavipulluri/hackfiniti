const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Adjust path as needed
const asyncHandler = require('./asyncHandler'); // Helper for async routes

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Alternatively, check for token in cookies (if using cookie-based auth)
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    res.status(401); // Not authorized
    throw new Error('Not authorized, no token');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token payload (using the id) and attach to request
    // Exclude password when fetching user
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

// Grant access to specific roles (e.g., admin)
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if req.user exists (added by 'protect' middleware)
    if (!req.user) {
        res.status(401);
        throw new Error('Not authorized to access this route');
    }
    // Check if user is admin (or other specified roles)
    if (!req.user.isAdmin && !roles.includes('user')) { // Example: Check isAdmin flag
      // You might have a roles array on the user model instead:
      // if (!roles.includes(req.user.role)) { ... }
       res.status(403); // Forbidden
       throw new Error(`User role ${req.user.isAdmin ? 'admin' : 'user'} is not authorized to access this route`);
    }
    next();
  };
};


module.exports = { protect, authorize };