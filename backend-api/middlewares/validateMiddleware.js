import multer from 'multer';
import Joi from 'joi';
import { errorResponse } from '../utils/responseHandler.js';

// Middleware to validate CSV upload request
export const validateCSVUpload = (req, res, next) => {
  // Check if request has the right content type
  if (!req.is('multipart/form-data') && req.method === 'POST') {
    return errorResponse(res, 'Request must be multipart/form-data', null, 400);
  }
  
  // Continue to next middleware
  next();
};

// Authentication input validation schemas
const authSchemas = {
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    }),
    firstName: Joi.string().min(2).max(50).required().messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 50 characters',
      'any.required': 'First name is required'
    }),
    lastName: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name cannot exceed 50 characters',
      'any.required': 'Last name is required'
    })
  }),
  
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  }),
  
  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      'any.required': 'Current password is required'
    }),
    newPassword: Joi.string().min(6).required().messages({
      'string.min': 'New password must be at least 6 characters long',
      'any.required': 'New password is required'
    })
  })
};

// Authentication input validation middleware
export const validateAuthInput = (type) => {
  return (req, res, next) => {
    const schema = authSchemas[type];
    
    if (!schema) {
      return errorResponse(res, 'Invalid validation type', null, 500);
    }
    
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return errorResponse(res, 'Validation failed', errorMessages, 400);
    }
    
    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

// Error handler for multer errors
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return errorResponse(res, 'File size too large. Maximum size is 5MB', null, 400);
    }
    return errorResponse(res, err.message, null, 400);
  }

  if (err) {
    return errorResponse(res, 'Error processing file upload', err.message || null, 400);
  }

  next();
};
