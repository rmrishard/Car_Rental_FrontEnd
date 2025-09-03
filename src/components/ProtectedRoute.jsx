import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Alert, Button } from '@mui/material';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show loading while checking authentication status
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        Loading...
      </Container>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with current location
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location.pathname,
          message: 'Please log in to access this page.' 
        }} 
        replace 
      />
    );
  }

  if (adminOnly && !isAdmin) {
    // Access denied for non-admin users trying to access admin pages
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <strong>Access Denied</strong><br />
          You need administrator privileges to access this page.
        </Alert>
        <Button 
          variant="outlined" 
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return children;
};

export default ProtectedRoute;