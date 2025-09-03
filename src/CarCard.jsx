import React, { useState } from 'react'
import { Card, CardContent, CardMedia, Typography, Chip, Box, CardActions, Button, TextField, IconButton, Alert, CircularProgress } from '@mui/material'
import { Add, Remove, ShoppingCart, Delete } from '@mui/icons-material'
import { useAddToCart, useRemoveFromCart, useUpdateCartItem, useGetCart, getGetCartQueryKey } from './api/cart/cart'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

function CarCard({ car }) {
  const [days, setDays] = useState(1);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const { data: cartData } = useGetCart({
    query: { enabled: isAuthenticated }
  });
  const addToCartMutation = useAddToCart();
  const removeFromCartMutation = useRemoveFromCart();
  const updateCartMutation = useUpdateCartItem();
  
  // Check if car is in cart
  const cartItem = cartData?.data?.items?.find(item => item.car?.id === car.id);
  const isInCart = !!cartItem;
  
  const handleAddToCart = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          from: window.location.pathname,
          message: 'Please log in to add items to your cart.' 
        }
      });
      return;
    }

    try {
      setError('');
      console.log('Adding to cart:', { carId: car.id, days });
      const result = await addToCartMutation.mutateAsync({
        data: { carId: car.id, days }
      });
      console.log('Add to cart success:', result);
      // Invalidate cart query to refetch data
      queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
    } catch (err) {
      console.error('Add to cart error details:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      setError(`Failed to add to cart: ${err.response?.data?.message || err.message}`);
    }
  };
  
  const handleRemoveFromCart = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          from: window.location.pathname,
          message: 'Please log in to manage your cart.' 
        }
      });
      return;
    }

    try {
      setError('');
      await removeFromCartMutation.mutateAsync({
        carId: car.id
      });
      // Invalidate cart query to refetch data
      queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
    } catch (err) {
      setError('Failed to remove from cart');
      console.error('Remove from cart error:', err);
    }
  };
  
  const handleUpdateDays = async (newDays) => {
    if (newDays <= 0) {
      handleRemoveFromCart();
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          from: window.location.pathname,
          message: 'Please log in to manage your cart.' 
        }
      });
      return;
    }

    try {
      setError('');
      await updateCartMutation.mutateAsync({
        carId: car.id,
        data: { days: newDays }
      });
      // Invalidate cart query to refetch data
      queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
    } catch (err) {
      setError('Failed to update cart');
      console.error('Update cart error:', err);
    }
  };

  const handleImageClick = () => {
    navigate(`/car-details/${car.id}`);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={car.imageUrl || '/placeholder-car.jpg'}
        alt={`${car.make} ${car.model}`}
        onClick={handleImageClick}
        sx={{
          objectFit: 'cover',
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.8
          }
        }}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <CardMedia
        component="div"
        onClick={handleImageClick}
        sx={{
          height: 200,
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.8
          }
        }}
      >
        <Typography variant="h6">
          {car.make} {car.model}
        </Typography>
      </CardMedia>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2">
          {car.make} {car.model}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Year: {car.year}
        </Typography>
        {car.type && (
          <Chip 
            label={car.type} 
            size="small" 
            sx={{ marginBottom: 1 }}
            color="primary"
          />
        )}
        <Box sx={{ marginTop: 'auto', paddingTop: 2 }}>
          <Typography variant="h6" color="primary">
            ${car.price_per_day}/day
          </Typography>
        </Box>
      </CardContent>
      
      {error && (
        <Alert severity="error" sx={{ m: 1 }}>
          {error}
        </Alert>
      )}
      
      <CardActions sx={{ padding: 2, paddingTop: 0 }}>
        {!isInCart ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
            <TextField
              type="number"
              label="Days"
              value={days}
              onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
              size="small"
              sx={{ width: 80 }}
              inputProps={{ min: 1 }}
            />
            <Button
              variant="contained"
              startIcon={addToCartMutation.isPending ? <CircularProgress size={16} /> : <ShoppingCart />}
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending}
              fullWidth
              color="primary"
            >
              Add to Cart
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
            <IconButton
              onClick={() => handleUpdateDays((cartItem?.days || 1) - 1)}
              disabled={updateCartMutation.isPending}
              size="small"
              color="primary"
            >
              <Remove />
            </IconButton>
            <Typography sx={{ minWidth: 40, textAlign: 'center' }}>
              {cartItem?.days || 1}
            </Typography>
            <IconButton
              onClick={() => handleUpdateDays((cartItem?.days || 1) + 1)}
              disabled={updateCartMutation.isPending}
              size="small"
              color="primary"
            >
              <Add />
            </IconButton>
            <Button
              variant="outlined"
              startIcon={removeFromCartMutation.isPending ? <CircularProgress size={16} /> : <Delete />}
              onClick={handleRemoveFromCart}
              disabled={removeFromCartMutation.isPending}
              sx={{ ml: 1 }}
              color="error"
            >
              Remove
            </Button>
          </Box>
        )}
      </CardActions>
    </Card>
  )
}

export default CarCard