import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Snackbar,
  Stack
} from '@mui/material';
import {
  EventSeat,
  Payment,
  ConfirmationNumber,
  Movie,
  Schedule,
  LocationOn,
  Person,
  Email,
  Phone,
  CreditCard,
  AccountBalance,
  CheckCircle,
  Visibility,
  Edit,
  Delete,
  QrCode
} from '@mui/icons-material';
import { bookingService } from '../services/crudService';

const Booking = ({ user }) => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [show, setShow] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingData, setBookingData] = useState({
    ticket_type_id: '',
    quantity: 1,
    payment_method: 'wallet'
  });
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookings, setBookings] = useState([]);
  const [bookingListLoading, setBookingListLoading] = useState(false);
  const [bookingListError, setBookingListError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ ticket_type_id: '', seats: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editLoading, setEditLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const scriptId = 'booking-data-script';

  const steps = ['Select Show', 'Choose Tickets', 'Select Seats', 'Payment', 'Confirmation'];

  useEffect(() => {
    const loadBookingData = async () => {
      setLoading(true);
      try {
        const payload = await injectBookingData(showId);
        setShow(payload?.show ?? null);
        setTicketTypes(payload?.ticket_types ?? []);
        setBookings(payload?.recent_bookings ?? []);
        setBookingListError('');
      } catch (err) {
        setBookingListError(err.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
        setBookingListLoading(false);
      }
    };

    loadBookingData();
  }, [showId]);

  const injectBookingData = (showId) =>
    new Promise((resolve, reject) => {
      const existing = document.getElementById(scriptId);
      if (existing) {
        existing.remove();
      }

      window.__BOOKING_DATA__ = null;

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `http://localhost/cine/backend/customer/booking_data.php?show_id=${showId}&_=${Date.now()}`;
      script.async = true;
      script.onload = () => {
        if (!window.__BOOKING_DATA__) {
          reject(new Error('Booking data failed to load.'));
          return;
        }
        resolve(window.__BOOKING_DATA__);
      };
      script.onerror = () => reject(new Error('Unable to fetch booking data.'));
      document.body.appendChild(script);
    });

  const handleBookingDataChange = (field, value) => {
    setBookingData({
      ...bookingData,
      [field]: value
    });
  };

  const calculateTotal = () => {
    const ticketType = ticketTypes.find(t => t.type_id === parseInt(bookingData.ticket_type_id));
    if (!ticketType) return 0;
    return ticketType.price * bookingData.quantity;
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setBookingLoading(true);
      setError('');

      const bookingPayload = {
        show_id: showId,
        ticket_type_id: bookingData.ticket_type_id,
        quantity: bookingData.quantity,
        payment_method: bookingData.payment_method,
        seat_numbers: selectedSeats
      };

      const response = await bookingService.create(bookingPayload);
      
      if (response.data.success) {
        setSuccess('Booking successful! Redirecting to your bookings...');
        setTimeout(() => {
          navigate('/my-bookings');
        }, 2000);
      } else {
        setError(response.data.message || 'Booking failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
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

  const handleEditBookingClick = (booking) => {
    setSelectedBooking(booking);
    setEditFormData({
      ticket_type_id: booking.ticket_type_id?.toString() || '',
      seats: booking.seats ? booking.seats.join(', ') : booking.seat_numbers?.join(', ') || ''
    });
    setEditDialogOpen(true);
  };

  const handleCancelBookingClick = (booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedBooking) return;
    try {
      setEditLoading(true);
      await bookingService.update(selectedBooking.order_id, {
        ticket_type_id: editFormData.ticket_type_id,
        seat_numbers: editFormData.seats.split(',').map((seat) => seat.trim()).filter(Boolean)
      });
      setBookings((prev) => prev.map((booking) =>
        booking.order_id === selectedBooking.order_id
          ? {
              ...booking,
              ticket_type_id: editFormData.ticket_type_id,
              seats: editFormData.seats.split(',').map((seat) => seat.trim()).filter(Boolean)
            }
          : booking
      ));
      setSnackbar({ open: true, message: 'Booking updated successfully', severity: 'success' });
      setEditDialogOpen(false);
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to update booking', severity: 'error' });
    } finally {
      setEditLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;
    try {
      setCancelLoading(true);
      await bookingService.cancel(selectedBooking.order_id);
      setBookings((prev) => prev.map((booking) =>
        booking.order_id === selectedBooking.order_id
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
      setSnackbar({ open: true, message: 'Booking cancelled successfully', severity: 'success' });
      setCancelDialogOpen(false);
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to cancel booking', severity: 'error' });
    } finally {
      setCancelLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!show) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Show not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          🎫 Book Tickets
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Complete your booking in just a few simple steps
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Show Details */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Show Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              {show.title}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Chip label={show.genre} size="small" sx={{ mr: 1 }} />
              <Chip label={show.language} size="small" sx={{ mr: 1 }} />
              <Chip label={show.type} size="small" variant="outlined" />
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              {show.description}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  📅 {new Date(show.date).toLocaleDateString()}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  🕐 {show.time}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  🎭 {show.theater_name}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  📍 {show.city}
                </Typography>
                <Typography variant="subtitle2">
                  ⏱️ Duration: {show.duration} minutes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Booking Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Select Tickets
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Ticket Type</InputLabel>
              <Select
                value={bookingData.ticket_type_id}
                onChange={(e) => handleBookingDataChange('ticket_type_id', e.target.value)}
                label="Ticket Type"
              >
                {ticketTypes.map((type) => (
                  <MenuItem key={type.type_id} value={type.type_id}>
                    {type.name} - RWF {type.price}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Quantity"
              value={bookingData.quantity}
              onChange={(e) => handleBookingDataChange('quantity', parseInt(e.target.value))}
              inputProps={{ min: 1, max: 10 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={bookingData.payment_method}
                onChange={(e) => handleBookingDataChange('payment_method', e.target.value)}
                label="Payment Method"
              >
                <MenuItem value="wallet">Wallet</MenuItem>
                <MenuItem value="card">Credit/Debit Card</MenuItem>
                <MenuItem value="cash">Cash at Counter</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Booking Summary
          </Typography>
          <Typography variant="body2">
            Total Amount: <strong>RWF {calculateTotal()}</strong>
          </Typography>
          {user && (
            <Typography variant="body2" color="text.secondary">
              Wallet Balance: RWF {user.wallet_balance}
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleBooking}
            disabled={!bookingData.ticket_type_id || bookingLoading}
            sx={{ minWidth: 120 }}
          >
            {bookingLoading ? <CircularProgress size={24} /> : 'Confirm Booking'}
          </Button>
          <Button variant="outlined" onClick={() => navigate('/movies')}>
            Cancel
          </Button>
        </Box>
      </Paper>

      {/* Booking CRUD List */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">Your Bookings</Typography>
          {bookingListLoading && <CircularProgress size={20} />}
        </Box>
        {bookingListError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {bookingListError}
          </Alert>
        )}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Show</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.order_id} hover>
                  <TableCell>{booking.order_id}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">{booking.show_title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {booking.show_date} • {booking.show_time}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status?.toUpperCase() || 'PENDING'}
                      color={getStatusColor(booking.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">RWF {booking.total_amount}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Edit booking">
                        <span>
                          <IconButton
                            size="small"
                            color="warning"
                            disabled={booking.status === 'cancelled'}
                            onClick={() => handleEditBookingClick(booking)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Cancel booking">
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            disabled={booking.status === 'cancelled'}
                            onClick={() => handleCancelBookingClick(booking)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="View QR code">
                        <IconButton size="small" color="info">
                          <QrCode fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {!bookingListLoading && bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No bookings to show yet. Create one via the form above.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Booking Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Ticket Type ID"
            value={editFormData.ticket_type_id}
            onChange={(e) => setEditFormData((prev) => ({ ...prev, ticket_type_id: e.target.value }))}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Seats (comma separated)"
            value={editFormData.seats}
            onChange={(e) => setEditFormData((prev) => ({ ...prev, seats: e.target.value }))}
            helperText="Example: A12, A13"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit} disabled={editLoading}>
            {editLoading ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Booking Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Cancelling will void this booking. You can rebook again on the same show page.
          </Alert>
          {selectedBooking && (
            <Typography variant="body2">
              {selectedBooking.show_title} • Order {selectedBooking.order_id}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Keep</Button>
          <Button variant="contained" color="error" onClick={handleConfirmCancel} disabled={cancelLoading}>
            {cancelLoading ? <CircularProgress size={20} /> : 'Cancel Booking'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Booking;


