# API Testing Guide - CSV Data Visualizer Backend

This guide provides comprehensive instructions for testing the CSV Data Visualizer API endpoints using various tools and methods.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Authentication Flow](#authentication-flow)
4. [Testing Tools](#testing-tools)
5. [Manual Testing with cURL](#manual-testing-with-curl)
6. [Postman Testing](#postman-testing)
7. [Automated Testing](#automated-testing)
8. [Common Test Scenarios](#common-test-scenarios)
9. [Error Testing](#error-testing)
10. [Performance Testing](#performance-testing)

## 🔧 Prerequisites

- Backend API server running on `http://localhost:3001`
- Valid Google OAuth credentials configured
- Test CSV files for upload testing
- API testing tool (cURL, Postman, Insomnia, etc.)

## 🌍 Environment Setup

### Base URL
```
Development: http://localhost:3001
Production: https://your-api-domain.com
```

### Required Headers
```
Content-Type: application/json (for JSON requests)
Authorization: Bearer <jwt-token> (for protected endpoints)
```

## 🔐 Authentication Flow

### Step 1: Initiate Google OAuth
```bash
# Open in browser or use cURL
curl -X GET "http://localhost:3001/api/auth/google"
```

### Step 2: Complete OAuth Flow
1. User is redirected to Google consent screen
2. After consent, Google redirects to callback URL
3. Backend processes callback and redirects to frontend with tokens
4. Extract `access_token` from the redirect URL

### Step 3: Use Access Token
```bash
# Include in Authorization header
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🛠️ Testing Tools

### 1. cURL (Command Line)
- Built-in on most systems
- Great for quick testing and automation
- Examples provided below

### 2. Postman
- GUI-based testing
- Collection management
- Environment variables
- Import the provided `postman_collection.json`

### 3. Insomnia
- Alternative to Postman
- Clean interface
- Good for REST API testing

### 4. HTTPie
- User-friendly command-line tool
- Simpler syntax than cURL

## 📝 Manual Testing with cURL

### Health Check
```bash
# Test server health
curl -X GET "http://localhost:3001/health" \
  -H "Content-Type: application/json"

# Expected Response:
# {
#   "status": "OK",
#   "message": "Backend API server is running"
# }
```

### Authentication Endpoints

#### Get Current User
```bash
# Replace <ACCESS_TOKEN> with your actual token
curl -X GET "http://localhost:3001/api/auth/me" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json"

# Expected Response:
# {
#   "message": "User retrieved successfully",
#   "success": true,
#   "data": {
#     "id": "clxxxxx",
#     "email": "user@example.com",
#     "firstName": "John",
#     "lastName": "Doe",
#     "createdAt": "2024-01-15T10:30:00.000Z",
#     "updatedAt": "2024-01-15T10:30:00.000Z"
#   },
#   "error": null,
#   "statusCode": 200
# }
```

### CSV Processing Endpoints

#### Upload CSV File
```bash
# Upload a CSV file
curl -X POST "http://localhost:3001/api/csv/upload-csv" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -F "file=@/path/to/your/sample.csv"

# Expected Response:
# {
#   "message": "CSV file processed successfully",
#   "success": true,
#   "data": {
#     "id": "clxxxxx",
#     "headers": ["name", "age", "city", "salary"],
#     "rowCount": 150,
#     "fileName": "sample.csv"
#   },
#   "error": null,
#   "statusCode": 200
# }
```

#### Get Latest CSV Data
```bash
# Retrieve latest CSV data
curl -X GET "http://localhost:3001/api/csv/latest-csv-data" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json"

# Expected Response:
# {
#   "message": "Latest CSV data retrieved successfully",
#   "success": true,
#   "data": {
#     "id": "clxxxxx",
#     "headers": ["name", "age", "city", "salary"],
#     "data": [
#       {
#         "name": "John Doe",
#         "age": "30",
#         "city": "New York",
#         "salary": "75000"
#       }
#     ],
#     "fileName": "sample.csv",
#     "uploadedAt": "2024-01-15T10:30:00.000Z"
#   },
#   "error": null,
#   "statusCode": 200
# }
```

## 📮 Postman Testing

### Import Collection
1. Open Postman
2. Click "Import"
3. Select the `postman_collection.json` file
4. Collection will be imported with all endpoints

### Set Environment Variables
1. Create a new environment in Postman
2. Add these variables:
   ```
   base_url: http://localhost:3001
   access_token: (leave empty, will be set after authentication)
   refresh_token: (leave empty, will be set after authentication)
   ```

### Authentication Workflow
1. Run "Google OAuth Login" request (opens browser)
2. Complete OAuth flow in browser
3. Extract tokens from redirect URL
4. Set `access_token` in environment variables
5. Run other requests using the token

## 🤖 Automated Testing

### Jest Test Example
```javascript
// tests/api.test.js
const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {
  let accessToken;

  beforeAll(async () => {
    // Setup: Get access token (mock or real)
    accessToken = 'your-test-token';
  });

  describe('Health Check', () => {
    test('GET /health should return server status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.message).toBe('Backend API server is running');
    });
  });

  describe('Authentication', () => {
    test('GET /api/auth/me should return user info', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('email');
    });

    test('GET /api/auth/me without token should return 401', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('CSV Processing', () => {
    test('POST /api/csv/upload-csv should upload file', async () => {
      const response = await request(app)
        .post('/api/csv/upload-csv')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('file', 'tests/fixtures/sample.csv')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('headers');
      expect(response.body.data).toHaveProperty('rowCount');
    });
  });
});
```

### Running Tests
```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Add test script to package.json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch"
}

# Run tests
npm test
```

## 🧪 Common Test Scenarios

### 1. Happy Path Testing
```bash
# Complete workflow test
# 1. Check health
curl -X GET "http://localhost:3001/health"

# 2. Authenticate (manual OAuth flow)
# 3. Get user info
curl -X GET "http://localhost:3001/api/auth/me" \
  -H "Authorization: Bearer <TOKEN>"

# 4. Upload CSV
curl -X POST "http://localhost:3001/api/csv/upload-csv" \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@sample.csv"

# 5. Get latest data
curl -X GET "http://localhost:3001/api/csv/latest-csv-data" \
  -H "Authorization: Bearer <TOKEN>"
```

### 2. File Upload Variations
```bash
# Test different file types
curl -X POST "http://localhost:3001/api/csv/upload-csv" \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@test.txt"  # Should fail

# Test large files (>5MB)
curl -X POST "http://localhost:3001/api/csv/upload-csv" \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@large-file.csv"  # Should fail with 413

# Test empty upload
curl -X POST "http://localhost:3001/api/csv/upload-csv" \
  -H "Authorization: Bearer <TOKEN>"  # Should fail with 400
```

## ❌ Error Testing

### Authentication Errors
```bash
# Missing token
curl -X GET "http://localhost:3001/api/auth/me"
# Expected: 401 Unauthorized

# Invalid token
curl -X GET "http://localhost:3001/api/auth/me" \
  -H "Authorization: Bearer invalid-token"
# Expected: 401 Unauthorized

# Expired token
curl -X GET "http://localhost:3001/api/auth/me" \
  -H "Authorization: Bearer <EXPIRED_TOKEN>"
# Expected: 401 Unauthorized
```

### File Upload Errors
```bash
# Wrong file type
curl -X POST "http://localhost:3001/api/csv/upload-csv" \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@document.pdf"
# Expected: 400 Bad Request

# File too large
curl -X POST "http://localhost:3001/api/csv/upload-csv" \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@huge-file.csv"
# Expected: 413 Payload Too Large

# No file provided
curl -X POST "http://localhost:3001/api/csv/upload-csv" \
  -H "Authorization: Bearer <TOKEN>"
# Expected: 400 Bad Request
```

### Data Retrieval Errors
```bash
# No data available
# (Test with fresh database or after clearing data)
curl -X GET "http://localhost:3001/api/csv/latest-csv-data" \
  -H "Authorization: Bearer <TOKEN>"
# Expected: 404 Not Found
```

## ⚡ Performance Testing

### Load Testing with Apache Bench
```bash
# Install Apache Bench (ab)
# Ubuntu/Debian: sudo apt-get install apache2-utils
# macOS: brew install httpie

# Test health endpoint
ab -n 1000 -c 10 http://localhost:3001/health

# Test authenticated endpoint (requires token)
ab -n 100 -c 5 -H "Authorization: Bearer <TOKEN>" \
   http://localhost:3001/api/auth/me
```

### Load Testing with Artillery
```bash
# Install Artillery
npm install -g artillery

# Create test configuration (artillery-config.yml)
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Health Check Load Test"
    requests:
      - get:
          url: "/health"

# Run load test
artillery run artillery-config.yml
```

## 📊 Test Data Samples

### Sample CSV Files

#### employees.csv
```csv
name,age,city,salary,department
John Doe,30,New York,75000,Engineering
Jane Smith,28,Los Angeles,68000,Marketing
Bob Johnson,35,Chicago,82000,Engineering
Alice Brown,32,Houston,71000,Sales
Charlie Wilson,29,Phoenix,69000,Marketing
```

#### sales_data.csv
```csv
date,product,quantity,price,region
2024-01-01,Widget A,100,25.99,North
2024-01-02,Widget B,75,35.50,South
2024-01-03,Widget C,150,15.75,East
2024-01-04,Widget A,200,25.99,West
2024-01-05,Widget B,125,35.50,North
```

### Invalid Test Files

#### invalid.txt (Wrong file type)
```
This is not a CSV file.
It should be rejected by the API.
```

#### malformed.csv (Malformed CSV)
```csv
name,age,city
John,30,"New York
Jane,28,Los Angeles",extra
Bob,35
```

## 🔍 Debugging Tips

### Enable Debug Logging
```bash
# Set environment variable
export DEBUG=csv-visualizer:*

# Or in .env file
DEBUG=csv-visualizer:*
LOG_LEVEL=debug
```

### Common Issues

1. **CORS Errors**
   - Check `CORS_ORIGINS` in environment
   - Verify frontend URL configuration

2. **Authentication Issues**
   - Verify Google OAuth credentials
   - Check JWT secret configuration
   - Ensure token is not expired

3. **File Upload Issues**
   - Check file size limits
   - Verify file type validation
   - Ensure uploads directory exists

4. **Database Connection**
   - Verify `DATABASE_URL` is correct
   - Check if database is running
   - Run Prisma migrations

### Useful Commands
```bash
# Check server logs
tail -f logs/app.log

# Test database connection
npx prisma db pull

# Reset database
npx prisma migrate reset

# View database in browser
npx prisma studio
```

## 📋 Testing Checklist

### Pre-Testing Setup
- [ ] Backend server is running
- [ ] Database is connected and migrated
- [ ] Environment variables are configured
- [ ] Google OAuth is set up
- [ ] Test files are prepared

### Functional Testing
- [ ] Health check endpoint works
- [ ] Google OAuth login flow works
- [ ] User authentication works
- [ ] CSV file upload works
- [ ] Data retrieval works
- [ ] Error handling works correctly

### Security Testing
- [ ] Unauthorized access is blocked
- [ ] Invalid tokens are rejected
- [ ] File type validation works
- [ ] File size limits are enforced
- [ ] SQL injection protection

### Performance Testing
- [ ] Response times are acceptable
- [ ] Server handles concurrent requests
- [ ] Memory usage is reasonable
- [ ] File upload performance is good

### Error Handling
- [ ] All error responses follow standard format
- [ ] Appropriate HTTP status codes are used
- [ ] Error messages are helpful but not revealing
- [ ] Server doesn't crash on invalid input

## 📚 Additional Resources

- [Postman Documentation](https://learning.postman.com/docs/)
- [cURL Manual](https://curl.se/docs/manual.html)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Artillery Load Testing](https://artillery.io/docs/)

---

**Happy Testing! 🚀**

For questions or issues, please refer to the main API documentation or create an issue in the repository.