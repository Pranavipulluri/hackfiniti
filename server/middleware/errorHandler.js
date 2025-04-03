// Basic error handler
const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || 'Server Error';
  
    // Log the error for debugging (optional)
    console.error(`Error: ${err.message}\nStack: ${err.stack}`);
  
    // Mongoose bad ObjectId Error
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      message = `Resource not found`;
      statusCode = 404;
    }
  
    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      message = `Duplicate field value entered: ${field}`;
      statusCode = 400;
    }
  
    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
      message = Object.values(err.errors).map(val => val.message).join(', ');
      statusCode = 400;
    }
  
     // JWT Errors (add more specific checks if needed)
     if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      message = 'Not authorized, token failed';
      statusCode = 401;
    }
  
  
    res.status(statusCode).json({
      success: false,
      error: message,
      // Optionally include stack trace in development
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  module.exports = errorHandler;