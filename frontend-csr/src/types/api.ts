// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  timestamp?: string;
}

// CSV Data Types
export interface CSVData {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  uploadedAt: string;
  processedAt?: string;
  rowCount: number;
  columnCount: number;
  columns: string[];
  data: Record<string, any>[];
  metadata?: {
    delimiter: string;
    encoding: string;
    hasHeader: boolean;
  };
}

// Chart Data Types
export interface ChartData {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'area';
  title: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }[];
  };
  options?: Record<string, any>;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Request Types
export interface UploadCsvRequest {
  file: File;
  options?: {
    delimiter?: string;
    hasHeader?: boolean;
    encoding?: string;
  };
}

export interface GenerateChartRequest {
  fileId: string;
  chartType: 'bar' | 'line' | 'pie' | 'scatter' | 'area';
  xAxis: string;
  yAxis: string | string[];
  title?: string;
  options?: Record<string, any>;
}

// Chart Configuration Types
export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'area';
  xAxis: string;
  yAxis: string | string[];
  title?: string;
  colors?: string[];
  options?: {
    responsive?: boolean;
    maintainAspectRatio?: boolean;
    plugins?: Record<string, any>;
    scales?: Record<string, any>;
  };
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}