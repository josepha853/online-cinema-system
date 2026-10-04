import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  Search,
  Movie,
  LocationOn,
  CalendarToday,
  Star,
  AccessTime,
  Language,
  Category,
  ExpandMore,
  PlayArrow,
  Person,
  Schedule,
  BookOnline
} from '@mui/icons-material';
import { movieApi, theaterApi } from '../services/apiService';
import getMoviePoster from '../utils/imageHelper';

const Movies = () => {
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    date: ''
  });

  useEffect(() => {
    fetchShows();
    fetchCities();
  }, []);

  const fetchShows = async () => {
    try {
      setLoading(true);
      const response = await movieApi.getMovies();

      if (response.data.success) {
        // Transform movie data to show format
        const transformedShows = response.data.data.map(movie => ({
          show_id: movie.movie_id,
          title: movie.title,
          poster_url: movie.poster_url ? `http://localhost/cine/backend/${movie.poster_url}` : 'https://via.placeholder.com/300x450?text=No+Poster',
          genre: movie.genre || 'General',
          language: movie.language || 'English',
          duration: parseInt(movie.duration || 120),
          rating: parseFloat(movie.rating || 7.5),
          age_rating: movie.age_rating || 'PG-13',
          release_date: movie.release_date || new Date().toISOString().split('T')[0],
          synopsis: movie.description || 'No description available.',
          director: movie.director || 'Unknown',
          cast: movie.cast ? movie.cast.split(',').map(c => c.trim()) : [],
          type: 'movie',
          date: movie.release_date || new Date().toISOString().split('T')[0],
          time: '7:00 PM', // Default showtime
          theater_name: 'Available at all theaters',
          city: 'Kigali',
          theaters: [{
            theater_name: 'Available at all theaters',
            city: 'Kigali',
            showtimes: ['7:00 PM', '9:30 PM']
          }]
        }));

        setShows(transformedShows);
        setError(''); // Clear any previous errors
      } else {
        setError('No movies available at the moment');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to load movies. Please try again later.');
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await theaterApi.getCities();
      if (response.data.success) {
        setCities(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load cities:', err);
      // Fallback to default cities
      setCities(['Kigali', 'Butare', 'Gisenyi', 'Ruhengeri', 'Nyanza']);
    }
  };

  const filteredShows = shows.filter(show => {
    const matchesSearch = !filters.search ||
      show.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      show.genre.some(g => g.toLowerCase().includes(filters.search.toLowerCase())) ||
      show.cast.some(c => c.toLowerCase().includes(filters.search.toLowerCase()));

    const matchesCity = !filters.city ||
      show.theaters.some(theater => theater.city === filters.city);

    return matchesSearch && matchesCity;
  });

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value
    });
  };

  const handleSearch = async () => {
    // For now, just filter the existing movies locally
    // In the future, you can implement server-side search
    setLoading(false);
  };

  const clearFilters = () => {
    setFilters({ search: '', city: '', date: '' });
    fetchShows();
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          🎬 Movies & Shows
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover and book tickets for the latest movies and theatrical performances
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Search & Filter
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search movies..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>City</InputLabel>
              <Select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                label="City"
              >
                <MenuItem value="">All Cities</MenuItem>
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={handleSearch} fullWidth>
                Search
              </Button>
              <Button variant="outlined" onClick={clearFilters}>
                Clear
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Shows Grid */}
      {filteredShows.length > 0 ? (
        <Grid container spacing={3}>
          {filteredShows.map((show) => (
            <Grid item xs={12} sm={6} md={4} key={show.show_id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={getMoviePoster(show.poster_url) || 'https://via.placeholder.com/300x450?text=No+Poster'}
                    alt={show.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Star sx={{ fontSize: 16, mr: 0.5, color: 'gold' }} />
                    <Typography variant="body2">{show.rating}</Typography>
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {show.title}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={show.genre}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <Chip
                      label={show.language}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <Chip
                      label={show.type}
                      size="small"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(show.date).toLocaleDateString()} • {show.time}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {show.theater_name} • {show.city}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Duration: {show.duration} minutes
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate(`/movie/${show.show_id}`)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<BookOnline />}
                    onClick={() => navigate(`/booking/${show.show_id}`)}
                  >
                    Book Now
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Movie sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No shows found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or check back later for new releases
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default Movies;


