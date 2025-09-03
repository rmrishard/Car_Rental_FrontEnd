import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
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
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useGetCar, useUpdateCar } from '../api/car/car';

const EditCarPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  
  
  const { data: carResponse, isLoading: loadingCar, error: loadError } = useGetCar(parseInt(carId), {
    query: { enabled: !!carId }
  });
  const updateCarMutation = useUpdateCar();

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    price_per_day: '',
    type: '',
    imageUrl: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (carResponse?.data) {
      const car = carResponse.data;
      setFormData({
        make: car.make || '',
        model: car.model || '',
        year: car.year || '',
        price_per_day: car.price_per_day || '',
        type: car.type || '',
        imageUrl: car.imageUrl || ''
      });
    }
  }, [carResponse]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.make.trim()) newErrors.make = 'Make is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.year.trim()) newErrors.year = 'Year is required';

    const year = parseInt(formData.year);
    if (formData.year && (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1)) {
      newErrors.year = 'Please enter a valid year';
    }

    const pricePerDay = parseFloat(formData.price_per_day);
    if (formData.price_per_day && (isNaN(pricePerDay) || pricePerDay < 0)) {
      newErrors.price_per_day = 'Please enter a valid price per day';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const updateData = {
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year) || undefined,
        price_per_day: parseFloat(formData.price_per_day) || undefined,
        type: formData.type,
        imageUrl: formData.imageUrl || undefined
      };

      await updateCarMutation.mutateAsync({
        carId: parseInt(carId),
        data: updateData
      });

      navigate(`/car-details/${carId}`);
    } catch (error) {
      console.error('Error updating car:', error);
    }
  };

  const handleGoBack = () => {
    navigate(`/car-details/${carId}`);
  };

  if (loadingCar) {
    return (
      <Container maxWidth="md" sx={{ 
        mt: 4, 
        display: 'flex', 
        justifyContent: 'center',
        minHeight: '100vh',
        alignItems: 'center'
      }}>
        <CircularProgress />
      </Container>
    );
  }

  if (loadError) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, minHeight: '100vh' }}>
        <Alert 
          severity="error"
        >
          Failed to load car details. Please try again.
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/cars-management')}
            color="primary"
          >
            Back to Cars Management
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4, minHeight: '100vh' }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          color="primary"
        >
          Back to Car Details
        </Button>
        <Typography variant="h4" component="h1">
          Edit Car
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        {updateCarMutation.error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
          >
            Failed to update car. Please try again.
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Make"
                name="make"
                value={formData.make}
                onChange={handleChange}
                error={!!errors.make}
                helperText={errors.make}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                error={!!errors.model}
                helperText={errors.model}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                error={!!errors.year}
                helperText={errors.year}
                required
                InputProps={{
                  inputProps: { min: 1900, max: new Date().getFullYear() + 1 }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price Per Day ($)"
                name="price_per_day"
                type="number"
                value={formData.price_per_day}
                onChange={handleChange}
                error={!!errors.price_per_day}
                helperText={errors.price_per_day}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="e.g., SUV, Sedan, Hatchback"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="e.g., https://example.com/car-image.jpg"
                helperText="Optional: Enter a URL for the car image"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleGoBack}
                  disabled={updateCarMutation.isLoading}
                  color="primary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={updateCarMutation.isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={updateCarMutation.isLoading}
                  color="primary"
                >
                  {updateCarMutation.isLoading ? 'Updating...' : 'Update Car'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditCarPage;