# CSV Data Visualizer API Documentation

## Overview

The CSV Data Visualizer API is a RESTful service that provides endpoints for user authentication via Google OAuth and CSV file processing with data visualization capabilities.

**Base URL:** `http://localhost:3001`

**API Version:** 1.0.0

## Authentication

The API uses JWT (JSON Web Tokens) for authentication along with Google OAuth 2.0 for user login.

### Authentication Flow

1. User initiates Google OAuth login
2. After successful OAuth, JWT tokens are generated
3. Access token must be included in subsequent API requests
4. Tokens expire after 24 hours (access) and 7 days (refresh)

### Authorization Header

```
Authorization: Bearer <access_token>
```

## Standard Response Format

All API responses follow a consistent structure:

### Success Response
```json
{
  "message": "Operation completed successfully",
  "success": true,
  "data": {}, // Response payload
  "error": null,
  "statusCode": 200
}
```

### Error Response
```json
{
  "message": "Error description",
  "success": false,
  "data": null,
  "error": "Detailed error information",
  "statusCode": 400
}
```

## API Endpoints

### Authentication Endpoints

#### 1. Google OAuth Login

**Endpoint:** `GET /api/auth/google`

**Description:** Initiates Google OAuth authentication flow

**Authentication:** None (Public)

**Parameters:** None

**Response:** Redirects to Google OAuth consent screen

**Example:**
```bash
curl -X GET "http://localhost:3001/api/auth/google"
```

---

#### 2. Google OAuth Callback

**Endpoint:** `GET /api/auth/google/callback`

**Description:** Handles Google OAuth callback and generates JWT tokens

**Authentication:** None (Public)

**Parameters:** 
- `code` (query parameter) - OAuth authorization code from Google
- `state` (query parameter) - OAuth state parameter

**Response:** Redirects to frontend with JWT tokens

**Success Redirect:**
```
http://localhost:3000/auth/callback?token=<access_token>&refresh=<refresh_token>
```

**Error Redirect:**
```
http://localhost:3000/login?error=oauth_error
```

---

#### 3. Get Current User

**Endpoint:** `GET /api/auth/me`

**Description:** Retrieves current authenticated user information

**Authentication:** Required (JWT Token)

**Parameters:** None

**Response:**
```json
{
  "message": "User retrieved successfully",
  "success": true,
  "data": {
    "id": "clxxxxx",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "error": null,
  "statusCode": 200
}
```

**Example:**
```bash
curl -X GET "http://localhost:3001/api/auth/me" \
  -H "Authorization: Bearer <access_token>"
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - User not found

---

### CSV Data Endpoints

#### 4. Upload CSV File

**Endpoint:** `POST /api/csv/upload-csv`

**Description:** Uploads and processes a CSV file

**Authentication:** None (Currently public, but should be protected)

**Content-Type:** `multipart/form-data`

**Parameters:**
- `file` (form-data) - CSV file to upload

**File Requirements:**
- File type: CSV only (`text/csv`)
- Maximum size: 5MB
- File extension: `.csv`

**Response:**
```json
{
  "message": "File processed successfully",
  "success": true,
  "data": {
    "id": "clxxxxx",
    "headers": ["name", "age", "city", "salary"],
    "rowCount": 150,
    "fileName": "employees.csv"
  },
  "error": null,
  "statusCode": 200
}
```

**Example:**
```bash
curl -X POST "http://localhost:3001/api/csv/upload-csv" \
  -F "file=@/path/to/your/file.csv"
