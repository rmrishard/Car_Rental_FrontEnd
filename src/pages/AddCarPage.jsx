import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { createCar } from '../api/car/car';

const AddCarPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    price_per_day: '',
    type: '',
    imageUrl: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const carData = {
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        price_per_day: parseFloat(formData.price_per_day),
        type: formData.type,
        imageUrl: formData.imageUrl || undefined
      };

      await createCar(carData);
      setSuccess(true);
      setFormData({
        make: '',
        model: '',
        year: '',
        price_per_day: '',
        type: '',
        imageUrl: ''
      });
    } catch (err) {
      setError('Failed to create car. Please check all fields and try again.');
      console.error('Error creating car:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/cars-management');
  };

  return (
    <Box sx={{ padding: 3, minHeight: '100vh' }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{ mb: 2 }}
          color="primary"
        >
          Back to Cars Management
        </Button>
        <Typography variant="h4" component="h1">
          Add New Car
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
        >
          Car added successfully!
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Make"
                name="make"
                value={formData.make}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleInputChange}
                inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price Per Day ($)"
                name="price_per_day"
                type="number"
                value={formData.price_per_day}
                onChange={handleInputChange}
                inputProps={{ min: 0, step: 0.01 }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                placeholder="e.g., SUV, Sedan, Hatchback"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="e.g., https://example.com/car-image.jpg"
                helperText="Optional: Enter a URL for the car image"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#28464B'
                    },
                    '&:hover fieldset': {
                      borderColor: '#28464B'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#28464B'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#28464B'
                  },
                  '& .MuiInputBase-input': {
                    color: '#28464B'
                  },
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ minWidth: 120 }}
              color="primary"
            >
              {loading ? <CircularProgress size={24} /> : 'Add Car'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={handleGoBack}
              disabled={loading}
              color="primary"
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddCarPage;