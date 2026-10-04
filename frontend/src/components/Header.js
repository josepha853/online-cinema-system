import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Avatar
} from '@mui/material';
import {
  AccountCircle,
  Dashboard,
  Movie,
  LocationOn,
  ConfirmationNumber,
  Person,
  AdminPanelSettings,
  Assessment,
  DarkMode,
  LightMode,
  QrCodeScanner
} from '@mui/icons-material';
import NotificationCenter from './NotificationCenter';
import logoCinema from '../assets/logo_cinema.jpg';

const Header = ({ isAuthenticated, user, onLogout, darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    onLogout();
    handleClose();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const customerMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { path: '/movies', label: 'Movies', icon: <Movie /> },
    { path: '/theaters', label: 'Theaters', icon: <LocationOn /> },
    { path: '/my-bookings', label: 'My Bookings', icon: <ConfirmationNumber /> },
  ];

  const staffMenuItems = [
    { path: '/dashboard', label: 'Staff Dashboard', icon: <QrCodeScanner /> },
    { path: '/movies', label: 'Movies', icon: <Movie /> },
    { path: '/theaters', label: 'Theaters', icon: <LocationOn /> },
  ];

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Admin Dashboard', icon: <AdminPanelSettings /> },
    { path: '/admin/movies', label: 'Manage Movies', icon: <Movie /> },
    { path: '/admin/theaters', label: 'Manage Theaters', icon: <LocationOn /> },
    { path: '/admin/shows', label: 'Manage Shows', icon: <Movie /> },
    { path: '/admin/bookings', label: 'Manage Bookings', icon: <ConfirmationNumber /> },
    { path: '/admin/reports', label: 'Reports', icon: <Assessment /> },
  ];

  const menuItems = user?.role === 'admin' 
    ? adminMenuItems 
    : user?.role === 'staff' 
      ? staffMenuItems 
      : customerMenuItems;

  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 }
          }}
          onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
        >
          <img 
            src={logoCinema} 
            alt=" online ticket Cinema Logo" 
            style={{ 
              height: '80px', 
              width: '80px', 
              marginRight: '12px' 
            }} 
          />
          <center>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 'bold' }}
          >
            online cinema ticket booking and management system
          </Typography>
          </center>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />

        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Navigation Menu moved below title */}

            {/* Notifications */}
            <NotificationCenter userId={user?.user_id} />

            {/* Dark Mode Toggle */}
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>

            {/* User Menu */}
            <IconButton
              color="inherit"
              onClick={handleMenu}
              sx={{ ml: 1 }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.name?.charAt(0)?.toUpperCase() || <AccountCircle />}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                style: { minWidth: 200 }
              }}
            >
              <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                <Person sx={{ mr: 2 }} />
                Profile
              </MenuItem>
              {user?.role === 'customer' ? [
                <MenuItem key="wallet" onClick={() => { navigate('/wallet'); handleClose(); }}>
                  💰 Wallet: RWF {user?.wallet_balance || 0}
                </MenuItem>,
                <MenuItem key="loyalty" onClick={() => { navigate('/loyalty'); handleClose(); }}>
                  ⭐ Points: {user?.loyalty_points || 0}
                </MenuItem>
              ] : null}
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Dark Mode Toggle for non-authenticated users */}
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button color="inherit" onClick={() => navigate('/register')}>
              Register
            </Button>
          </Box>
        )}
      </Toolbar>

      {isAuthenticated && (
        <Toolbar
          sx={{
            justifyContent: 'center',
            gap: 1,
            bgcolor: 'primary.main',
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {menuItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                bgcolor: isActive(item.path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Toolbar>
      )}
    </AppBar>
  );
};

export default Header;