```

**Error Responses:**
- `400 Bad Request` - No file uploaded or invalid file type
- `413 Payload Too Large` - File exceeds 5MB limit
- `500 Internal Server Error` - Processing or database error

---

#### 5. Get Latest CSV Data

**Endpoint:** `GET /api/csv/latest-csv-data`

**Description:** Retrieves the most recently uploaded CSV data

**Authentication:** None (Currently public)

**Parameters:** None

**Response:**
```json
{
  "message": "Latest CSV data retrieved successfully",
  "success": true,
  "data": {
    "id": "clxxxxx",
    "headers": ["name", "age", "city", "salary"],
    "data": [
      {
        "name": "John Doe",
        "age": "30",
        "city": "New York",
        "salary": "75000"
      },
      {
        "name": "Jane Smith",
        "age": "28",
        "city": "Los Angeles",
        "salary": "68000"
      }
    ],
    "fileName": "employees.csv",
    "uploadedAt": "2024-01-15T10:30:00.000Z"
  },
  "error": null,
  "statusCode": 200
}
```

**Example:**
```bash
curl -X GET "http://localhost:3001/api/csv/latest-csv-data"
```

**Error Responses:**
- `404 Not Found` - No CSV data found
- `500 Internal Server Error` - Database error

---

### Health Check Endpoint

#### 6. Health Check

**Endpoint:** `GET /health`

**Description:** Checks if the API server is running

**Authentication:** None (Public)

**Parameters:** None

**Response:**
```json
{
  "status": "OK",
  "message": "Backend API server is running"
}
```

**Example:**
```bash
curl -X GET "http://localhost:3001/health"
```

---

## Error Handling

### HTTP Status Codes

- `200 OK` - Request successful
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required or invalid token
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `413 Payload Too Large` - File size exceeds limit
- `500 Internal Server Error` - Server error

### Common Error Scenarios

#### Authentication Errors
```json
{
  "message": "Unauthorized",
  "success": false,
  "data": null,
  "error": "Invalid token",
  "statusCode": 401
}
```

#### File Upload Errors
```json
{
  "message": "Error processing CSV file",
  "success": false,
  "data": null,
  "error": {
    "details": "Only CSV files are allowed",
    "stack": "Error stack trace (development only)"
  },
  "statusCode": 400
}
```

#### Validation Errors
```json
{
  "message": "No file uploaded",
  "success": false,
  "data": null,
  "error": null,
  "statusCode": 400
}
```

---

## Data Models

### User Model
```typescript
interface User {
  id: string;           // Unique identifier (CUID)
  email: string;        // User email (unique)
  firstName?: string;   // User's first name
  lastName?: string;    // User's last name
  googleId?: string;    // Google OAuth ID (unique)
  provider?: string;    // Authentication provider (default: "google")
  createdAt: Date;      // Account creation timestamp
  updatedAt: Date;      // Last update timestamp
}
```

### CSV File Model
```typescript
interface CSVFile {
  id: string;          // Unique identifier (CUID)
  fileName: string;    // Original file name
  rawData: any[];      // Parsed CSV data as JSON array
  columns?: string[];  // Column headers
  uploadedAt: Date;    // Upload timestamp
  userId: string;      // Associated user ID
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use:

- Authentication endpoints: 5 requests per minute
- File upload endpoints: 10 requests per hour
- Data retrieval endpoints: 100 requests per minute

---

## Security Considerations

### Current Implementation
- JWT tokens for authentication
- Google OAuth 2.0 integration
- File type validation (CSV only)
- File size limits (5MB)
- CORS configuration for frontend communication

### Recommendations for Production
1. **Add authentication to CSV endpoints**
2. **Implement rate limiting**
3. **Add request validation middleware**
4. **Use HTTPS in production**
5. **Implement proper logging and monitoring**
6. **Add input sanitization**
7. **Implement file virus scanning**
8. **Add database query optimization**

---

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/csv_visualizer

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# Session
SESSION_SECRET=your-session-secret

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Server
PORT=3001
NODE_ENV=development
```

---

## Testing

### Example Test Scenarios

1. **Authentication Flow Test**
   - Test Google OAuth login
   - Verify JWT token generation
   - Test protected route access

2. **File Upload Test**
   - Upload valid CSV file
   - Test file size limits
   - Test invalid file types

3. **Data Retrieval Test**
   - Fetch latest CSV data
   - Handle empty database
   - Test data format consistency

### Sample Test Data

**Valid CSV File (employees.csv):**
```csv
name,age,city,salary
John Doe,30,New York,75000
Jane Smith,28,Los Angeles,68000
Bob Johnson,35,Chicago,82000
```

---

## Changelog

### Version 1.0.0
- Initial API implementation
- Google OAuth authentication
- CSV file upload and processing
- Data retrieval endpoints
- Error handling middleware
- Response standardization

---

## Support

For technical support or questions about this API:

1. Check the error response for detailed information
2. Verify authentication tokens are valid
3. Ensure file uploads meet the specified requirements
4. Check server logs for detailed error information

---

*Last Updated: January 2024*