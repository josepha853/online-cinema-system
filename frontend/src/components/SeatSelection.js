import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  Card,
  CardContent,
  Badge,
  Tooltip,
  LinearProgress,
  Snackbar
} from '@mui/material';
import {
  EventSeat,
  Accessible,
  Star,
  CheckCircle
} from '@mui/icons-material';

const SeatSelection = ({
  auditorium,
  showId,
  onSeatsSelected,
  selectedSeats = [],
  maxSeats = 10,
  userWallet = 0,
  loyaltyPoints = 0
}) => {
  const [seatLayout, setSeatLayout] = useState([]);
  const [currentSelection, setCurrentSelection] = useState(selectedSeats);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTicketTypes, setSelectedTicketTypes] = useState({});
  const [seatPricing, setSeatPricing] = useState({});
  const [loading, setLoading] = useState(true);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const intervalRef = useRef(null);

  useEffect(() => {
    generateSeatLayout();
    loadTicketTypes();
    startRealTimeUpdates();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [auditorium, showId]);

  useEffect(() => {
    // Initialize ticket types for selected seats
    const initialTypes = {};
    currentSelection.forEach(seat => {
      if (!selectedTicketTypes[seat.id]) {
        initialTypes[seat.id] = seat.type === 'premium' ? 'premium' : 'adult';
      }
    });
    if (Object.keys(initialTypes).length > 0) {
      setSelectedTicketTypes(prev => ({ ...prev, ...initialTypes }));
    }
  }, [currentSelection]);

  const startRealTimeUpdates = () => {
    if (realTimeUpdates) {
      intervalRef.current = setInterval(() => {
        updateSeatAvailability();
      }, 5000); // Update every 5 seconds
    }
  };

  const updateSeatAvailability = async () => {
    try {
      // Simulate real-time seat updates
      const randomUpdates = Math.random() > 0.7; // 30% chance of updates
      if (randomUpdates) {
        setSeatLayout(prev => {
          const updated = [...prev];
          // Randomly occupy 1-2 seats
          const availableSeats = updated.flatMap(row =>
            row.seats.filter(seat => seat.status === 'available')
          );

          if (availableSeats.length > 0) {
            const seatsToUpdate = Math.min(2, availableSeats.length);
            for (let i = 0; i < seatsToUpdate; i++) {
              const randomSeat = availableSeats[Math.floor(Math.random() * availableSeats.length)];
              randomSeat.status = 'occupied';
            }

            setLastUpdate(new Date());
            setSnackbar({
              open: true,
              message: `Seat availability updated - ${seatsToUpdate} seat(s) just booked`,
              severity: 'info'
            });
          }

          return updated;
        });
      }
    } catch (error) {
      console.error('Failed to update seat availability:', error);
    }
  };

  const generateSeatLayout = () => {
    // Generate configurable seat layout based on auditorium type
    const layouts = {
      'standard': {
        rows: 12,
        seatsPerRow: 16,
        aisles: [4, 12], // Aisle positions
        premiumRows: [8, 9, 10], // Premium seating rows
        accessibleSeats: ['A1', 'A2', 'L1', 'L2'] // Wheelchair accessible
      },
      'premium': {
        rows: 10,
        seatsPerRow: 14,
        aisles: [4, 10],
        premiumRows: [6, 7, 8, 9],
        accessibleSeats: ['A1', 'A2', 'J1', 'J2']
      },
      'imax': {
        rows: 15,
        seatsPerRow: 20,
        aisles: [6, 14],
        premiumRows: [7, 8, 9, 10, 11],
        accessibleSeats: ['A1', 'A2', 'A3', 'O1', 'O2', 'O3']
      }
    };

    const config = layouts[auditorium?.type || 'standard'];
    const layout = [];
    const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Mock occupied seats (would come from API)
    const occupiedSeats = ['C5', 'C6', 'D8', 'D9', 'E12', 'F3', 'F4', 'G7', 'H15', 'I2', 'J10', 'J11'];

    for (let row = 0; row < config.rows; row++) {
      const rowLabel = rowLabels[row];
      const rowSeats = [];

      for (let seat = 1; seat <= config.seatsPerRow; seat++) {
        const seatId = `${rowLabel}${seat}`;
        const isAisle = config.aisles.includes(seat);
        const isPremium = config.premiumRows.includes(row + 1);
        const isAccessible = config.accessibleSeats.includes(seatId);
        const isOccupied = occupiedSeats.includes(seatId);

        rowSeats.push({
          id: seatId,
          row: rowLabel,
          number: seat,
          type: isPremium ? 'premium' : isAccessible ? 'accessible' : 'standard',
          status: isOccupied ? 'occupied' : 'available',
          price: isPremium ? 5000 : isAccessible ? 3000 : 3500,
          isAisle
        });
      }

      layout.push({
        row: rowLabel,
        seats: rowSeats
      });
    }

    setSeatLayout(layout);
    setLoading(false);
  };

  const loadTicketTypes = () => {
    const types = [
      {
        id: 'adult',
        name: 'Adult',
        price: 3500,
        description: 'Regular adult ticket',
        color: '#2196f3',
        discount: 0
      },
      {
        id: 'child',
        name: 'Child (3-12)',
        price: 2500,
        description: 'Children between 3-12 years',
        color: '#4caf50',
        discount: 0.29
      },
      {
        id: 'student',
        name: 'Student',
        price: 3000,
        description: 'Valid student ID required',
        color: '#ff9800',
        discount: 0.14
      },
      {
        id: 'senior',
        name: 'Senior (60+)',
        price: 2800,
        description: 'Senior citizens 60 and above',
        color: '#9c27b0',
        discount: 0.20
      },
      {
        id: 'premium',
        name: 'VIP Premium',
        price: 5500,
        description: 'Premium seating with extra comfort',
        color: '#f44336',
        discount: 0
      },
      {
        id: 'loyalty',
        name: 'Loyalty Member',
        price: 3150,
        description: 'Special price for loyalty members',
        color: '#795548',
        discount: 0.10
      }
    ];
    setTicketTypes(types);
  };

  const handleTicketTypeChange = (seatId, ticketTypeId) => {
    setSelectedTicketTypes(prev => ({
      ...prev,
      [seatId]: ticketTypeId
    }));
  };

  const handleSeatClick = (seat) => {
    if (seat.status === 'occupied') return;

    const isSelected = currentSelection.some(s => s.id === seat.id);
    let newSelection;

    if (isSelected) {
      // Deselect seat
      newSelection = currentSelection.filter(s => s.id !== seat.id);
    } else {
      // Select seat (check max limit)
      if (currentSelection.length >= maxSeats) {
        alert(`You can select maximum ${maxSeats} seats`);
        return;
      }
      newSelection = [...currentSelection, seat];
    }

    setCurrentSelection(newSelection);
    onSeatsSelected(newSelection);
  };

  const getSeatColor = (seat) => {
    const isSelected = currentSelection.some(s => s.id === seat.id);

    if (seat.status === 'occupied') return '#f44336'; // Red
    if (isSelected) return '#4caf50'; // Green
    if (seat.type === 'premium') return '#ff9800'; // Orange
    if (seat.type === 'accessible') return '#2196f3'; // Blue
    return '#e0e0e0'; // Gray (available)
  };

  const getSeatIcon = (seat) => {
    if (seat.type === 'accessible') return <Accessible />;
    if (seat.type === 'premium') return <Star />;
    return <EventSeat />;
  };

  const calculateTotal = () => {
    let total = 0;
    let loyaltyDiscount = 0;

    currentSelection.forEach(seat => {
      const ticketTypeId = selectedTicketTypes[seat.id] || 'adult';
      const ticketType = ticketTypes.find(t => t.id === ticketTypeId);

      if (ticketType) {
        const basePrice = seat.type === 'premium' ? ticketType.price * 1.2 : ticketType.price;
        const discountedPrice = basePrice * (1 - ticketType.discount);
        total += discountedPrice;
      } else {
        total += seat.price;
      }
    });

    // Apply loyalty points discount (100 points = 1 RWF)
    if (loyaltyPoints > 0) {
      loyaltyDiscount = Math.min(loyaltyPoints, total * 0.1); // Max 10% discount from points
      total -= loyaltyDiscount;
    }

    return { total: Math.max(0, total), loyaltyDiscount };
  };

  const getTicketPrice = (seat, ticketTypeId) => {
    const ticketType = ticketTypes.find(t => t.id === ticketTypeId);
    if (!ticketType) return seat.price;

    const basePrice = seat.type === 'premium' ? ticketType.price * 1.2 : ticketType.price;
    return basePrice * (1 - ticketType.discount);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return <Typography>Loading seat layout...</Typography>;
  }

  return (
    <Box>
      {/* Screen */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Paper
          sx={{
            py: 2,
            px: 4,
            bgcolor: 'primary.main',
            color: 'white',
            borderRadius: '20px 20px 0 0',
            maxWidth: 400,
            mx: 'auto'
          }}
        >
          <Typography variant="h6">SCREEN</Typography>
        </Paper>
      </Box>

      {/* Seat Layout */}
      <Box sx={{ mb: 4, overflowX: 'auto' }}>
        <Box sx={{ minWidth: 800, mx: 'auto' }}>
          {seatLayout.map((row, rowIndex) => (
            <Box key={row.row} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {/* Row Label */}
              <Typography
                variant="h6"
                sx={{
                  width: 30,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  mr: 2
                }}
              >
                {row.row}
              </Typography>

              {/* Seats */}
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {row.seats.map((seat, seatIndex) => [
                  <Button
                    key={seat.id}
                    variant="contained"
                    size="small"
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.status === 'occupied'}
                    sx={{
                      minWidth: 35,
                      width: 35,
                      height: 35,
                      p: 0,
                      bgcolor: getSeatColor(seat),
                      color: seat.status === 'occupied' ? 'white' : 'black',
                      '&:hover': {
                        bgcolor: seat.status === 'occupied' ? '#f44336' : '#4caf50'
                      },
                      '&.Mui-disabled': {
                        bgcolor: '#f44336',
                        color: 'white'
                      }
                    }}
                    title={`${seat.id} - ${formatCurrency(seat.price)} - ${seat.type}`}
                  >
                    {getSeatIcon(seat)}
                  </Button>,
                  seat.isAisle && <Box key={`aisle-${seat.id}`} sx={{ width: 20 }} />
                ].filter(Boolean))}
              </Box>

              {/* Row Label (Right side) */}
              <Typography
                variant="h6"
                sx={{
                  width: 30,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  ml: 2
                }}
              >
                {row.row}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Legend */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Seat Legend</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventSeat sx={{ color: '#e0e0e0' }} />
              <Typography variant="body2">Available</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventSeat sx={{ color: '#4caf50' }} />
              <Typography variant="body2">Selected</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventSeat sx={{ color: '#f44336' }} />
              <Typography variant="body2">Occupied</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Star sx={{ color: '#ff9800' }} />
              <Typography variant="body2">Premium</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Accessible sx={{ color: '#2196f3' }} />
              <Typography variant="body2">Accessible</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Real-time Status Bar */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              🔄 Real-time updates: {realTimeUpdates ? 'ON' : 'OFF'}
            </Typography>
            <Typography variant="body2">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </Typography>
          </Box>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setRealTimeUpdates(!realTimeUpdates)}
            sx={{ color: 'white', borderColor: 'white' }}
          >
            {realTimeUpdates ? 'Disable' : 'Enable'} Updates
          </Button>
        </Box>
      </Paper>

      {/* Ticket Categories */}
      {ticketTypes.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Ticket Categories</Typography>
          <Grid container spacing={2}>
            {ticketTypes.map((type) => (
              <Grid item xs={12} sm={6} md={4} key={type.id}>
                <Card
                  sx={{
                    border: 2,
                    borderColor: type.color,
                    bgcolor: `${type.color}15`
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: type.color }}>
                      {type.name}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {formatCurrency(type.price)}
                    </Typography>
                    {type.discount > 0 && (
                      <Chip
                        label={`${Math.round(type.discount * 100)}% OFF`}
                        size="small"
                        color="success"
                        sx={{ mt: 1 }}
                      />
                    )}
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {type.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Selected Seats Summary */}
      {currentSelection.length > 0 && (
        <Paper sx={{ p: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <Typography variant="h6" gutterBottom>
            <CheckCircle sx={{ mr: 1 }} />
            Selected Seats ({currentSelection.length})
          </Typography>

          {/* Seat Selection with Ticket Types */}
          <Box sx={{ mb: 2 }}>
            {currentSelection.map((seat) => {
              const ticketTypeId = selectedTicketTypes[seat.id] || 'adult';
              const ticketType = ticketTypes.find(t => t.id === ticketTypeId);
              const price = getTicketPrice(seat, ticketTypeId);

              return (
                <Box key={seat.id} sx={{ mb: 2, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Seat {seat.id} {seat.type === 'premium' && '⭐'}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => handleSeatClick(seat)}
                      sx={{ color: 'white', minWidth: 'auto', p: 0.5 }}
                    >
                      ✕
                    </Button>
                  </Box>

                  <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                    <InputLabel sx={{ color: 'white' }}>Ticket Type</InputLabel>
                    <Select
                      value={ticketTypeId}
                      onChange={(e) => handleTicketTypeChange(seat.id, e.target.value)}
                      label="Ticket Type"
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                        '& .MuiSvgIcon-root': { color: 'white' }
                      }}
                    >
                      {ticketTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <span>{type.name}</span>
                            <span>{formatCurrency(getTicketPrice(seat, type.id))}</span>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Typography variant="body2">
                    Price: {formatCurrency(price)}
                    {ticketType?.discount > 0 && (
                      <Chip
                        label={`${Math.round(ticketType.discount * 100)}% OFF`}
                        size="small"
                        color="success"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />

          {/* Total Calculation */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal:</Typography>
              <Typography>{formatCurrency(calculateTotal().total + calculateTotal().loyaltyDiscount)}</Typography>
            </Box>

            {calculateTotal().loyaltyDiscount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Loyalty Discount:</Typography>
                <Typography>-{formatCurrency(calculateTotal().loyaltyDiscount)}</Typography>
              </Box>
            )}

            {loyaltyPoints > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Available Points:</Typography>
                <Typography variant="body2">{loyaltyPoints} pts</Typography>
              </Box>
            )}

            <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                Total: {formatCurrency(calculateTotal().total)}
              </Typography>
              <Typography variant="body2">
                {maxSeats - currentSelection.length} more seats available
              </Typography>
            </Box>

            {userWallet > 0 && (
              <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                <Typography variant="body2">
                  💰 Wallet Balance: {formatCurrency(userWallet)}
                  {userWallet >= calculateTotal().total && (
                    <Chip label="Sufficient funds" color="success" size="small" sx={{ ml: 1 }} />
                  )}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      )}

      {/* Snackbar for real-time updates */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />

      {currentSelection.length === 0 && (
        <Alert severity="info">
          Please select your seats to continue with the booking.
        </Alert>
      )}
    </Box>
  );
};

export default SeatSelection;


