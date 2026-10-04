import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Chip,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  PlayArrow,
  Close,
  LocationOn,
  Schedule,
  Language,
  Category,
  Star,
  AccessTime,
  CalendarToday,
  Person,
  ExpandMore,
  Theaters
} from '@mui/icons-material';
import { showApi, theaterApi } from '../services/apiService';

const MovieDetails = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
    fetchCities();
    fetchShowtimes();
  }, [movieId]);

  useEffect(() => {
    if (selectedCity || selectedDate) {
      fetchShowtimes();
    }
  }, [selectedCity, selectedDate]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const response = await showApi.getShow(movieId);

      if (response.data.success) {
        const show = response.data.data;

        // Transform backend data to match component format
        const transformedMovie = {
          id: show.show_id,
          title: show.title,
          poster_url: show.poster_url ? `http://localhost/cine/backend/${show.poster_url}` : 'https://via.placeholder.com/300x450?text=No+Poster',
          backdrop_url: show.backdrop_url ? `http://localhost/cine/backend/${show.backdrop_url}` : show.poster_url ? `http://localhost/cine/backend/${show.poster_url}` : 'https://via.placeholder.com/1920x800?text=No+Backdrop',
          trailer_url: show.trailer_url || 'https://www.youtube.com/embed/TcMBFSGVi1c',
          genre: show.genre ? show.genre.split(',').map(g => g.trim()) : ['General'],
          language: show.language || 'English',
          duration: parseInt(show.duration || 120),
          rating: parseFloat(show.rating || 7.5),
          release_date: show.date || new Date().toISOString().split('T')[0],
          director: show.director || 'Unknown',
          cast: show.cast ? show.cast.split(',').map((c, i) => ({
            name: c.trim(),
            character: 'Character',
            image: 'https://via.placeholder.com/185x278?text=Actor'
          })) : [],
          synopsis: show.synopsis || 'No description available.',
          production_company: show.production_company || 'Production Company',
          budget: show.budget || 'N/A',
          box_office: show.box_office || 'N/A',
          awards: show.awards ? show.awards.split(',') : [],
          age_rating: show.age_rating || 'PG-13',
          country: show.country || 'Rwanda',
          reviews_count: parseInt(show.reviews_count || 100),
          user_rating: parseFloat(show.user_rating || 4.2)
        };

        setMovie(transformedMovie);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching movie details:', err);
      setError('Failed to load movie details');
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

  const fetchShowtimes = async () => {
    try {
      let response;

      if (selectedDate) {
        response = await showApi.getShowsByDate(selectedDate);
      } else {
        response = await showApi.getShows();
      }

      if (response.data.success) {
        // Filter shows for this movie and group by theater
        const movieShows = response.data.data.filter(show =>
          show.show_id == movieId || show.title === movie?.title
        );

        // Group by theater
        const theaterMap = {};
        movieShows.forEach(show => {
          const theaterKey = show.theater_id || show.theater_name;
          if (!theaterMap[theaterKey]) {
            theaterMap[theaterKey] = {
              theater_id: show.theater_id,
              theater_name: show.theater_name || 'Theater',
              city: show.city || 'Kigali',
              address: show.address || 'Address',
              auditorium: show.auditorium_name || 'Hall',
              capacity: parseInt(show.capacity || 150),
              times: []
            };
          }

          theaterMap[theaterKey].times.push({
            time: show.time,
            available_seats: parseInt(show.available_seats || 100),
            price: parseFloat(show.price || 3000),
            show_id: show.show_id
          });
        });

        let filteredShowtimes = Object.values(theaterMap);

        if (selectedCity) {
          filteredShowtimes = filteredShowtimes.filter(st => st.city === selectedCity);
        }

        setShowtimes(filteredShowtimes);
      }
    } catch (err) {
      console.error('Failed to load showtimes:', err);
    }
  };

  const handleBooking = (showId, theaterName, time) => {
    navigate(`/booking/${showId}?movie=${movie.title}&theater=${theaterName}&time=${time}`);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
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

  if (error || !movie) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Movie not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${movie.backdrop_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          mb: 4,
          p: 4,
          minHeight: 400
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={4}>
            <CardMedia
              component="img"
              image={movie.poster_url}
              alt={movie.title}
              sx={{
                width: '100%',
                maxWidth: 300,
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              {movie.title}
            </Typography>

            <Box sx={{ mb: 2 }}>
              {movie.genre.map((g, index) => (
                <Chip key={index} label={g} sx={{ mr: 1, mb: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Star sx={{ mr: 1, color: 'gold' }} />
                <Typography variant="h6">{movie.rating}/10</Typography>
                <Typography variant="body2" sx={{ ml: 1 }}>({movie.reviews_count} reviews)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTime sx={{ mr: 1 }} />
                <Typography>{formatDuration(movie.duration)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Language sx={{ mr: 1 }} />
                <Typography>{movie.language}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday sx={{ mr: 1 }} />
                <Typography>{new Date(movie.release_date).getFullYear()}</Typography>
              </Box>
            </Box>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              {movie.synopsis}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrow />}
                onClick={() => setTrailerOpen(true)}
                sx={{ bgcolor: 'red', '&:hover': { bgcolor: 'darkred' } }}
              >
                Watch Trailer
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                href="#showtimes"
              >
                Book Tickets
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        {/* Movie Information */}
        <Grid item xs={12} md={8}>
          {/* Cast & Crew */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Cast & Crew
            </Typography>
            <Typography variant="h6" gutterBottom color="text.secondary">
              Director: {movie.director}
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              {movie.cast.map((actor, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Card sx={{ textAlign: 'center' }}>
                    <Avatar
                      src={actor.image}
                      sx={{ width: 80, height: 80, mx: 'auto', mt: 2 }}
                    />
                    <CardContent>
                      <Typography variant="body2" fontWeight="bold">
                        {actor.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {actor.character}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Additional Information */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Movie Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <List>
                  <ListItem>
                    <ListItemText primary="Production Company" secondary={movie.production_company} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Budget" secondary={movie.budget} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Box Office" secondary={movie.box_office} />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} sm={6}>
                <List>
                  <ListItem>
                    <ListItemText primary="Age Rating" secondary={movie.age_rating} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Country" secondary={movie.country} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Awards" secondary={movie.awards.join(', ')} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Showtimes */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" id="showtimes">
              <Theaters sx={{ mr: 1 }} />
              Showtimes
            </Typography>

            {/* Filters */}
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select City</InputLabel>
                <Select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  label="Select City"
                >
                  <MenuItem value="">All Cities</MenuItem>
                  {cities.map((city) => (
                    <MenuItem key={city} value={city}>{city}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Showtimes List */}
            {showtimes.map((theater) => (
              <Accordion key={theater.theater_id} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {theater.theater_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <LocationOn sx={{ fontSize: 14, mr: 0.5 }} />
                      {theater.address}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {theater.auditorium} • Capacity: {theater.capacity}
                  </Typography>
                  <Grid container spacing={1}>
                    {theater.times.map((showtime, index) => (
                      <Grid item xs={6} key={index}>
                        <Button
                          variant="outlined"
                          fullWidth
                          size="small"
                          onClick={() => handleBooking(showtime.show_id, theater.theater_name, showtime.time)}
                          disabled={showtime.available_seats === 0}
                          sx={{
                            flexDirection: 'column',
                            py: 1,
                            '&:hover': { bgcolor: 'primary.light', color: 'white' }
                          }}
                        >
                          <Typography variant="body2" fontWeight="bold">
                            {showtime.time}
                          </Typography>
                          <Typography variant="caption">
                            {formatCurrency(showtime.price)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {showtime.available_seats} seats
                          </Typography>
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}

            {showtimes.length === 0 && (
              <Alert severity="info">
                No showtimes available for the selected filters.
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Trailer Dialog */}
      <Dialog
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {movie.title} - Official Trailer
          <IconButton onClick={() => setTrailerOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src={movie.trailer_url}
              title="Movie Trailer"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              allowFullScreen
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default MovieDetails;


