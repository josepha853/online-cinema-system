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
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge
} from '@mui/material';
import {
  QrCodeScanner,
  CheckCircle,
  Cancel,
  Search,
  Event,
  LocationOn,
  People,
  ConfirmationNumber,
  AccessTime,
  Movie,
  Theaters,
  Assignment,
  Notifications,
  Warning,
  Info
} from '@mui/icons-material';

const StaffDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    todayShows: [],
    recentCheckIns: [],
    notifications: [],
    stats: {
      todayShows: 0,
      totalCheckIns: 0,
      pendingTickets: 0,
      completedShows: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [searchTicket, setSearchTicket] = useState('');
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost/cine/backend/controllers/DashboardController.php?action=staff_stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setDashboardData(data.data);
      } else {
        console.error('Failed to fetch staff data:', data.message);
      }
    } catch (error) {
      console.error('Error fetching staff data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketScan = (ticketId) => {
    // Simulate QR code scanning
    const mockTicket = {
      id: ticketId,
      customerName: 'Alice Cooper',
      movie: 'Spider-Man: No Way Home',
      showtime: '2024-12-20T17:30:00',
      theater: 'Hall 2',
      seatNumber: 'C15',
      status: 'valid'
    };
    setSelectedTicket(mockTicket);
    setScanDialogOpen(true);
  };

  const handleCheckIn = () => {
    // Process check-in
    console.log('Checking in ticket:', selectedTicket.id);
    setScanDialogOpen(false);
    setSelectedTicket(null);
    // Refresh data
    fetchStaffData();
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const getShowStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'info';
      case 'ongoing': return 'success';
      case 'completed': return 'default';
      case 'cancelled': return 'error';
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
          Staff Dashboard - {user?.name} 👨‍💼
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage check-ins and monitor today's shows
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Shows"
            value={dashboardData.stats.todayShows}
            icon={<Event />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Check-ins"
            value={dashboardData.stats.totalCheckIns}
            icon={<CheckCircle />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Tickets"
            value={dashboardData.stats.pendingTickets}
            icon={<ConfirmationNumber />}
            color="warning"
            subtitle="Awaiting check-in"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed Shows"
            value={dashboardData.stats.completedShows}
            icon={<Movie />}
            color="info"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* QR Code Scanner & Ticket Search */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              🎫 Ticket Check-in
            </Typography>
            
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Search Ticket ID or QR Code"
                  value={searchTicket}
                  onChange={(e) => setSearchTicket(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<QrCodeScanner />}
                  onClick={() => handleTicketScan(searchTicket)}
                  sx={{ height: '56px' }}
                >
                  Scan QR Code
                </Button>
              </Grid>
            </Grid>

            {/* Today's Shows */}
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              📅 Today's Shows
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Movie</TableCell>
                    <TableCell>Showtime</TableCell>
                    <TableCell>Theater</TableCell>
                    <TableCell>Capacity</TableCell>
                    <TableCell>Booked</TableCell>
                    <TableCell>Checked In</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.todayShows.map((show) => (
                    <TableRow key={show.id}>
                      <TableCell>{show.title}</TableCell>
                      <TableCell>{formatDateTime(show.showtime)}</TableCell>
                      <TableCell>{show.theater}</TableCell>
                      <TableCell>{show.capacity}</TableCell>
                      <TableCell>{show.booked}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {show.checkedIn}
                          <Typography variant="body2" color="text.secondary">
                            ({Math.round((show.checkedIn / show.booked) * 100)}%)
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={show.status.toUpperCase()} 
                          color={getShowStatusColor(show.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Recent Check-ins */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              ✅ Recent Check-ins
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ticket ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Movie</TableCell>
                    <TableCell>Seat</TableCell>
                    <TableCell>Check-in Time</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.recentCheckIns.map((checkIn) => (
                    <TableRow key={checkIn.id}>
                      <TableCell>{checkIn.id}</TableCell>
                      <TableCell>{checkIn.customerName}</TableCell>
                      <TableCell>{checkIn.movie}</TableCell>
                      <TableCell>{checkIn.seatNumber}</TableCell>
                      <TableCell>{formatDateTime(checkIn.checkInTime)}</TableCell>
                      <TableCell>
                        <Chip 
                          label="CHECKED IN" 
                          color="success"
                          size="small"
                          icon={<CheckCircle />}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
              <ListItem button>
                <ListItemIcon><QrCodeScanner color="primary" /></ListItemIcon>
                <ListItemText primary="Manual Check-in" secondary="Process walk-in customers" />
              </ListItem>
              <ListItem button>
                <ListItemIcon><Assignment color="primary" /></ListItemIcon>
                <ListItemText primary="Daily Report" secondary="Generate today's summary" />
              </ListItem>
              <ListItem button>
                <ListItemIcon><Theaters color="primary" /></ListItemIcon>
                <ListItemText primary="Theater Status" secondary="Check hall conditions" />
              </ListItem>
              <ListItem button>
                <ListItemIcon><People color="primary" /></ListItemIcon>
                <ListItemText primary="Customer Support" secondary="Help desk requests" />
              </ListItem>
            </List>
          </Paper>

          {/* Notifications */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              🔔 Staff Notifications
            </Typography>
            <List>
              {dashboardData.notifications.map((notification) => (
                <ListItem key={notification.id} divider>
                  <ListItemIcon>
                    <Badge 
                      color={notification.type === 'error' ? 'error' : notification.type === 'warning' ? 'warning' : 'info'} 
                      variant="dot"
                    >
                      {notification.type === 'error' ? <Warning /> : 
                       notification.type === 'warning' ? <AccessTime /> : <Info />}
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

      {/* QR Code Scan Dialog */}
      <Dialog open={scanDialogOpen} onClose={() => setScanDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ticket Verification</DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                Valid ticket found!
              </Alert>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Ticket ID:</Typography>
                  <Typography variant="h6">{selectedTicket.id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Customer:</Typography>
                  <Typography variant="h6">{selectedTicket.customerName}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Movie:</Typography>
                  <Typography variant="h6">{selectedTicket.movie}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Showtime:</Typography>
                  <Typography variant="body1">{formatDateTime(selectedTicket.showtime)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Seat:</Typography>
                  <Typography variant="body1">{selectedTicket.seatNumber}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Theater:</Typography>
                  <Typography variant="body1">{selectedTicket.theater}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScanDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCheckIn} startIcon={<CheckCircle />}>
            Check In Customer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StaffDashboard;


