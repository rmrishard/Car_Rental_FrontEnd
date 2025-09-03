import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import {
  Login as LoginIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useLogin } from '../api/authentication/authentication';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();
  const { login: authLogin } = useAuth();
  
  // Get redirect information from state
  const from = location.state?.from || '/';
  const redirectMessage = location.state?.message;

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      console.log('Starting login with username:', formData.username);

      const response = await loginMutation.mutateAsync({
        data: {
          username: formData.username,
          password: formData.password
        }
      });

      console.log('Login response:', response);

      // Use AuthContext to handle login
      if (response.data?.token) {
        const userData = {
          user_name: response.data.username || formData.username,
          userId: response.data.userId,
          role: response.data.role,
          // Add other user data from response if available
          ...response.data.user
        };
        console.log('User data for auth context:', userData);
        authLogin(userData, response.data.token);
      }

      // Navigate back to the previous page or home page
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error details:', error);
      console.error('Error response:', error?.response);
      console.error('Error message:', error?.message);
      console.error('Error data:', error?.response?.data);
      // Error is already handled by the mutation
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <PersonIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Sign In
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Welcome back! Please sign in to your account.
          </Typography>
        </Box>

        {redirectMessage && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {redirectMessage}
          </Alert>
        )}

        {loginMutation.error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {loginMutation.error.response?.data?.message || 'Login failed. Please check your credentials and try again.'}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                required
                autoComplete="username"
                autoFocus
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                required
                autoComplete="current-password"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                startIcon={loginMutation.isPending ? <CircularProgress size={20} /> : <LoginIcon />}
                disabled={loginMutation.isPending}
                sx={{ py: 1.5 }}
              >
                {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    style={{ 
                      color: 'inherit', 
                      textDecoration: 'none',
                      fontWeight: 'bold'
                    }}
                  >
                    Sign up here
                  </Link>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;