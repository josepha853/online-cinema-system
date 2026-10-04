import React, { useState, useEffect } from 'react';
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
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  Tooltip,
  Snackbar
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Visibility,
  QrCode,
  Schedule,
  Cancel,
  FilterList,
  Add,
  CheckCircle,
  Warning,
  Info,
  Event,
  LocationOn,
  Person,
  AttachMoney
} from '@mui/icons-material';
import { bookingService } from '../services/crudService';

const BookingManagement = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      // const response = await bookingService.getByUserId(user.user_id);
      
      // Mock bookings data
      const mockBookings = [
        {
          id: 'BK001',
          order_id: 'ORD2024001',
          movie_title: 'Avengers: Endgame',
          showtime: '2024-12-20T19:00:00',
          theater: 'Grand Cinema Hall 1',
          seats: ['A12', 'A13'],
          ticket_type: 'Standard',
          quantity: 2,
          price_per_ticket: 15.99,
          total_amount: 31.98,
          status: 'confirmed',
          booking_date: '2024-12-15T10:30:00',
          qr_code: 'QR123456789',
          customer_name: user?.name || 'John Doe',
          customer_email: user?.email || 'john@email.com',
          payment_method: 'wallet'
        },
        {
          id: 'BK002',
          order_id: 'ORD2024002',
          movie_title: 'Spider-Man: No Way Home',
          showtime: '2024-12-22T21:30:00',
          theater: 'Royal Theater Screen 2',
          seats: ['B8', 'B9', 'B10'],
          ticket_type: 'VIP',
          quantity: 3,
          price_per_ticket: 25.99,
          total_amount: 77.97,
          status: 'pending',
          booking_date: '2024-12-16T14:15:00',
          qr_code: 'QR987654321',
          customer_name: user?.name || 'John Doe',
          customer_email: user?.email || 'john@email.com',
          payment_method: 'card'
        },
        {
          id: 'BK003',
          order_id: 'ORD2024003',
          movie_title: 'The Batman',
          showtime: '2024-12-18T20:00:00',
          theater: 'City Cinema Hall A',
          seats: ['C15'],
          ticket_type: 'Standard',
          quantity: 1,
          price_per_ticket: 12.99,
          total_amount: 12.99,
          status: 'completed',
          booking_date: '2024-12-10T09:45:00',
          qr_code: 'QR456789123',
          customer_name: user?.name || 'John Doe',
          customer_email: user?.email || 'john@email.com',
          payment_method: 'wallet'
        },
        {
          id: 'BK004',
          order_id: 'ORD2024004',
          movie_title: 'Ubwiyunge',
          showtime: '2024-12-25T18:00:00',
          theater: 'Kigali Cultural Center',
          seats: ['D5', 'D6'],
          ticket_type: 'Premium',
          quantity: 2,
          price_per_ticket: 18.99,
          total_amount: 37.98,
          status: 'cancelled',
          booking_date: '2024-12-12T16:20:00',
          qr_code: 'QR789123456',
          customer_name: user?.name || 'John Doe',
          customer_email: user?.email || 'john@email.com',
          payment_method: 'cash'
        }
      ];
      
      setBookings(mockBookings);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setSnackbar({ open: true, message: 'Failed to load bookings', severity: 'error' });
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.movie_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.theater.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
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

  const handleSelectAll = () => {
    if (selectedBookings.length === filteredBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(filteredBookings.map(booking => booking.id));
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setViewDialogOpen(true);
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
      // API call to update booking
      // await bookingService.update(selectedBooking.id, editFormData);
      
      // Update local state
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
      // API call to cancel/delete booking
      // await bookingService.cancel(selectedBooking.id);
      
      // Update local state
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

  const handleBulkDelete = async () => {
    try {
      // API calls to cancel multiple bookings
      // await Promise.all(selectedBookings.map(id => bookingService.cancel(id)));
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        selectedBookings.includes(booking.id) 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
      
      setSelectedBookings([]);
      setSnackbar({ open: true, message: `${selectedBookings.length} bookings cancelled successfully!`, severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to cancel selected bookings', severity: 'error' });
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle />;
      case 'pending': return <Schedule />;
      case 'cancelled': return <Cancel />;
      case 'completed': return <Info />;
      default: return <Info />;
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
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
          🎫 My Bookings Management
        </Typography>
        <Typography variant="h6" color="text.secondary">
          View, edit, and manage your movie ticket bookings
        </Typography>
      </Box>

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
                onClick={handleBulkDelete}
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Your Bookings
          </Typography>
          <Checkbox
            checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
            indeterminate={selectedBookings.length > 0 && selectedBookings.length < filteredBookings.length}
            onChange={handleSelectAll}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                    indeterminate={selectedBookings.length > 0 && selectedBookings.length < filteredBookings.length}
                    onChange={handleSelectAll}
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
                      icon={getStatusIcon(booking.status)}
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

      {/* View Booking Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
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
                    <Typography><strong>Duration:</strong> 2h 30min</Typography>
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
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <AttachMoney sx={{ mr: 1 }} />
                      Payment Information
                    </Typography>
                    <Typography><strong>Price per ticket:</strong> ${selectedBooking.price_per_ticket}</Typography>
                    <Typography><strong>Total Amount:</strong> ${selectedBooking.total_amount}</Typography>
                    <Typography><strong>Payment Method:</strong> {selectedBooking.payment_method}</Typography>
                    <Typography><strong>Booking Date:</strong> {formatDateTime(selectedBooking.booking_date)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <QrCode sx={{ mr: 1 }} />
                      Ticket Information
                    </Typography>
                    <Typography><strong>QR Code:</strong> {selectedBooking.qr_code}</Typography>
                    <Typography><strong>Status:</strong> 
                      <Chip
                        label={selectedBooking.status.toUpperCase()}
                        color={getStatusColor(selectedBooking.status)}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<QrCode />}>
            Download QR Code
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Booking Dialog */}
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

      {/* Snackbar for notifications */}
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

export default BookingManagement;


