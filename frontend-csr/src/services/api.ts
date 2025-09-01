import axios, { AxiosResponse } from 'axios';
import type {
  ApiResponse,
  CSVData,
  ChartData,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  User,
  ChartConfig
} from '../types';

// Get base URL from environment or default to localhost
const getBaseURL = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding authentication and other headers
api.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add any other custom headers here
    config.headers['X-Client-Type'] = 'frontend-csr';
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - redirecting to login');
      // Clear token if it exists
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // Optionally redirect to login page
      // window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Handle forbidden access
      console.error('Forbidden access');
    } else if (error.response?.status >= 500) {
      // Handle server errors
      console.error('Server error:', error.response?.data || error.message);
    } else if (error.code === 'ECONNABORTED') {
      // Handle timeout errors
      console.error('Request timeout');
    } else if (error.response?.status === 413) {
      // Handle file too large errors
      console.error('File too large');
    }
    return Promise.reject(error);
  }
);

// CSV API endpoints
export const csvApi = {
  // Upload CSV file
  uploadCsv: (file: File): Promise<AxiosResponse<ApiResponse<CSVData>>> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/csv/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get latest CSV data
  getLatestCsvData: (): Promise<AxiosResponse<ApiResponse<CSVData>>> => {
    return api.get('/csv/latest-csv-data');
  },

  // Get processed CSV data by ID
  getCsvData: (fileId: string): Promise<AxiosResponse<ApiResponse<CSVData>>> => {
    return api.get(`/csv/data/${fileId}`);
  },

  // Get chart data
  getChartData: (fileId: string, chartType: string): Promise<AxiosResponse<ApiResponse<ChartData>>> => {
    return api.get(`/csv/chart/${fileId}`, {
      params: { type: chartType }
    });
  },

  // Generate chart from CSV data
  generateChart: (fileId: string, config: ChartConfig): Promise<AxiosResponse<ApiResponse<ChartData>>> => {
    return api.post(`/csv/chart/${fileId}`, config);
  },

  // Delete CSV file
  deleteCsv: (fileId: string): Promise<AxiosResponse<ApiResponse<void>>> => {
    return api.delete(`/csv/${fileId}`);
  },

  // Health check
  healthCheck: (): Promise<AxiosResponse<ApiResponse<{ status: string; message: string }>>> => {
    return api.get('/health');
  },
};

// Authentication API endpoints
export const authApi = {
  // Login
  login: (credentials: LoginRequest): Promise<AxiosResponse<ApiResponse<LoginResponse>>> => {
    return api.post('/auth/login', credentials);
  },

  // Register
  register: (userData: RegisterRequest): Promise<AxiosResponse<ApiResponse<LoginResponse>>> => {
    return api.post('/auth/register', userData);
  },

  // Logout
  logout: (): Promise<AxiosResponse<ApiResponse<void>>> => {
    return api.post('/auth/logout');
  },

  // Get current user
  getCurrentUser: (): Promise<AxiosResponse<ApiResponse<User>>> => {
    return api.get('/auth/me');
  },

  // Refresh token
  refreshToken: (): Promise<AxiosResponse<ApiResponse<{ accessToken: string }>>> => {
    return api.post('/auth/refresh');
  },
};

// Utility functions
export const apiUtils = {
  // Set authentication token
  setAuthToken: (token: string) => {
    localStorage.setItem('accessToken', token);
  },

  // Clear authentication token
  clearAuthToken: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  // Get authentication token
  getAuthToken: () => {
    return localStorage.getItem('accessToken');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!apiUtils.getAuthToken();
  },
};

export default api;