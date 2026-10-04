import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
  Alert
} from '@mui/material';
import {
  EventSeat,
  WeekendOutlined,
  Close
} from '@mui/icons-material';

const SeatingMap = ({ 
  showId, 
  onSeatSelect, 
  selectedSeats = [], 
  maxSeats = 8,
  onBookingConfirm 
}) => {
  const [seatMap, setSeatMap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  // Mock seating data - in real app, fetch from API
  useEffect(() => {
    const generateSeatMap = () => {
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const seatsPerRow = 12;
      const map = [];

      rows.forEach(row => {
        const rowSeats = [];
        for (let i = 1; i <= seatsPerRow; i++) {
          const seatId = `${row}${i}`;
          const isReserved = Math.random() < 0.2; // 20% chance of being reserved
          const isVIP = row <= 'C'; // First 3 rows are VIP
          
          rowSeats.push({
            id: seatId,
            row: row,
            number: i,
            status: isReserved ? 'reserved' : 'available',
            type: isVIP ? 'vip' : 'standard',
            price: isVIP ? 25 : 15
          });
        }
        map.push(rowSeats);
      });

      setSeatMap(map);
      setLoading(false);
    };

    generateSeatMap();
  }, [showId]);

  useEffect(() => {
    const total = selectedSeats.reduce((sum, seatId) => {
      const seat = findSeatById(seatId);
      return sum + (seat ? seat.price : 0);
    }, 0);
    setTotalPrice(total);
  }, [selectedSeats, seatMap]);

  const findSeatById = (seatId) => {
    for (const row of seatMap) {
      const seat = row.find(s => s.id === seatId);
      if (seat) return seat;
    }
    return null;
  };

  const handleSeatClick = (seat) => {
    if (seat.status === 'reserved') return;

    const isSelected = selectedSeats.includes(seat.id);
    
    if (isSelected) {
      // Remove seat
      onSeatSelect(selectedSeats.filter(id => id !== seat.id));
    } else {
      // Add seat (check max limit)
      if (selectedSeats.length < maxSeats) {
        onSeatSelect([...selectedSeats, seat.id]);
      }
    }
  };

  const getSeatColor = (seat) => {
    if (seat.status === 'reserved') return '#f44336'; // Red
    if (selectedSeats.includes(seat.id)) return '#4caf50'; // Green
    if (seat.type === 'vip') return '#ff9800'; // Orange
    return '#2196f3'; // Blue
  };

  const getSeatIcon = (seat) => {
    if (seat.type === 'vip') {
      return <WeekendOutlined />;
    }
    return <EventSeat />;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography>Loading seating map...</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom align="center">
        🎬 SCREEN
      </Typography>
      
      {/* Screen representation */}
      <Box 
        sx={{ 
          height: 8, 
          backgroundColor: 'grey.300', 
          borderRadius: 1, 
          mb: 4,
          mx: 'auto',
          width: '80%'
        }} 
      />

      {/* Legend */}
      <Box display="flex" justifyContent="center" gap={2} mb={3} flexWrap="wrap">
        <Chip 
          icon={<EventSeat />} 
          label="Available ($15)" 
          sx={{ backgroundColor: '#2196f3', color: 'white' }}
          size="small"
        />
        <Chip 
          icon={<WeekendOutlined />} 
          label="VIP ($25)" 
          sx={{ backgroundColor: '#ff9800', color: 'white' }}
          size="small"
        />
        <Chip 
          icon={<EventSeat />} 
          label="Selected" 
          sx={{ backgroundColor: '#4caf50', color: 'white' }}
          size="small"
        />
        <Chip 
          icon={<Close />} 
          label="Reserved" 
          sx={{ backgroundColor: '#f44336', color: 'white' }}
          size="small"
        />
      </Box>

      {/* Seating Map */}
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        {seatMap.map((row, rowIndex) => (
          <Box key={rowIndex} display="flex" justifyContent="center" mb={1}>
            {/* Row Label */}
            <Typography 
              variant="body2" 
              sx={{ 
                minWidth: 20, 
                textAlign: 'center', 
                alignSelf: 'center',
                fontWeight: 'bold'
              }}
            >
              {row[0]?.row}
            </Typography>
            
            {/* Seats */}
            {row.map((seat, seatIndex) => (
              <Button
                key={seat.id}
                variant="contained"
                size="small"
                onClick={() => handleSeatClick(seat)}
                disabled={seat.status === 'reserved'}
                sx={{
                  minWidth: 35,
                  height: 35,
                  m: 0.25,
                  p: 0,
                  backgroundColor: getSeatColor(seat),
                  '&:hover': {
                    backgroundColor: seat.status === 'reserved' 
                      ? getSeatColor(seat) 
                      : `${getSeatColor(seat)}dd`,
                  },
                  '&.Mui-disabled': {
                    backgroundColor: getSeatColor(seat),
                    color: 'white'
                  }
                }}
              >
                {getSeatIcon(seat)}
              </Button>
            ))}
            
            {/* Aisle gap in the middle */}
            {rowIndex < seatMap.length - 1 && (
              <Box sx={{ width: 20 }} />
            )}
          </Box>
        ))}
      </Box>

      {/* Selection Summary */}
      {selectedSeats.length > 0 && (
        <Box mt={3}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Selected Seats:</strong> {selectedSeats.join(', ')}
            </Typography>
            <Typography variant="body2">
              <strong>Total Price:</strong> ${totalPrice}
            </Typography>
            <Typography variant="caption" display="block">
              Maximum {maxSeats} seats allowed per booking
            </Typography>
          </Alert>
          
          <Box display="flex" justifyContent="center" gap={2}>
            <Button 
              variant="outlined" 
              onClick={() => onSeatSelect([])}
            >
              Clear Selection
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => onBookingConfirm && onBookingConfirm(selectedSeats, totalPrice)}
            >
              Proceed to Booking
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default SeatingMap;
