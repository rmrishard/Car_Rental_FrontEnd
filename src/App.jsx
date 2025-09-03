import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Box, Badge } from '@mui/material'
import { ShoppingCart, Login, PersonAdd, Logout, AccountCircle } from '@mui/icons-material'
import CarListPage from './pages/CarListPage'
import AddCarPage from './pages/AddCarPage'
import CarsManagementPage from './pages/CarsManagementPage'
import CarDetailsPage from './pages/CarDetailsPage'
import EditCarPage from './pages/EditCarPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UserProfilePage from './pages/UserProfilePage'
import UserManagementPage from './pages/UserManagementPage'
import ProtectedRoute from './components/ProtectedRoute'
import { useGetCart } from './api/cart/cart'
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'

const AppContent = () => {
  const { isAuthenticated, logout, user, isAdmin } = useAuth();
  const { data: cartData } = useGetCart({
    query: { enabled: isAuthenticated }
  });
  const cartItemCount = cartData?.data?.items?.reduce((total, item) => total + (item.days || 0), 0) || 0;

  const handleLogout = () => {
    logout();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component={Link}
            to="/"
            sx={{ 
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            Car Rental System
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Cars
          </Button>
          {isAdmin && (
            <>
              <Button color="inherit" component={Link} to="/cars-management">
                Manage Cars
              </Button>
              <Button color="inherit" component={Link} to="/add-car">
                Add Car
              </Button>
              <Button color="inherit" component={Link} to="/user-management">
                Manage Users
              </Button>
            </>
          )}
          <Button 
            color="inherit"
            component={Link} 
            to="/cart"
            startIcon={
              <Badge badgeContent={cartItemCount} color="secondary">
                <ShoppingCart />
              </Badge>
            }
          >
            Cart
          </Button>
          
          {isAuthenticated ? (
            <>
              <Button 
                color="inherit"
                component={Link}
                to="/profile"
                startIcon={<AccountCircle />}
                sx={{ textTransform: 'none' }}
              >
                {user?.first_name || user?.user_name || 'User'}
              </Button>
              <Button 
                color="inherit" 
                onClick={handleLogout}
                startIcon={<Logout />}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                startIcon={<Login />}
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/register"
                startIcon={<PersonAdd />}
              >
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      
      <Routes>
        <Route path="/" element={<CarListPage />} />
        <Route 
          path="/cars-management" 
          element={
            <ProtectedRoute adminOnly={true}>
              <CarsManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-car" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AddCarPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/car-details/:carId" element={<CarDetailsPage />} />
        <Route 
          path="/edit-car/:carId" 
          element={
            <ProtectedRoute adminOnly={true}>
              <EditCarPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user-management" 
          element={
            <ProtectedRoute adminOnly={true}>
              <UserManagementPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Box>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
