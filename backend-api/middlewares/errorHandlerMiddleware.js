import { errorResponse } from '../utils/responseHandler.js';

/**
 * Global error handler middleware
 * This middleware catches all errors thrown in the application and formats them using ResponseDto
 */
export const errorHandler = (err, req, res, next) => {
  // If headers already sent, delegate to Express's default error handler
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const details = process.env.NODE_ENV === 'development' ? err.stack : undefined;

  return errorResponse(res, message, details, statusCode);
};

/**
 * Custom error class with status code
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Not found error handler middleware
 * This middleware handles 404 errors for routes that don't exist
 */
export const notFoundHandler = (req, res) => {
  return errorResponse(
    res,
    `Not Found - ${req.originalUrl}`,
    'The requested resource does not exist',
    404
  );
};