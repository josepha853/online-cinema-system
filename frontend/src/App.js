import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, AppBar, Toolbar, Typography, IconButton, useMediaQuery } from '@mui/material';
import { Brightness4, Brightness7, DarkMode, LightMode } from '@mui/icons-material';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import Theaters from './pages/Theaters';
import TheaterDetails from './pages/TheaterDetails';
import Booking from './pages/Booking';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTheaters from './pages/admin/AdminTheaters';
import AdminShows from './pages/admin/AdminShows';
import AdminBookings from './pages/admin/AdminBookings';
import AdminReports from './pages/admin/AdminReports';
import AdminMovies from './pages/admin/AdminMovies';
import Contact from './pages/Contact';
import logoCinema from './assets/logo_cinema.jpg';

// Services
import { authService } from './services/authService';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a237e', // Deep cinema blue
      light: '#534bae',
      dark: '#000051',
    },
    secondary: {
      main: '#d50000', // Cinema red
      light: '#ff5131',
      dark: '#9b0000',
    },
    success: {
      main: '#2e7d32', // Forest green
      light: '#60ad5e',
      dark: '#005005',
    },
    warning: {
      main: '#f57c00', // Cinema gold
      light: '#ffad42',
      dark: '#bb4d00',
    },
    info: {
      main: '#0277bd', // Sky blue
      light: '#58a5f0',
      dark: '#004c8c',
    },
    background: {
      default: '#f5f7fa', // Solid color for palette (gradient applied via MuiCssBaseline)
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7986cb', // Light cinema blue for dark mode
      light: '#aab6fe',
      dark: '#49599a',
    },
    secondary: {
      main: '#ff5722', // Warm cinema red for dark mode
      light: '#ff8a50',
      dark: '#c41c00',
    },
    success: {
      main: '#66bb6a',
      light: '#98ee99',
      dark: '#338a3e',
    },
    warning: {
      main: '#ffb74d',
      light: '#ffe97d',
      dark: '#c88719',
    },
    info: {
      main: '#42a5f5',
      light: '#80d6ff',
      dark: '#0077c2',
    },
    background: {
      default: '#0a0e27', // Deep cinema dark blue
      paper: '#1a1f3a', // Slightly lighter for contrast
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(26, 31, 58, 0.95)',
          border: '1px solid rgba(121, 134, 203, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: 'rgba(26, 31, 58, 0.95)',
          border: '1px solid rgba(121, 134, 203, 0.1)',
        },
      },
    },
  },
});

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    // Check authentication status on app load
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    // Set initial dark mode based on system preference
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    authService.logout();
  };

  const currentTheme = darkMode ? darkTheme : theme;

  // Protected Route Component
  const ProtectedRoute = ({ children, requiredRole }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
      return <Navigate to="/dashboard" replace />;
    }

    return (
      <>
        {/* Single Header with all functionality */}
        <Header
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={logout}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </>
    );
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* Main Content */}
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
              <Route path="/login" element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={login} />
              } />
              <Route path="/register" element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
              } />
              <Route path="/contact" element={<Contact />} />

              {/* Customer Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard user={user} />
                </ProtectedRoute>
              } />
              <Route path="/movies" element={
                <ProtectedRoute>
                  <Movies />
                </ProtectedRoute>
              } />
              <Route path="/movies/:movieId" element={
                <ProtectedRoute>
                  <MovieDetails />
                </ProtectedRoute>
              } />
              <Route path="/theaters" element={
                <ProtectedRoute>
                  <Theaters />
                </ProtectedRoute>
              } />
              <Route path="/theaters/:theaterId" element={
                <ProtectedRoute>
                  <TheaterDetails />
                </ProtectedRoute>
              } />
              <Route path="/booking/:showId" element={
                <ProtectedRoute>
                  <BookingPage user={user} />
                </ProtectedRoute>
              } />
              <Route path="/my-bookings" element={
                <ProtectedRoute>
                  <MyBookings user={user} />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile user={user} setUser={setUser} />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/theaters" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminTheaters />
                </ProtectedRoute>
              } />
              <Route path="/admin/shows" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminShows />
                </ProtectedRoute>
              } />
              <Route path="/admin/bookings" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminBookings />
                </ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminReports />
                </ProtectedRoute>
              } />
              <Route path="/admin/movies" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminMovies />
                </ProtectedRoute>
              } />

            </Routes>
          </Box>

          {/* Footer */}
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
