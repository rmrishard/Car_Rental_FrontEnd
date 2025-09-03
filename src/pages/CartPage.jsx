import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Alert,
  CircularProgress,
  Grid,
  Divider,
  CardMedia
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useGetCart, useUpdateCartItem, useRemoveFromCart, useClearCart, getGetCartQueryKey } from '../api/cart/cart';
import { useQueryClient } from '@tanstack/react-query';

const CartPage = () => {
  const queryClient = useQueryClient();
  const { data: cartData, isLoading, error } = useGetCart();
  const updateCartMutation = useUpdateCartItem();
  const removeFromCartMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();

  const cartItems = cartData?.data?.items || [];
  const totalAmount = cartData?.data?.totalAmount || 0;

  const handleUpdateDays = async (carId, newDays) => {
    if (newDays <= 0) {
      await removeFromCartMutation.mutateAsync({ carId });
      queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      return;
    }
    try {
      await updateCartMutation.mutateAsync({
        carId,
        data: { days: newDays }
      });
      queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
    } catch (err) {
      console.error('Update cart error:', err);
    }
  };

  const handleRemoveItem = async (carId) => {
    try {
      await removeFromCartMutation.mutateAsync({ carId });
      queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
    } catch (err) {
      console.error('Remove from cart error:', err);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      try {
        await clearCartMutation.mutateAsync();
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      } catch (err) {
        console.error('Clear cart error:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 3 }}>
        <Alert severity="error">Failed to load cart</Alert>
      </Box>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Box sx={{ padding: 3, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="h4" gutterBottom>Your Cart is Empty</Typography>
        <Typography variant="body1" color="text.secondary">
          Add some cars to your cart to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Your Cart ({cartItems.length} items)
        </Typography>
        <Button 
          variant="outlined" 
          onClick={handleClearCart}
          disabled={clearCartMutation.isPending}
          color="error"
        >
          Clear Cart
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {cartItems.map((item) => (
            <Card key={item.cartItemId} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 200, height: 150, objectFit: 'cover' }}
                  image={item.car?.imageUrl || '/placeholder-car.jpg'}
                  alt={`${item.car?.make} ${item.car?.model}`}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {item.car?.make} {item.car?.model}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Year: {item.car?.year} | Type: {item.car?.type}
                  </Typography>
                  <Typography variant="body1" color="primary" gutterBottom>
                    ${item.dailyRate}/day
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Subtotal: ${item.subtotal?.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ flexDirection: 'column', justifyContent: 'center', p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <IconButton
                      onClick={() => handleUpdateDays(item.car?.id, (item.days || 1) - 1)}
                      disabled={updateCartMutation.isPending}
                      size="small"
                    >
                      <Remove />
                    </IconButton>
                    <Typography sx={{ minWidth: 40, textAlign: 'center' }}>
                      {item.days} days
                    </Typography>
                    <IconButton
                      onClick={() => handleUpdateDays(item.car?.id, (item.days || 1) + 1)}
                      disabled={updateCartMutation.isPending}
                      size="small"
                    >
                      <Add />
                    </IconButton>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Delete />}
                    onClick={() => handleRemoveItem(item.car?.id)}
                    disabled={removeFromCartMutation.isPending}
                    color="error"
                  >
                    Remove
                  </Button>
                </CardActions>
              </Box>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              {cartItems.map((item) => (
                <Box key={item.cartItemId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    {item.car?.make} {item.car?.model} × {item.days}
                  </Typography>
                  <Typography variant="body2">
                    ${item.subtotal?.toFixed(2)}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  ${totalAmount?.toFixed(2)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 2 }}
                color="primary"
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartPage;