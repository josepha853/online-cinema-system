// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CircularProgress, Box, Typography } from '@mui/material';

// Import your components
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import { authService } from './services/authService';

// Type definitions
interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'staff' | 'admin';
}

interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  message?: string;
}

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          try {
            // Try to verify token with backend
            const response = await authService.verifyToken();
            if (response.success && response.data) {
              setIsAuthenticated(true);
              setUser(response.data.user);
              console.log(`User authenticated: ${response.data.user.name} (${response.data.user.role})`);
            } else {
              clearAuthData();
            }
          } catch (error) {
            // If verifyToken fails, use localStorage data
            console.log('Using cached authentication data');
            try {
              const cachedUser = JSON.parse(userData);
              setIsAuthenticated(true);
              setUser(cachedUser);
              console.log(`User cached: ${cachedUser.name} (${cachedUser.role})`);
            } catch (parseError) {
              console.error('Error parsing user data:', parseError);
              clearAuthData();
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleLogin = (userData: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    console.log(`User logged in: ${userData.name} (${userData.role})`);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
      console.log('User logged out');
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          flexDirection="column"
          gap={2}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading Cinema RW...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route 
              path="/" 
              element={
                isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Home />
              } 
            />
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Login onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Register />
              } 
            />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated && user ? (
                  <Dashboard user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />

            {/* Additional protected routes can be added here */}
            <Route 
              path="/profile" 
              element={
                isAuthenticated && user ? (
                  <div>Profile Page - Coming Soon</div>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;