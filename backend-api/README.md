# CSV Data Visualizer - Backend API

A Node.js/Express REST API for CSV file processing and data visualization with Google OAuth authentication.

## 🚀 Features

- **Google OAuth 2.0 Authentication** - Secure user authentication
- **JWT Token Management** - Access and refresh token handling
- **CSV File Processing** - Upload, parse, and store CSV data
- **Data Visualization Support** - Structured data retrieval for charts
- **Prisma ORM** - Type-safe database operations
- **Standardized API Responses** - Consistent response format
- **File Upload Validation** - Size and type restrictions
- **Error Handling** - Comprehensive error management

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- Google OAuth 2.0 credentials

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd csv-data-visualizer/backend-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/csv_visualizer"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key"
   
   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Server
   PORT=3001
   NODE_ENV=development
   
   # Frontend URL (for OAuth redirects)
   FRONTEND_URL="http://localhost:3000"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
- Development: `http://localhost:3001`
- Production: `https://your-api-domain.com`

### Authentication
The API uses JWT tokens obtained through Google OAuth. Include the token in requests:
```
Authorization: Bearer <your-jwt-token>
```

### Available Endpoints

#### Health Check
- `GET /health` - Server health status

#### Authentication
- `GET /api/auth/google` - Initiate Google OAuth login
- `GET /api/auth/google/callback` - OAuth callback handler
- `GET /api/auth/me` - Get current user info (Protected)

#### CSV Processing
- `POST /api/csv/upload-csv` - Upload CSV file (Protected)
- `GET /api/csv/latest-csv-data` - Get latest CSV data (Protected)

### Response Format
All API responses follow this standardized format:

**Success Response:**
```json
{
  "message": "Operation completed successfully",
  "success": true,
  "data": { /* response data */ },
  "error": null,
  "statusCode": 200
}
```

**Error Response:**
```json
{
  "message": "Error message",
  "success": false,
  "data": null,
  "error": "Detailed error information",
  "statusCode": 400
}
```

## 📖 Detailed API Documentation

For comprehensive API documentation with request/response examples:
- **Markdown Documentation**: See `API_DOCUMENTATION.md`
- **OpenAPI Specification**: See `openapi.yaml`
- **Interactive Docs**: Import `openapi.yaml` into Swagger UI or Postman

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String?
  firstName String?
  lastName  String?
  googleId  String?  @unique
  provider  String   @default("google")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  csvFiles  CSVFile[]
}
```

### CSVFile Model
```prisma
model CSVFile {
  id         String   @id @default(cuid())
  fileName   String
  rawData    Json     @db.JsonB
  columns    Json
  uploadedAt DateTime @default(now())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## 🔧 Development

### Project Structure
```
backend-api/
├── controllers/          # Request handlers
├── middleware/          # Custom middleware
├── routes/             # API routes
├── utils/              # Utility functions
├── prisma/             # Database schema & migrations
├── uploads/            # File upload directory
├── server.js           # Application entry point
└── package.json        # Dependencies & scripts
```

### Available Scripts
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run db:migrate   # Run database migrations
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio
npm test             # Run tests (if configured)
```

### File Upload Configuration
- **Allowed Types**: CSV files only (`.csv`, `text/csv`)
- **Maximum Size**: 5MB
- **Storage**: Local disk storage in `uploads/` directory
- **Validation**: File type and size validation middleware

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Google OAuth 2.0** - Trusted third-party authentication
- **File Type Validation** - Prevents malicious file uploads
- **Size Limits** - Prevents large file attacks
- **CORS Configuration** - Cross-origin request handling
- **Input Validation** - Request data validation
- **Error Sanitization** - Safe error message exposure

## 🚨 Error Handling

The API handles various error scenarios:

- **400 Bad Request** - Invalid input data
- **401 Unauthorized** - Missing or invalid authentication
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **413 Payload Too Large** - File size exceeded
- **500 Internal Server Error** - Server-side errors

## 🧪 Testing

### Manual Testing with cURL

**Health Check:**
```bash
curl http://localhost:3001/health
```

**Upload CSV (requires authentication):**
```bash
curl -X POST \
  -H "Authorization: Bearer <your-token>" \
  -F "file=@sample.csv" \
  http://localhost:3001/api/csv/upload-csv
```

**Get Latest CSV Data:**
```bash
curl -H "Authorization: Bearer <your-token>" \
  http://localhost:3001/api/csv/latest-csv-data
```

## 🔄 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3001
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
JWT_REFRESH_SECRET="your-production-refresh-secret"
GOOGLE_CLIENT_ID="your-production-google-client-id"
GOOGLE_CLIENT_SECRET="your-production-google-client-secret"
FRONTEND_URL="https://your-frontend-domain.com"
```

### Production Checklist
- [ ] Set strong JWT secrets
- [ ] Configure production database
- [ ] Set up Google OAuth for production domain
- [ ] Configure CORS for production frontend
- [ ] Set up SSL/HTTPS
- [ ] Configure file upload limits
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the error logs

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [JWT.io](https://jwt.io/)
- [Multer Documentation](https://github.com/expressjs/multer)