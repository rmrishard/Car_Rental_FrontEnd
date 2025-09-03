import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { getCars, deleteCar } from '../api/car/car';

const CarsManagementPage = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await getCars();
      setCars(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch cars');
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCar = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await deleteCar(carId);
        setCars(cars.filter(car => car.id !== carId));
      } catch (err) {
        setError('Failed to delete car');
        console.error('Error deleting car:', err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'success';
      case 'rented': return 'error';
      case 'maintenance': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mt: 4,
        minHeight: '100vh',
        alignItems: 'center'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Cars Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/add-car')}
          size="large"
          color="primary"
        >
          Add New Car
        </Button>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(3, 1fr)' 
        },
        gap: 3
      }}>
        {cars.map((car) => (
          <Box key={car.id}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h6" component="h2">
                  {car.make} {car.model}
                </Typography>
                <Typography variant="body2" gutterBottom color="text.secondary">
                  Year: {car.year}
                </Typography>
                <Typography variant="body2" gutterBottom color="text.secondary">
                  License Plate: {car.licensePlate}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  ${car.price_per_day}/day
                </Typography>
                <Chip 
                  label={car.status || 'Available'} 
                  color={getStatusColor(car.status)}
                  size="small"
                />
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => navigate(`/car-details/${car.id}`)}
                  title="View Details"
                  color="primary"
                >
                  <ViewIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => navigate(`/edit-car/${car.id}`)}
                  title="Edit Car"
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteCar(car.id)}
                  title="Delete Car"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>

      {cars.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No cars found. Start by adding your first car.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CarsManagementPage;