import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Grid,
  MenuItem
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { useAddUser } from '../api/user/user';
import { UserRequestRole } from '../api/model/userRequestRole';

const RegisterPage = () => {
  const navigate = useNavigate();
  const addUserMutation = useAddUser();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    user_name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    // First name validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    } else if (formData.first_name.length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters';
    } else if (formData.first_name.length > 100) {
      newErrors.first_name = 'First name must be less than 100 characters';
    }

    // Last name validation
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    // Username validation
    if (!formData.user_name.trim()) {
      newErrors.user_name = 'Username is required';
    } else if (formData.user_name.length < 2) {
      newErrors.user_name = 'Username must be at least 2 characters';
    } else if (formData.user_name.length > 100) {
      newErrors.user_name = 'Username must be less than 100 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      console.log('Starting registration with data:', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        user_name: formData.user_name,
        email: formData.email,
        password: '***',
        role: UserRequestRole.USER,
        created_at: new Date().toISOString().slice(0, 19)
      });

      const result = await addUserMutation.mutateAsync({
        data: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          user_name: formData.user_name,
          email: formData.email,
          password: formData.password,
          role: UserRequestRole.USER, // Default to USER role
          created_at: new Date().toISOString().slice(0, 19) // Format as YYYY-MM-DDTHH:mm:ss
        }
      });

      console.log('Registration successful:', result);

      // Navigate to login page after successful registration
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please sign in with your new account.' 
        }
      });
    } catch (error) {
      console.error('Registration error details:', error);
      console.error('Error response:', error?.response);
      console.error('Error message:', error?.message);
      console.error('Error data:', error?.response?.data);
      // Error is already handled by the mutation
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <AccountCircleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Join our car rental service and start your journey today!
          </Typography>
        </Box>

        {addUserMutation.error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {addUserMutation.error.response?.data?.message || 'Registration failed. Please try again.'}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                error={!!errors.first_name}
                helperText={errors.first_name}
                required
                autoComplete="given-name"
                autoFocus
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                error={!!errors.last_name}
                helperText={errors.last_name}
                required
                autoComplete="family-name"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                error={!!errors.user_name}
                helperText={errors.user_name}
                required
                autoComplete="username"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
                autoComplete="email"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
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
                autoComplete="new-password"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required
                autoComplete="new-password"
              />
            </Grid>


            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                startIcon={addUserMutation.isPending ? <CircularProgress size={20} /> : <PersonAddIcon />}
                disabled={addUserMutation.isPending}
                sx={{ py: 1.5 }}
              >
                {addUserMutation.isPending ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    style={{ 
                      color: 'inherit', 
                      textDecoration: 'none',
                      fontWeight: 'bold'
                    }}
                  >
                    Sign in here
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

export default RegisterPage;