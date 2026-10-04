import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
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
  CheckCircle
} from '@mui/icons-material';
import SeatSelection from '../components/SeatSelection';
import WalletSystem from '../components/WalletSystem';
import QRCodeSystem from '../components/QRCodeSystem';
import { movieApi, bookingApi } from '../services/apiService';

const BookingPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeStep, setActiveStep] = useState(0);
  const [showDetails, setShowDetails] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [userWallet, setUserWallet] = useState(15000); // Mock wallet balance
  const [loyaltyPoints, setLoyaltyPoints] = useState(250); // Mock loyalty points
  const [finalBookingData, setFinalBookingData] = useState(null);

  const steps = ['Select Seats', 'Customer Details', 'Payment', 'Confirmation'];

  useEffect(() => {
    if (showId) {
      fetchShowDetails();
    }
  }, [showId]); // eslint-disable-line react-hooks/exhaustive-deps


  const fetchShowDetails = async () => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors

      console.log('Fetching movie with ID:', showId);
      const response = await movieApi.getMovie(showId);
      console.log('Movie API Response:', response.data);

      if (response.data.success) {
        const movie = response.data.data;
        console.log('Movie data:', movie);

        // Transform movie data to show format for booking
        const transformedShow = {
          id: movie.movie_id,
          movie_title: movie.title,
          theater_name: 'CinemaHub Kigali', // Default theater
          showtime: '7:00 PM', // Default showtime
          date: new Date().toISOString().split('T')[0], // Today's date
          auditorium: {
            name: 'Hall 1',
            type: 'standard',
            capacity: 150,
            id: 1
          },
          poster_url: movie.poster_url ? `http://localhost/cine/backend/${movie.poster_url}` : 'https://via.placeholder.com/300x450?text=No+Poster',
          duration: parseInt(movie.duration || 120),
          genre: movie.genre || 'General',
          language: movie.language || 'English',
          age_rating: movie.age_rating || 'PG-13'
        };

        console.log('Transformed show:', transformedShow);
        setShowDetails(transformedShow);
        setError(''); // Clear any errors
      } else {
        console.error('API returned success=false:', response.data.message);
        setError(response.data.message || 'Movie not found');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching movie details:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to load movie details. Please try again.');
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    if (activeStep === 1 && !validateCustomerInfo()) {
      return;
    }
    if (activeStep === 2 && !validatePayment()) {
      return;
    }

    if (activeStep === steps.length - 1) {
      handleBookingConfirmation();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateCustomerInfo = () => {
    const { firstName, lastName, email, phone } = customerInfo;
    if (!firstName || !lastName || !email || !phone) {
      alert('Please fill in all customer details');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return false;
    }
    if (paymentMethod === 'card') {
      const { cardNumber, expiryDate, cvv, cardName } = paymentDetails;
      if (!cardNumber || !expiryDate || !cvv || !cardName) {
        alert('Please fill in all card details');
        return false;
      }
    }
    return true;
  };

  const handleBookingConfirmation = async () => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors

      const total = calculateTotal();
      console.log('Starting booking confirmation...');
      console.log('Total amount:', total);
      console.log('Selected seats:', selectedSeats);
      console.log('Customer info:', customerInfo);
      console.log('Payment method:', paymentMethod);

      // Simulate booking creation (since BookingController doesn't exist yet)
      // In production, this would call the actual API
      const bookingId = 'BK' + Date.now().toString().slice(-6);
      console.log('Generated booking ID:', bookingId);

      // Simulate a small delay for realism
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update loyalty points (earn 1 point per 100 RWF spent)
      const pointsEarned = Math.floor(total / 100);
      setLoyaltyPoints(prev => prev + pointsEarned);

      // Create comprehensive booking data for display
      const finalBooking = {
        bookingId: bookingId,
        showId,
        movieTitle: showDetails.movie_title,
        theater: showDetails.theater_name,
        showtime: showDetails.showtime,
        date: showDetails.date,
        seats: selectedSeats.map(seat => seat.id),
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        totalAmount: total,
        paymentMethod,
        paymentStatus: 'completed',
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
      };

      console.log('Final booking data:', finalBooking);
      setBookingId(bookingId);
      setFinalBookingData(finalBooking);
      setBookingConfirmed(true);
      setActiveStep(3);
      console.log('Booking confirmed! Moving to step 3');

      setLoading(false);
    } catch (err) {
      console.error('Booking error:', err);
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Failed to confirm booking. Please try again.');
      setLoading(false);
    }
  };

  const handleSeatsSelected = (seats) => {
    setSelectedSeats(seats);
  };

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentDetailsChange = (field, value) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (date, time) => {
    return `${new Date(date).toLocaleDateString()} at ${time}`;
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <SeatSelection
            auditorium={showDetails?.auditorium}
            showId={showId}
            onSeatsSelected={handleSeatsSelected}
            selectedSeats={selectedSeats}
            userWallet={userWallet}
            loyaltyPoints={loyaltyPoints}
          />
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Customer Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={customerInfo.firstName}
                  onChange={(e) => handleCustomerInfoChange('firstName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={customerInfo.lastName}
                  onChange={(e) => handleCustomerInfoChange('lastName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={customerInfo.phone}
                  onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Payment Method</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    label="Payment Method"
                  >
                    <MenuItem value="wallet">
                      <AccountBalance sx={{ mr: 1 }} />
                      Wallet Balance ({formatCurrency(userWallet)})
                      {userWallet >= calculateTotal() && <CheckCircle color="success" sx={{ ml: 1 }} />}
                    </MenuItem>
                    <MenuItem value="card">
                      <CreditCard sx={{ mr: 1 }} />
                      Credit/Debit Card
                    </MenuItem>
                    <MenuItem value="momo">
                      <Phone sx={{ mr: 1 }} />
                      Mobile Money
                    </MenuItem>
                    <MenuItem value="bank">
                      <AccountBalance sx={{ mr: 1 }} />
                      Bank Transfer
                    </MenuItem>
                    <MenuItem value="cash">
                      <Person sx={{ mr: 1 }} />
                      Cash on Delivery (Cinema Pickup)
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {paymentMethod === 'card' && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Card Number"
                      value={paymentDetails.cardNumber}
                      onChange={(e) => handlePaymentDetailsChange('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      value={paymentDetails.expiryDate}
                      onChange={(e) => handlePaymentDetailsChange('expiryDate', e.target.value)}
                      placeholder="MM/YY"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      value={paymentDetails.cvv}
                      onChange={(e) => handlePaymentDetailsChange('cvv', e.target.value)}
                      placeholder="123"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Cardholder Name"
                      value={paymentDetails.cardName}
                      onChange={(e) => handlePaymentDetailsChange('cardName', e.target.value)}
                    />
                  </Grid>
                </>
              )}

              {paymentMethod === 'momo' && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    You will receive an SMS prompt to complete the payment via Mobile Money.
                  </Alert>
                </Grid>
              )}

              {paymentMethod === 'wallet' && (
                <Grid item xs={12}>
                  {userWallet >= calculateTotal() ? (
                    <Alert severity="success">
                      Sufficient wallet balance. Payment will be deducted from your wallet.
                    </Alert>
                  ) : (
                    <Alert severity="warning">
                      Insufficient wallet balance. Please top up your wallet or choose another payment method.
                      <Button
                        size="small"
                        sx={{ ml: 2 }}
                        onClick={() => {/* Open wallet top-up */ }}
                      >
                        Top Up Wallet
                      </Button>
                    </Alert>
                  )}
                </Grid>
              )}

              {paymentMethod === 'bank' && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    Bank transfer details will be provided after booking confirmation.
                  </Alert>
                </Grid>
              )}

              {paymentMethod === 'cash' && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    You can pay cash when picking up your tickets at the cinema. Please arrive at least 30 minutes before showtime.
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            {bookingConfirmed && finalBookingData ? (
              <>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                  <Typography variant="h4" gutterBottom color="success.main">
                    Booking Confirmed!
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Booking ID: {bookingId}
                  </Typography>
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Your tickets have been booked successfully. You will receive a confirmation email shortly.
                  </Alert>
                </Box>

                {/* QR Code Generation */}
                <QRCodeSystem
                  bookingData={finalBookingData}
                  mode="generate"
                />

                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/my-bookings')}
                    sx={{ mr: 2 }}
                  >
                    View My Bookings
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/movies')}
                  >
                    Book More Movies
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress size={60} />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Processing your booking and generating digital tickets...
                </Typography>
              </Box>
            )}
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  if (loading && !showDetails) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
          <Typography variant="body1" sx={{ ml: 2 }}>Loading movie details...</Typography>
        </Box>
      </Container>
    );
  }

  if (error && !showDetails) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/movies')}>
          Back to Movies
        </Button>
      </Container>
    );
  }

  if (!showDetails) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Movie not found</Alert>
        <Button variant="contained" onClick={() => navigate('/movies')} sx={{ mt: 2 }}>
          Back to Movies
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <img
              src={showDetails.poster_url}
              alt={showDetails.movie_title}
              style={{ width: '100%', maxWidth: 150, borderRadius: 8 }}
            />
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {showDetails.movie_title}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Chip label={showDetails.genre} sx={{ mr: 1 }} />
              <Chip label={showDetails.language} sx={{ mr: 1 }} />
              <Chip label={showDetails.age_rating} variant="outlined" />
            </Box>
            <List dense>
              <ListItem disablePadding>
                <ListItemIcon><LocationOn /></ListItemIcon>
                <ListItemText primary={showDetails.theater_name} />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon><Schedule /></ListItemIcon>
                <ListItemText primary={formatDateTime(showDetails.date, showDetails.showtime)} />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon><Movie /></ListItemIcon>
                <ListItemText primary={`${showDetails.auditorium.name} • ${showDetails.duration} mins`} />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Stepper */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>

          {/* Step Content */}
          <Paper sx={{ p: 3 }}>
            {renderStepContent(activeStep)}

            {/* Navigation Buttons */}
            {!bookingConfirmed && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : activeStep === steps.length - 1 ? (
                    'Confirm Booking'
                  ) : (
                    'Next'
                  )}
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Booking Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Booking Summary
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Movie</Typography>
              <Typography fontWeight="bold">{showDetails.movie_title}</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Theater</Typography>
              <Typography>{showDetails.theater_name}</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Date & Time</Typography>
              <Typography>{formatDateTime(showDetails.date, showDetails.showtime)}</Typography>
            </Box>

            {selectedSeats.length > 0 && (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Selected Seats</Typography>
                  <Box sx={{ mt: 1 }}>
                    {selectedSeats.map((seat) => (
                      <Chip
                        key={seat.id}
                        label={seat.id}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Tickets ({selectedSeats.length})
                  </Typography>
                  {selectedSeats.map((seat) => (
                    <Box key={seat.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">{seat.id}</Typography>
                      <Typography variant="body2">{formatCurrency(seat.price)}</Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight="bold">Total</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {formatCurrency(calculateTotal())}
                  </Typography>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookingPage;


