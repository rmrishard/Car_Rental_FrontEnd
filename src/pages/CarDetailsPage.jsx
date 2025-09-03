import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  DirectionsCar as CarIcon
} from '@mui/icons-material';
import { useGetCar } from '../api/car/car';
import { useAuth } from '../context/AuthContext';

const CarDetailsPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { data: carResponse, isLoading, error } = useGetCar(parseInt(carId));
  const { isAdmin } = useAuth();

  const car = carResponse?.data;

  const handleGoBack = () => {
    navigate('/');
  };

  const handleEdit = () => {
    navigate(`/edit-car/${carId}`);
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load car details. Please try again.
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            color="primary"
          >
            Back to Cars
          </Button>
        </Box>
      </Container>
    );
  }

  if (!car) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Car not found.
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            color="primary"
          >
            Back to Cars
          </Button>
        </Box>
      </Container>
    );
  }


  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          color="primary"
        >
          Back to Cars
        </Button>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            color="primary"
          >
            Edit Car
          </Button>
        )}
      </Box>

      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <CarIcon sx={{ fontSize: 40, mr: 2, color: '#28464B' }} />
            <Typography variant="h4" component="h1" sx={{ color: '#28464B' }}>
              {car.make} {car.model}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Make
                </Typography>
                <Typography variant="h6">
                  {car.make}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Model
                </Typography>
                <Typography variant="h6">
                  {car.model}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Year
                </Typography>
                <Typography variant="h6">
                  {car.year}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Details & Pricing
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Price Per Day
                </Typography>
                <Typography variant="h6">
                  ${car.price_per_day || 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Type
                </Typography>
                <Typography variant="h6">
                  {car.type || 'Not specified'}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={handleGoBack}
              color="primary"
            >
              Back
            </Button>
            {isAdmin && (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
                color="primary"
              >
                Edit Car
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CarDetailsPage;