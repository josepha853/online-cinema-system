import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Rating,
  LinearProgress,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import {
  Movie,
  Event,
  AccountBalance,
  Stars,
  TrendingUp,
  ConfirmationNumber,
  Wallet,
  Loyalty,
  Notifications,
  AccessTime,
  LocationOn,
  PlayArrow,
  BookOnline,
  Star,
  EventAvailable,
  QrCode,
  Cancel,
  Schedule,
  Edit,
  Delete
} from '@mui/icons-material';
import { showApi } from '../services/apiService';

const CustomerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    upcomingShows: [],
    recentBookings: [],
    notifications: [],
    stats: {
      totalBookings: 0,
      upcomingBookings: 0,
      walletBalance: 0,
      loyaltyPoints: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch customer stats
      const statsResponse = await fetch('http://localhost/cine/backend/controllers/DashboardController.php?action=customer_stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const statsData = await statsResponse.json();

      // Fetch upcoming shows
      const showsResponse = await showApi.getUpcomingShows();
      const showsData = showsResponse.data;

      if (statsData.success && showsData.success) {
        // Transform shows data to match component format
        const transformedShows = showsData.data.slice(0, 6).map(show => ({
          id: show.show_id,
          title: show.title,
          poster: show.poster_url ? `http://localhost/cine/backend/${show.poster_url}` : 'https://via.placeholder.com/300x450?text=No+Poster',
          rating: parseFloat(show.rating || 7.5),
          genre: show.genre,
          duration: parseInt(show.duration || 120),
          theater: show.theater_name || 'Theater',
          price: parseFloat(show.price || 3000),
          date: show.date,
          time: show.time
        }));

        setDashboardData({
          upcomingShows: transformedShows,
          recentBookings: statsData.data.recentBookings || [],
          notifications: statsData.data.notifications || [],
          stats: statsData.data.stats || {
            totalBookings: 0,
            upcomingBookings: 0,
            walletBalance: 0,
            loyaltyPoints: 0
          }
        });
      } else {
        console.error('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => (
    <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}.light, ${color}.main)`, color: 'white' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ fontSize: 48, opacity: 0.8 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
          Welcome back, {user?.name}! 🎬
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Ready to book your next movie experience?
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Bookings"
            value={dashboardData.stats.totalBookings}
            icon={<ConfirmationNumber />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Upcoming Shows"
            value={dashboardData.stats.upcomingBookings}
            icon={<EventAvailable />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Wallet Balance"
            value={`$${dashboardData.stats.walletBalance}`}
            icon={<Wallet />}
            color="info"
            subtitle="Available for bookings"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Loyalty Points"
            value={dashboardData.stats.loyaltyPoints}
            icon={<Loyalty />}
            color="warning"
            subtitle="Earn more with bookings"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Now Showing Movies */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" fontWeight="bold">
                🎬 Now Showing
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/movies')}
                startIcon={<Movie />}
              >
                View All Movies
              </Button>
            </Box>

            <Grid container spacing={2}>
              {dashboardData.upcomingShows.map((show) => (
                <Grid item xs={12} sm={6} md={4} key={show.id}>
                  <Card sx={{ height: '100%', '&:hover': { transform: 'translateY(-4px)', transition: '0.3s' } }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={show.poster}
                      alt={show.title}
                    />
                    <CardContent>
                      <Typography variant="h6" noWrap gutterBottom>
                        {show.title}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Rating value={show.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="body2">({show.rating})</Typography>
                      </Box>
                      <Chip label={show.genre} size="small" color="primary" variant="outlined" sx={{ mb: 1 }} />
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <AccessTime fontSize="small" />
                        <Typography variant="body2">{show.duration} min</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <LocationOn fontSize="small" />
                        <Typography variant="body2" noWrap>{show.theater}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          ${show.price}
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<BookOnline />}
                          onClick={() => navigate(`/booking/${show.show_id || show.id}`)}
                        >
                          Book Now
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Recent Bookings */}
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" fontWeight="bold">
                🎫 Recent Bookings
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/my-bookings')}
                startIcon={<ConfirmationNumber />}
              >
                View All Bookings
              </Button>
            </Box>

            {dashboardData.recentBookings.map((booking) => (
              <Card key={booking.id} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                      <Typography variant="h6" gutterBottom>
                        {booking.movie}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Booking ID: {booking.id}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Event fontSize="small" />
                        <Typography variant="body2">
                          {formatDateTime(booking.showtime)}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <LocationOn fontSize="small" />
                        <Typography variant="body2">
                          {booking.theater}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="body2" color="text.secondary">
                        Seats: {booking.seats.join(', ')}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ${booking.amount}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Chip
                        label={booking.status.toUpperCase()}
                        color={getStatusColor(booking.status)}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Box display="flex" gap={1}>
                        <IconButton size="small" color="primary" title="View QR Code">
                          <QrCode />
                        </IconButton>
                        {booking.status === 'confirmed' && (
                          <>
                            <IconButton size="small" color="warning" title="Reschedule">
                              <Schedule />
                            </IconButton>
                            <IconButton size="small" color="error" title="Cancel">
                              <Cancel />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Quick Actions */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              🚀 Quick Actions
            </Typography>
            <List>
              <ListItem button onClick={() => navigate('/movies')}>
                <ListItemIcon><Movie color="primary" /></ListItemIcon>
                <ListItemText primary="Browse Movies" secondary="Find your next favorite" />
              </ListItem>
              <ListItem button onClick={() => navigate('/theaters')}>
                <ListItemIcon><LocationOn color="primary" /></ListItemIcon>
                <ListItemText primary="Find Theaters" secondary="Locations near you" />
              </ListItem>
              <ListItem button onClick={() => navigate('/my-bookings')}>
                <ListItemIcon><ConfirmationNumber color="primary" /></ListItemIcon>
                <ListItemText primary="My Bookings" secondary="Manage your tickets" />
              </ListItem>
              <ListItem button onClick={() => navigate('/profile')}>
                <ListItemIcon><AccountBalance color="primary" /></ListItemIcon>
                <ListItemText primary="Top Up Wallet" secondary="Add funds to your account" />
              </ListItem>
            </List>
          </Paper>

          {/* Booking Center */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              🎯 Booking Center
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Start a new reservation or manage existing ones without leaving the dashboard.
            </Typography>
            <Box mt={2} display="flex" flexDirection="column" gap={1}>
              <Button
                variant="contained"
                startIcon={<BookOnline />}
                onClick={() => navigate('/movies')}
              >
                Start New Booking
              </Button>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => navigate('/my-bookings')}
              >
                Update Booking
              </Button>
              <Button
                variant="text"
                color="error"
                startIcon={<Delete />}
                onClick={() => navigate('/my-bookings')}
              >
                Cancel Booking
              </Button>
            </Box>
          </Paper>

          {/* Notifications */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              🔔 Recent Notifications
            </Typography>
            <List>
              {dashboardData.notifications.map((notification) => (
                <ListItem key={notification.id} divider>
                  <ListItemIcon>
                    <Badge color={notification.type === 'success' ? 'success' : 'info'} variant="dot">
                      <Notifications />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.message}
                    secondary={notification.time}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomerDashboard;


