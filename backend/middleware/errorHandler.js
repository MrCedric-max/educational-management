const { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');

// Custom error classes
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

class CustomValidationError extends AppError {
  constructor(message, details = []) {
    super(message, 400);
    this.details = details;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429);
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Sequelize validation error
  if (err instanceof ValidationError) {
    const message = err.errors.map(e => e.message).join(', ');
    error = new ValidationError(message, err.errors);
  }

  // Sequelize unique constraint error
  if (err instanceof UniqueConstraintError) {
    const field = err.errors[0].path;
    const message = `${field} already exists`;
    error = new ConflictError(message);
  }

  // Sequelize foreign key constraint error
  if (err instanceof ForeignKeyConstraintError) {
    const message = 'Referenced resource does not exist';
    error = new ValidationError(message);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AuthenticationError('Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = new AuthenticationError('Token expired');
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new ValidationError('File too large');
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = new ValidationError('Unexpected field');
  }

  // Rate limit errors
  if (err.status === 429) {
    error = new RateLimitError(err.message);
  }

  // Default to 500 server error
  if (!error.statusCode) {
    error = new AppError('Internal server error', 500, false);
  }

  // Send error response
  const response = {
    success: false,
    error: error.message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: error.details
    })
  };

  // Add retry-after header for rate limit errors
  if (error.statusCode === 429) {
    res.setHeader('Retry-After', 60);
  }

  res.status(error.statusCode).json(response);
};

// 404 handler
const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Global error handler for unhandled rejections
const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (err, promise) => {
    console.error('Unhandled Promise Rejection:', err);
    // Close server gracefully
    process.exit(1);
  });
};

// Global error handler for uncaught exceptions
const handleUncaughtException = () => {
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Close server gracefully
    process.exit(1);
  });
};

module.exports = {
  AppError,
  ValidationError: CustomValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  errorHandler,
  notFoundHandler,
  asyncHandler,
  handleUnhandledRejection,
  handleUncaughtException
};
