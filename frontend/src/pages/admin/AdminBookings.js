import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Alert,
  CircularProgress,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';
import { Visibility, Search } from '@mui/icons-material';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await bookingService.getAllBookings();

      // Mock data for now
      setTimeout(() => {
        setBookings([
          {
            id: 1,
            order_id: 'ORD001',
            user_name: 'John Doe',
            user_email: 'john@example.com',
            movie_title: 'Avengers: Endgame',
            theater_name: 'Grand Cinema Hall 1',
            show_date: '2024-01-15',
            show_time: '18:00',
            seats: ['A1', 'A2'],
            total_amount: 25.98,
            booking_date: '2024-01-10T10:30:00Z',
            status: 'confirmed'
          },
          {
            id: 2,
            order_id: 'ORD002',
            user_name: 'Jane Smith',
            user_email: 'jane@example.com',
            movie_title: 'Spider-Man: No Way Home',
            theater_name: 'Royal Theater Screen 2',
            show_date: '2024-01-16',
            show_time: '20:30',
            seats: ['B5', 'B6', 'B7'],
            total_amount: 47.97,
            booking_date: '2024-01-11T14:15:00Z',
            status: 'confirmed'
          },
          {
            id: 3,
            order_id: 'ORD003',
            user_name: 'Mike Johnson',
            user_email: 'mike@example.com',
            movie_title: 'The Batman',
            theater_name: 'City Cinema Hall A',
            show_date: '2024-01-17',
            show_time: '19:00',
            seats: ['C10'],
            total_amount: 12.99,
            booking_date: '2024-01-12T09:45:00Z',
            status: 'cancelled'
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setError('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.movie_title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Booking Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by Order ID, Customer, or Movie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">
              Total Bookings: {filteredBookings.length}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Movie</TableCell>
              <TableCell>Theater</TableCell>
              <TableCell>Show Date/Time</TableCell>
              <TableCell>Seats</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Booking Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {booking.order_id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{booking.user_name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {booking.user_email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{booking.movie_title}</TableCell>
                <TableCell>{booking.theater_name}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {formatDate(booking.show_date)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatTime(booking.show_time)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {booking.seats.map((seat, index) => (
                      <Chip
                        key={index}
                        label={seat}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    ${booking.total_amount}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">
                    {formatDateTime(booking.booking_date)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={booking.status}
                    color={getStatusColor(booking.status)}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" size="small">
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredBookings.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            No bookings found matching your criteria.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default AdminBookings;



