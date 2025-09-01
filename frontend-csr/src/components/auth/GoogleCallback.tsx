import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const GoogleCallback: React.FC = () => {
  const { handleGoogleCallback } = useAuth();

  useEffect(() => {
    console.log('GoogleCallback: Component mounted');
    console.log('GoogleCallback: Current URL:', window.location.href);
    console.log('GoogleCallback: Search params:', window.location.search);
    
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const refreshToken = urlParams.get('refresh');
    const error = urlParams.get('error');

    console.log('GoogleCallback: Extracted parameters:');
    console.log('  - token:', token ? `${token.substring(0, 20)}...` : 'null');
    console.log('  - refreshToken:', refreshToken ? `${refreshToken.substring(0, 20)}...` : 'null');
    console.log('  - error:', error);

    if (error) {
      // Handle OAuth error
      console.error('OAuth error:', error);
      // Redirect to login with error message
      window.location.href = '/login?error=' + encodeURIComponent('Google authentication failed');
      return;
    }

    if (token && refreshToken) {
      console.log('GoogleCallback: Tokens found, calling handleGoogleCallback');
      handleGoogleCallback(token, refreshToken);
      // Don't clear URL parameters immediately - let handleGoogleCallback redirect
    } else {
      console.error('GoogleCallback: Missing tokens - token:', !!token, 'refreshToken:', !!refreshToken);
      // No tokens found, redirect to login
      window.location.href = '/login?error=' + encodeURIComponent('Authentication tokens not found');
    }
  }, [handleGoogleCallback]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.50'
      }}
    >
      <CircularProgress size={60} sx={{ mb: 2 }} />
      <Typography variant="h6" color="text.secondary">
        Completing Google Sign In...
      </Typography>
    </Box>
  );
};

export default GoogleCallback;