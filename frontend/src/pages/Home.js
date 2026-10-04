import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import Header from '../components/Header';
import {
  PlayArrow,
  AccessTime,
  CalendarToday,
  LocationOn,
  Star,
  Login as LoginIcon,
  PersonAdd,
  DarkMode,
  LightMode
} from '@mui/icons-material';
// Import movie poster images
import cinema1 from '../assets/cimena1.jpg';
import cinema2 from '../assets/cinema2.jpg';
import cinema3 from '../assets/cinema3.jpg';
import cinema4 from '../assets/cinema4.jpg';
import cinema5 from '../assets/cinema5.jpg';
import cinema6 from '../assets/cinema6.jpg';

const Home = ({ darkMode, toggleDarkMode }) => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    // Mock data - replace with actual API call
    const mockMovies = [
      {
        id: 1,
        title: 'Avengers: Endgame',
        genre: 'Action/Adventure',
        duration: 181,
        rating: 4.8,
        language: 'English',
        poster: cinema1,
        description: 'The epic conclusion to the Infinity Saga that will forever change the Marvel Cinematic Universe.',
        showtimes: ['14:00', '17:30', '21:00'],
        theaters: ['Grand Cinema Hall 1', 'Royal Theater Screen 2'],
        price: 'From RWF 2,500'
      },
      {
        id: 2,
        title: 'Spider-Man: No Way Home',
        genre: 'Action/Adventure',
        duration: 148,
        rating: 4.6,
        language: 'English',
        poster: cinema2,
        description: 'Spider-Man faces villains from across the multiverse in this thrilling adventure.',
        showtimes: ['15:30', '18:45', '22:00'],
        theaters: ['City Cinema Hall A', 'Grand Cinema Hall 2'],
        price: 'From RWF 2,800'
      },
      {
        id: 3,
        title: 'The Batman',
        genre: 'Action/Crime',
        duration: 176,
        rating: 4.4,
        language: 'English',
        poster: cinema3,
        description: 'A new take on the Dark Knight as he uncovers corruption in Gotham City.',
        showtimes: ['16:00', '19:30'],
        theaters: ['Royal Theater Screen 1'],
        price: 'From RWF 2,200'
      },
      {
        id: 4,
        title: 'Top Gun: Maverick',
        genre: 'Action/Drama',
        duration: 130,
        rating: 4.7,
        language: 'English',
        poster: cinema4,
        description: 'Maverick returns to the danger zone for one last mission.',
        showtimes: ['14:30', '20:15'],
        theaters: ['Grand Cinema IMAX'],
        price: 'From RWF 3,500'
      },
      {
        id: 5,
        title: 'Ubwiyunge',
        genre: 'Drama/History',
        duration: 120,
        rating: 4.9,
        language: 'Kinyarwanda',
        poster: cinema5,
        description: 'A powerful story of reconciliation in Rwanda, exploring themes of forgiveness and healing.',
        showtimes: ['15:00', '18:00'],
        theaters: ['Kigali Cultural Center'],
        price: 'From RWF 1,500'
      },
      {
        id: 6,
        title: 'amataha',
        genre: 'Drama/War',
        duration: 95,
        rating: 4.5,
        language: 'Kinyarwanda/French',
        poster: cinema6,
        description: 'A compelling story of war and reconciliation, depicting Rwanda\'s journey through conflict to peace.',
        showtimes: ['16:30', '19:00'],
        theaters: ['Rwanda Cinema'],
        price: 'From RWF 1,800'

      }
    ];
    setMovies(mockMovies);
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleBookNow = () => {
    setSelectedMovie(null);
    setLoginDialogOpen(true);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <>
      {/* Single Header Component */}
      <Header
        isAuthenticated={false}
        user={null}
        onLogout={() => { }}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Welcome to CinemaHub! 🎭
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Choose your favorite movies and book your tickets online
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We have the latest movies, Rwandan films, and much more!
          </Typography>
        </Box>

        {/* Movies Section */}
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
          🎬 Now Showing
        </Typography>

        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} key={movie.id}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
                onClick={() => handleMovieClick(movie)}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={movie.poster}
                  alt={movie.title}
                />
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom noWrap>
                    {movie.title}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Rating value={movie.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary">
                      ({movie.rating})
                    </Typography>
                  </Box>

                  <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                    <Chip label={movie.genre} size="small" color="primary" variant="outlined" />
                    <Chip label={movie.language} size="small" color="secondary" variant="outlined" />
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {formatDuration(movie.duration)}
                    </Typography>
                  </Box>

                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {movie.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Features Section */}
        <Box sx={{ mt: 8, mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom textAlign="center">
            Why Choose CinemaHub? 🌟
          </Typography>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h2">🎫</Typography>
                <Typography variant="h6" gutterBottom>
                  Easy Booking
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Book your tickets online quickly and easily
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h2">🏆</Typography>
                <Typography variant="h6" gutterBottom>
                  Great Movies
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We have the latest Hollywood movies and great Rwandan films
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h2">💰</Typography>
                <Typography variant="h6" gutterBottom>
                  Great Prices
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Affordable prices and earn loyalty points with every booking
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Movie Details Dialog */}
      <Dialog
        open={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedMovie && (
          <>
            <DialogTitle>
              <Typography variant="h5" component="h2">
                {selectedMovie.title}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Rating value={selectedMovie.rating} precision={0.1} size="small" readOnly />
                <Typography variant="body2" color="text.secondary">
                  ({selectedMovie.rating}) • {selectedMovie.genre} • {formatDuration(selectedMovie.duration)}
                </Typography>
              </Box>
            </DialogTitle>

            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <img
                    src={selectedMovie.poster}
                    alt={selectedMovie.title}
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                </Grid>

                <Grid item xs={12} md={8}>
                  <Typography variant="body1" paragraph>
                    {selectedMovie.description}
                  </Typography>

                  <Box mb={2}>
                    <Typography variant="h6" gutterBottom>
                      <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                      Showtimes
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {selectedMovie.showtimes.map((time, index) => (
                        <Chip key={index} label={time} variant="outlined" />
                      ))}
                    </Box>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="h6" gutterBottom>
                      <LocationOn fontSize="small" sx={{ mr: 1 }} />
                      Theaters
                    </Typography>
                    {selectedMovie.theaters.map((theater, index) => (
                      <Typography key={index} variant="body2" color="text.secondary">
                        • {theater}
                      </Typography>
                    ))}
                  </Box>

                  <Typography variant="h5" color="primary" fontWeight="bold">
                    {selectedMovie.price}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setSelectedMovie(null)}>
                Close
              </Button>
              <Button
                variant="contained"
                onClick={handleBookNow}
                startIcon={<PlayArrow />}
              >
                Book Tickets
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Login Prompt Dialog */}
      <Dialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)}>
        <DialogTitle>
          Login or Register
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            To book tickets, you need to login or register to our system first.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            It's easy and takes just a few minutes!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoginDialogOpen(false)}>
            Close
          </Button>
          <Button onClick={handleRegister} variant="outlined">
            Register
          </Button>
          <Button onClick={handleLogin} variant="contained">
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Home;


