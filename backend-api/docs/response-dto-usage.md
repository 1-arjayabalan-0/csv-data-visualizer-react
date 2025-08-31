# Response DTO Usage Guide

This guide explains how to use the `ResponseDto` class for consistent API responses across the application.

## Overview

The `ResponseDto` class provides a standardized structure for all API responses, ensuring consistency across the application. The standard response format is:

```json
{
  "message": "Response message",
  "success": true|false,
  "data": {...} | null,
  "error": "Error details" | null,
  "statusCode": 200|400|etc
}
```

## Usage Methods

There are two ways to use the ResponseDto:

### 1. Using the ResponseHandler Utility (Recommended)

The `responseHandler.js` utility provides wrapper functions that use the ResponseDto internally:

```javascript
import { successResponse, errorResponse } from '../utils/responseHandler.js';

export const getUsers = async (req, res) => {
  try {
    const users = await userService.getAll();
    return successResponse(res, 'Users retrieved successfully', users);
  } catch (error) {
    return errorResponse(res, 'Failed to retrieve users', error.message, 500);
  }
};
```

### 2. Using ResponseDto Directly

You can also use the ResponseDto class directly:

```javascript
import { ResponseDto } from '../dtos/response.dto.js';

export const getProducts = async (req, res) => {
  try {
    const products = await productService.getAll();
    const response = ResponseDto.success('Products retrieved successfully', products);
    return res.status(200).json(response);
  } catch (error) {
    const response = ResponseDto.error('Failed to retrieve products', error.message, 500);
    return res.status(500).json(response);
  }
};
```

## ResponseDto Methods

### Static Methods

#### `ResponseDto.success(message, data = null, statusCode = 200)`
Creates a successful response object.

**Parameters:**
- `message` (string): Success message
- `data` (any, optional): Response data
- `statusCode` (number, optional): HTTP status code (default: 200)

**Example:**
```javascript
const response = ResponseDto.success('Data retrieved successfully', userData);
```

#### `ResponseDto.error(message, error = null, statusCode = 400)`
Creates an error response object.

**Parameters:**
- `message` (string): Error message
- `error` (string, optional): Detailed error information
- `statusCode` (number, optional): HTTP status code (default: 400)

**Example:**
```javascript
const response = ResponseDto.error('Validation failed', 'Email is required', 400);
```

## ResponseHandler Utility Functions

### `successResponse(res, message, data = null, statusCode = 200)`
Sends a successful response using Express response object.

### `errorResponse(res, message, error = null, statusCode = 400)`
Sends an error response using Express response object.

## Best Practices

1. **Use ResponseHandler for Controllers**: Always use the responseHandler utility functions in your controllers for consistency.

2. **Meaningful Messages**: Provide clear, user-friendly messages that describe what happened.

3. **Appropriate Status Codes**: Use proper HTTP status codes:
   - 200: Success
   - 201: Created
   - 400: Bad Request
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not Found
   - 500: Internal Server Error

4. **Error Details**: Include helpful error details for debugging, but avoid exposing sensitive information.

## Examples

### Authentication Controller
```javascript
import { successResponse, errorResponse } from '../utils/responseHandler.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return successResponse(res, 'Login successful', result);
  } catch (error) {
    return errorResponse(res, 'Login failed', error.message, 401);
  }
};
```

### Data Visualizer Controller
```javascript
import { successResponse, errorResponse } from '../utils/responseHandler.js';

export const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 'CSV file is required', 400);
    }
    
    const result = await csvService.processFile(req.file);
    return successResponse(res, 'CSV uploaded and processed successfully', result, 201);
  } catch (error) {
    return errorResponse(res, 'Failed to process CSV', error.message, 500);
  }
};
```