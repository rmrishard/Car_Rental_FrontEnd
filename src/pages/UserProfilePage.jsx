import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Grid
} from '@mui/material';
import { useGetUserProfile, useUpdateUserProfile, useDeleteUserProfile } from '../api/user/user';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserProfilePage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    user_name: ''
  });
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { data: profileData, isLoading: profileLoading, error: profileError } = useGetUserProfile();
  
  const updateProfileMutation = useUpdateUserProfile({
    mutation: {
      onSuccess: () => {
        setSuccessMessage('Profile updated successfully!');
        setErrorMessage('');
      },
      onError: (error) => {
        console.error('Update profile error:', error);
        setErrorMessage('Failed to update profile. Please try again.');
        setSuccessMessage('');
      }
    }
  });

  const deleteProfileMutation = useDeleteUserProfile({
    mutation: {
      onSuccess: () => {
        setSuccessMessage('Account deleted successfully. You will be logged out.');
        setTimeout(() => {
          logout();
          navigate('/');
        }, 2000);
      },
      onError: (error) => {
        console.error('Delete profile error:', error);
        setErrorMessage('Failed to delete account. Please try again.');
      }
    }
  });

  React.useEffect(() => {
    if (profileData?.data) {
      const userData = profileData.data;
      setFormData({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        user_name: userData.user_name || ''
      });
    }
  }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim() || !formData.user_name.trim()) {
      setErrorMessage('All fields are required.');
      return;
    }

    const updateData = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim(),
      user_name: formData.user_name.trim(),
      role: profileData?.data?.role || 'USER',
      created_at: profileData?.data?.created_at || new Date().toISOString().slice(0, 19)
    };

    updateProfileMutation.mutate({ data: updateData });
  };

  const handleDeleteAccount = () => {
    setDeleteDialogOpen(false);
    deleteProfileMutation.mutate();
  };

  if (profileLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (profileError) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">
          Error loading profile: {profileError.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          My Profile
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleUpdateProfile}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                name="user_name"
                value={formData.user_name}
                onChange={handleInputChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                margin="normal"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={updateProfileMutation.isLoading}
              sx={{ flex: 1 }}
            >
              {updateProfileMutation.isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Update Profile'
              )}
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={deleteProfileMutation.isLoading}
              sx={{ flex: 1 }}
            >
              Delete Account
            </Button>
          </Box>
        </Box>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirm Account Deletion
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone.
            All your data will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={deleteProfileMutation.isLoading}
          >
            {deleteProfileMutation.isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Delete Account'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfilePage;