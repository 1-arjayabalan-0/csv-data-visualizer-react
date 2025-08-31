import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Alert
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useToaster } from '../ui/toaster';
import { useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { loginWithGoogle } = useAuth();
  const { addToast } = useToaster();
  const location = useLocation();

  // Check for OAuth errors in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const errorParam = urlParams.get('error');
    
    if (errorParam) {
      let errorMessage = 'Authentication failed. Please try again.';
      
      switch (errorParam) {
        case 'oauth_error':
          errorMessage = 'Google authentication failed. Please check your credentials and try again.';
          break;
        case 'access_denied':
          errorMessage = 'Access was denied. Please grant permission to continue.';
          break;
        case 'invalid_request':
          errorMessage = 'Invalid authentication request. Please try again.';
          break;
        default:
          errorMessage = decodeURIComponent(errorParam);
      }
      
      addToast({
        type: 'error',
        title: 'Authentication Error',
        description: errorMessage,
        duration: 6000
      });
      
      // Clear the error from URL
      window.history.replaceState({}, document.title, '/login');
    }
  }, [location.search]);

  const handleGoogleLogin = () => {
    setError('');
    setIsLoading(true);
    try {
      loginWithGoogle();
    } catch (err: any) {
      const errorMessage = 'Google login failed. Please try again.';
      setError(errorMessage);
      addToast({
        type: 'error',
        title: 'Login Error',
        description: errorMessage,
        duration: 5000
      });
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.50',
        p: 2
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Welcome to CSV Data Visualizer
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Sign in with your Google account to get started
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            sx={{
              mb: 2,
              borderColor: '#4285f4',
              color: '#4285f4',
              '&:hover': {
                borderColor: '#3367d6',
                backgroundColor: 'rgba(66, 133, 244, 0.04)'
              }
            }}
            startIcon={
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285f4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34a853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#fbbc05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#ea4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            }
          >
            Continue with Google
          </Button>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            Secure authentication powered by Google
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;