import React, { useState, useEffect } from 'react';
import { bookingApi } from '../services/apiService';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Snackbar,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Badge,
  Avatar,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Event,
  LocationOn,
  ConfirmationNumber,
  Star,
  Search,
  Edit,
  Delete,
  Visibility,
  QrCode,
  Schedule,
  Cancel,
  FilterList,
  CheckCircle,
  Warning,
  Info,
  Person,
  AttachMoney
} from '@mui/icons-material';

const MyBookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [availableShowtimes, setAvailableShowtimes] = useState([]);
  const [newShowtime, setNewShowtime] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        console.log('Fetching user bookings...');
        const response = await bookingApi.getUserBookings();
        console.log('Bookings API response:', response);
        if (response.data.success) {
          setBookings(response.data.data || []);
          setError('');
        } else {
          setError(response.data.message || 'Failed to load bookings');
        }
      } catch (err) {
        console.error('Error loading bookings:', err);
        console.error('Error response:', err.response);
        console.error('Error message:', err.message);
        console.error('Error status:', err.response?.status);
        console.error('Error data:', err.response?.data);
        setError('Failed to load bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const filterBookings = () => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.movie_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.theater.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  };

  const handleSelectBooking = (bookingId) => {
    setSelectedBookings(prev => {
      if (prev.includes(bookingId)) {
        return prev.filter(id => id !== bookingId);
      } else {
        return [...prev, bookingId];
      }
    });
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setEditFormData({
      showtime: booking.showtime,
      seats: booking.seats.join(', '),
      ticket_type: booking.ticket_type,
      quantity: booking.quantity
    });
    setEditDialogOpen(true);
  };

  const handleDeleteBooking = (booking) => {
    setSelectedBooking(booking);
    setDeleteDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      setBookings(prev => prev.map(booking =>
        booking.id === selectedBooking.id
          ? { ...booking, ...editFormData, seats: editFormData.seats.split(', ') }
          : booking
      ));

      setEditDialogOpen(false);
      setSnackbar({ open: true, message: 'Booking updated successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update booking', severity: 'error' });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setBookings(prev => prev.map(booking =>
        booking.id === selectedBooking.id
          ? { ...booking, status: 'cancelled' }
          : booking
      ));

      setDeleteDialogOpen(false);
      setSnackbar({ open: true, message: 'Booking cancelled successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to cancel booking', severity: 'error' });
    }
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

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const canCancelBooking = (booking) => {
    const showDateTime = new Date(booking.showDate + ' ' + booking.showTime);
    const now = new Date();
    const hoursUntilShow = (showDateTime.getTime() - now.getTime()) / (1000 * 3600);
    return hoursUntilShow >= 2 && booking.status === 'confirmed';
  };

  const canRescheduleBooking = (booking) => {
    const showDateTime = new Date(booking.showDate + ' ' + booking.showTime);
    const now = new Date();
    const hoursUntilShow = (showDateTime.getTime() - now.getTime()) / (1000 * 3600);
    return hoursUntilShow >= 24 && booking.status === 'confirmed';
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleRescheduleBooking = (booking) => {
    setSelectedBooking(booking);
    // Fetch available showtimes for the same movie
    fetchAvailableShowtimes(booking.movieTitle);
    setRescheduleDialogOpen(true);
  };

  const fetchAvailableShowtimes = async (movieTitle) => {
    // Mock available showtimes
    const mockShowtimes = [
      { id: 1, date: '2024-12-21', time: '14:30', theater: 'CineMax Kigali City' },
      { id: 2, date: '2024-12-21', time: '17:00', theater: 'CineMax Kigali City' },
      { id: 3, date: '2024-12-21', time: '20:30', theater: 'CineMax Kigali City' },
      { id: 4, date: '2024-12-22', time: '15:00', theater: 'Century Cinemax' },
      { id: 5, date: '2024-12-22', time: '18:30', theater: 'Century Cinemax' }
    ];
    setAvailableShowtimes(mockShowtimes);
  };

  const handleConfirmCancel = async () => {
    try {
      if (!cancelReason.trim()) {
        setSnackbar({ open: true, message: 'Please provide a cancellation reason', severity: 'warning' });
        return;
      }

      // Calculate refund amount (full refund if cancelled more than 24 hours before)
      const showDateTime = new Date(selectedBooking.showDate + ' ' + selectedBooking.showTime);
      const now = new Date();
      const hoursUntilShow = (showDateTime.getTime() - now.getTime()) / (1000 * 3600);

      let refundAmount = 0;
      if (hoursUntilShow >= 24) {
        refundAmount = selectedBooking.totalAmount; // Full refund
      } else if (hoursUntilShow >= 2) {
        refundAmount = selectedBooking.totalAmount * 0.5; // 50% refund
      }

      // Update booking status
      setBookings(prev => prev.map(booking =>
        booking.id === selectedBooking.id
          ? {
            ...booking,
            status: 'cancelled',
            cancelReason: cancelReason,
            refundAmount: refundAmount,
            cancelledAt: new Date().toISOString()
          }
          : booking
      ));

      setCancelDialogOpen(false);
      setCancelReason('');

      const refundMessage = refundAmount > 0
        ? ` Refund of ${formatCurrency(refundAmount)} will be processed within 3-5 business days.`
        : '';

      setSnackbar({
        open: true,
        message: `Booking cancelled successfully!${refundMessage}`,
        severity: 'success'
      });

    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to cancel booking', severity: 'error' });
    }
  };

  const handleConfirmReschedule = async () => {
    try {
      if (!newShowtime) {
        setSnackbar({ open: true, message: 'Please select a new showtime', severity: 'warning' });
        return;
      }

      const selectedShowtime = availableShowtimes.find(st => st.id.toString() === newShowtime);
      if (!selectedShowtime) return;

      // Update booking with new showtime
      setBookings(prev => prev.map(booking =>
        booking.id === selectedBooking.id
          ? {
            ...booking,
            showDate: selectedShowtime.date,
            showTime: selectedShowtime.time,
            theater: selectedShowtime.theater,
            rescheduledAt: new Date().toISOString(),
            originalShowDate: selectedBooking.showDate,
            originalShowTime: selectedBooking.showTime
          }
          : booking
      ));

      setRescheduleDialogOpen(false);
      setNewShowtime('');
      setSnackbar({
        open: true,
        message: 'Booking rescheduled successfully!',
        severity: 'success'
      });

    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to reschedule booking', severity: 'error' });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

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
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
          🎫 My Bookings
        </Typography>
        <Typography variant="h6" color="text.secondary">
          View, edit, and manage your movie ticket bookings
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search bookings"
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
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status Filter"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">
              Found {filteredBookings.length} booking(s)
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            {selectedBookings.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => {
                  selectedBookings.forEach(id => {
                    const booking = bookings.find(b => b.id === id);
                    if (booking) handleDeleteBooking(booking);
                  });
                }}
                fullWidth
              >
                Cancel Selected ({selectedBookings.length})
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Bookings Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Your Bookings
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                    indeterminate={selectedBookings.length > 0 && selectedBookings.length < filteredBookings.length}
                    onChange={() => {
                      if (selectedBookings.length === filteredBookings.length) {
                        setSelectedBookings([]);
                      } else {
                        setSelectedBookings(filteredBookings.map(booking => booking.id));
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>Movie</TableCell>
                <TableCell>Showtime</TableCell>
                <TableCell>Theater</TableCell>
                <TableCell>Seats</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedBookings.includes(booking.id)}
                      onChange={() => handleSelectBooking(booking.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {booking.order_id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {booking.movie_title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDateTime(booking.showtime)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {booking.theater}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {booking.seats.join(', ')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      ${booking.total_amount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status.toUpperCase()}
                      color={getStatusColor(booking.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewBooking(booking)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      {(booking.status === 'confirmed' || booking.status === 'pending') && (
                        <>
                          <Tooltip title="Edit Booking">
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={() => handleEditBooking(booking)}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel Booking">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteBooking(booking)}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      <Tooltip title="View QR Code">
                        <IconButton size="small" color="info">
                          <QrCode />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredBookings.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary">
              No bookings found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'You haven\'t made any bookings yet'
              }
            </Typography>
          </Box>
        )}
      </Paper>

      {/* View Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <Event sx={{ mr: 1 }} />
                      Show Information
                    </Typography>
                    <Typography><strong>Movie:</strong> {selectedBooking.movie_title}</Typography>
                    <Typography><strong>Showtime:</strong> {formatDateTime(selectedBooking.showtime)}</Typography>
                    <Typography><strong>Theater:</strong> {selectedBooking.theater}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <Person sx={{ mr: 1 }} />
                      Booking Information
                    </Typography>
                    <Typography><strong>Order ID:</strong> {selectedBooking.order_id}</Typography>
                    <Typography><strong>Seats:</strong> {selectedBooking.seats.join(', ')}</Typography>
                    <Typography><strong>Ticket Type:</strong> {selectedBooking.ticket_type}</Typography>
                    <Typography><strong>Quantity:</strong> {selectedBooking.quantity}</Typography>
                    <Typography><strong>Total:</strong> ${selectedBooking.total_amount}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<QrCode />}>
            Download QR Code
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Showtime"
                type="datetime-local"
                value={editFormData.showtime?.slice(0, 16) || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, showtime: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Seats (comma separated)"
                value={editFormData.seats || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, seats: e.target.value }))}
                placeholder="A12, A13, A14"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Ticket Type</InputLabel>
                <Select
                  value={editFormData.ticket_type || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, ticket_type: e.target.value }))}
                  label="Ticket Type"
                >
                  <MenuItem value="Standard">Standard</MenuItem>
                  <MenuItem value="VIP">VIP</MenuItem>
                  <MenuItem value="Premium">Premium</MenuItem>
                  <MenuItem value="Student">Student</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={editFormData.quantity || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                inputProps={{ min: 1, max: 10 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to cancel this booking?
          </Alert>
          {selectedBooking && (
            <Box>
              <Typography><strong>Movie:</strong> {selectedBooking.movie_title}</Typography>
              <Typography><strong>Order ID:</strong> {selectedBooking.order_id}</Typography>
              <Typography><strong>Amount:</strong> ${selectedBooking.total_amount}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                This action cannot be undone. You may be eligible for a refund based on our cancellation policy.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Keep Booking</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MyBookings;


