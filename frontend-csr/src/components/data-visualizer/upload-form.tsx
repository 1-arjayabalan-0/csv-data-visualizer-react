import CardHeader from "../common/card-header";
import { UploadFile, CloudUpload } from "@mui/icons-material";
import { useState, useRef } from "react";
import axios from "axios";
import { csvApi } from "../../services/api";
import { useTabContext } from "../../context/TabContext";
import {
  Button,
  Box,
  Typography,
  CircularProgress,
  Stack,
  Alert,
  Snackbar,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components for file upload
const VisuallyHiddenInput = styled('input')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: 0,
  cursor: 'pointer',
  zIndex: 1,
});

const UploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed',
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'border-color 0.2s ease-in-out',
  minHeight: '200px',
  position: 'relative', // Add relative positioning for the absolute input
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

export const UploadForm = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error' | 'info'}>({ 
    open: false, 
    message: '', 
    severity: 'info' 
  });
  const { setActiveTab, setHasData } = useTabContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Improved file validation function
  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return { isValid: false, error: 'Please upload a CSV file' };
    }
    
    // Optional: Add file size validation (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 10MB' };
    }
    
    return { isValid: true };
  };

  const handleFileSelection = (file: File) => {
    const validation = validateFile(file);
    if (!validation.isValid) {
      setSnackbar({
        open: true,
        message: validation.error || 'Invalid file',
        severity: 'error'
      });
      setSelectedFile(null);
      return;
    }
    
    setSelectedFile(file);
    setSnackbar({
      open: true,
      message: `File "${file.name}" selected`,
      severity: 'success'
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (!files || !files.length) {
        setSelectedFile(null);
        return;
      }

      const file = files[0];
      handleFileSelection(file);
      
      // Reset the input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error handling file selection:', error);
      setSnackbar({
        open: true,
        message: 'Error selecting file',
        severity: 'error'
      });
    }
  };

  // Improved click handler
  const handleBoxClick = (event: React.MouseEvent) => {
    // Prevent event bubbling
    event.preventDefault();
    event.stopPropagation();
    
    if (isUploading) return;
    
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Improved drag handlers with proper event handling
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set dragging to false if we're leaving the drop zone entirely
    // Check if the related target is still within the upload box
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (isUploading) return;
    
    const files = e.dataTransfer.files;
    if (!files || !files.length) {
      setSnackbar({
        open: true,
        message: 'No files detected',
        severity: 'error'
      });
      return;
    }
    
    const file = files[0];
    handleFileSelection(file);
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      setSnackbar({
        open: true,
        message: 'Please select a CSV file first',
        severity: 'error'
      });
      return;
    }

    try {
      setIsUploading(true);
      console.log('Starting upload for file:', selectedFile.name);
      console.log('Making request to /api/csv/upload-csv');

      const response = await csvApi.uploadCsv(selectedFile);
      
      console.log('Upload response:', response.data);

      setSnackbar({
        open: true,
        message: 'File uploaded successfully',
        severity: 'success'
      });

      // Update context to indicate we have data and switch to data table tab
      setHasData(true);
      // Add a small delay before switching tabs to ensure state updates properly
      setTimeout(() => {
        setActiveTab('table');
      }, 100);
      
      // Clear selected file after successful upload
      setSelectedFile(null);
      
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      });
      let errorMessage = 'Failed to upload file';
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Upload timeout - file may be too large';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.status === 413) {
          errorMessage = 'File too large';
        } else if (error.response?.status === 404) {
          errorMessage = 'Upload endpoint not found - check server configuration';
        } else if (error.response?.status >= 500) {
          errorMessage = 'Server error - please try again later';
        }
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        p: 3,
        border: 1,
        borderColor: 'divider',
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <CardHeader
        mainTxt={"Upload CSV File"}
        subTxt={`Upload a CSV file to parse and visualize your data. The file will be
        processed and stored for analysis.`}
      />
      
      <UploadBox 
        onClick={handleBoxClick}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          borderColor: isDragging ? 'primary.main' : undefined,
          backgroundColor: isDragging ? 'rgba(25, 118, 210, 0.04)' : undefined,
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'rgba(25, 118, 210, 0.02)',
          }
        }}
      >
        <CloudUpload 
          sx={{ 
            fontSize: 40, 
            color: isDragging ? 'primary.main' : 'text.secondary', 
            mb: 2 
          }} 
        />
        <Typography variant="h6" color={isDragging ? 'primary.main' : 'inherit'}>
          {isDragging ? 'Drop CSV file here' : 'Drag and drop files here'}
        </Typography>
        <Typography variant="body2" color={isDragging ? 'primary.main' : 'text.secondary'}>
          {isDragging ? 'Release to upload' : 'or click to browse files'}
        </Typography>
        
        {/* Hidden file input */}
        <VisuallyHiddenInput
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </UploadBox>
      
      {selectedFile && (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <UploadFile color="primary" />
          <Typography variant="body2">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
          </Typography>
          <Button 
            size="small" 
            onClick={() => setSelectedFile(null)}
            disabled={isUploading}
          >
            Remove
          </Button>
        </Box>
      )}
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
        sx={{ mt: 2, width: 200 }}
      >
        {isUploading ? 'Uploading...' : 'Upload CSV'}
      </Button>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Supported format: CSV files with comma-separated values
        </Typography>
        <Typography variant="body2" color="text.secondary">
          The first row should contain column headers
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Maximum file size: 10MB
        </Typography>
      </Box>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};