import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { LocationOn, Phone, Email, Star, Search } from '@mui/icons-material';
import { theaterApi } from '../services/apiService';

const Theaters = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTheaters();
  }, []);

  const fetchTheaters = async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      console.log('Fetching theaters...');
      const response = await theaterApi.getTheaters();
      console.log('Theater API response:', response);
      if (response.data.success) {
        setTheaters(response.data.data);
        console.log('Theaters loaded:', response.data.data);
      } else {
        setError(response.data.message || 'Failed to load theaters');
      }
    } catch (err) {
      console.error('Error fetching theaters:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || err.message || 'Failed to load theaters');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTheaters = theaters.filter(theater =>
    theater.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    theater.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    theater.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          🎭 Our Theaters
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find your nearest cinema and enjoy the latest movies in comfort
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search Bar */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <TextField
          fullWidth
          label="Search theaters..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
      </Paper>

      {/* Theaters Grid */}
      {filteredTheaters.length > 0 ? (
        <Grid container spacing={3}>
          {filteredTheaters.map((theater) => (
            <Grid item xs={12} md={6} key={theater.theater_id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {theater.name}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={theater.city}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={`${theater.total_auditoriums} Screens`}
                      variant="outlined"
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {theater.address}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {theater.contact_phone}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {theater.contact_email}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {theater.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Star sx={{ fontSize: 16, mr: 1, color: 'warning.main' }} />
                    <Typography variant="body2">
                      {theater.rating ? `${theater.rating}/5.0` : 'No ratings yet'}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    href={`/movies?city=${theater.city}`}
                    sx={{ mr: 1 }}
                  >
                    View Shows
                  </Button>
                  <Button
                    variant="outlined"
                    href={`/theaters/${theater.theater_id}`}
                  >
                    Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <LocationOn sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm ? 'No theaters found matching your search' : 'No theaters available'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? 'Try different search terms' : 'Check back later for new theater locations'}
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default Theaters;


