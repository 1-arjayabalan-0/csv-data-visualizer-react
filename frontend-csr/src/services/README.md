# API Services Documentation

This directory contains the centralized API configuration and service functions for the frontend CSR application.

## Files Overview

### `api.ts`
Main API configuration file that provides:
- Axios instance with base configuration
- Request/Response interceptors for authentication and error handling
- Typed API endpoints for CSV operations and authentication
- Utility functions for token management

### Usage Examples

#### Basic CSV Operations
```typescript
import { csvApi } from '../services/api';

// Upload a CSV file
const handleUpload = async (file: File) => {
  try {
    const response = await csvApi.uploadCsv(file);
    console.log('Upload successful:', response.data);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

// Get latest CSV data
const fetchLatestData = async () => {
  try {
    const response = await csvApi.getLatestCsvData();
    return response.data.data; // Typed as CSVData
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
};
```

#### Authentication
```typescript
import { authApi, apiUtils } from '../services/api';

// Login
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await authApi.login({ email, password });
    const { tokens } = response.data.data;
    
    // Store token for future requests
    apiUtils.setAuthToken(tokens.accessToken);
    
    return response.data.data.user;
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Check authentication status
if (apiUtils.isAuthenticated()) {
  // User is logged in
}
```

## Configuration

### Environment Variables
The API base URL is configured through environment variables:

```env
# .env file
VITE_API_BASE_URL=http://localhost:3001
VITE_NODE_ENV=development
```

### CSR Considerations
The API configuration is optimized for client-side rendering:
- Uses `import.meta.env.VITE_API_BASE_URL` for environment variables
- Handles localStorage for token management
- Optimized for browser environments

## Features

### Request Interceptors
- Automatically adds authentication tokens to requests
- Adds custom headers (e.g., `X-Client-Type: frontend-csr`)
- Handles localStorage for token storage

### Response Interceptors
- Handles common HTTP errors (401, 403, 500+)
- Automatically clears invalid tokens
- Provides consistent error logging
- Handles timeout and file size errors

### Type Safety
All API functions are fully typed using TypeScript interfaces defined in `../types/api.ts`:
- `ApiResponse<T>` - Standard API response wrapper
- `CSVData` - CSV file and data structure
- `User` - User authentication data
- `ChartData` - Chart configuration and data

## Error Handling

The API service provides comprehensive error handling:

```typescript
try {
  const response = await csvApi.uploadCsv(file);
  // Handle success
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      // Handle unauthorized - token expired
    } else if (error.response?.status === 413) {
      // Handle file too large
    } else if (error.code === 'ECONNABORTED') {
      // Handle timeout
    }
  }
}
```

## Best Practices

1. **Always use the typed API functions** instead of direct axios calls
2. **Handle errors appropriately** in your components
3. **Use the utility functions** for token management
4. **Check authentication status** before making protected requests
5. **Update types** in `../types/api.ts` when API changes

## Migration from Direct Axios

If you're migrating from direct axios calls:

```typescript
// Before (direct axios)
import axios from 'axios';
const response = await axios.post('/api/csv/upload', formData);

// After (using API service)
import { csvApi } from '../services/api';
const response = await csvApi.uploadCsv(file);
```

This provides better:
- Type safety
- Error handling
- Authentication management
- Consistent configuration

## Differences from SSR Client

This CSR implementation differs from the SSR client in:
- No server-side environment handling
- Direct use of `localStorage` without server-side checks
- Optimized for browser-only environments
- Uses `import.meta.env` instead of `process.env`