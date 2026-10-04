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
  DialogActions,
  TextField,
  InputAdornment,
  Paper,
  Tabs,
  Tab,
  Stack,
  Divider,
  Avatar
} from '@mui/material';
import Header from '../components/Header';
import {
  PlayArrow,
  AccessTime,
  CalendarToday,
  LocationOn,
  Star,
  Search,
  ConfirmationNumber,
  AccountBalanceWallet,
  QrCodeScanner,
  Loyalty,
  Theaters,
  Movie as MovieIcon,
  Shield,
  LocalActivity,
  ArrowForward,
  Close
} from '@mui/icons-material';

// Poster assets
import cinema1 from '../assets/cimena1.jpg';
import cinema2 from '../assets/cinema2.jpg';
import cinema3 from '../assets/cinema3.jpg';
import cinema4 from '../assets/cinema4.jpg';
import cinema5 from '../assets/cinema5.jpg';
import cinema6 from '../assets/cinema6.jpg';

const initialMovies = [
  {
    id: 1,
    title: 'Avengers: Endgame',
    genre: 'Action',
    duration: 181,
    rating: 4.8,
    language: 'English',
    poster: cinema1,
    tagline: 'Part of the journey is the end.',
    description: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos’ actions.',
    showtimes: ['14:00', '17:30', '21:00'],
    theaters: ['CineMax Kigali', 'Century Cinemax'],
    price: 'RWF 5,000',
    trailerId: 'TcMBFSGVi1c',
    featured: true
  },
  {
    id: 2,
    title: 'Spider-Man: No Way Home',
    genre: 'Action',
    duration: 148,
    rating: 4.7,
    language: 'English',
    tagline: 'The Multiverse unleashed.',
    poster: cinema2,
    description: 'With Spider-Man identity revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.',
    showtimes: ['15:30', '18:45', '22:00'],
    theaters: ['CineMax Kigali', 'Century Cinemax'],
    price: 'RWF 5,000',
    trailerId: 'JfVOs4VSpmA',
    featured: true
  },
  {
    id: 3,
    title: 'The Batman',
    genre: 'Action',
    duration: 176,
    rating: 4.5,
    language: 'English',
    tagline: 'Unmask the truth.',
    poster: cinema3,
    description: 'In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.',
    showtimes: ['16:00', '19:30'],
    theaters: ['Century Cinemax'],
    price: 'RWF 4,500',
    trailerId: 'mqqft2x_Aa4',
    featured: false
  },
  {
    id: 4,
    title: 'Top Gun: Maverick',
    genre: 'Drama',
    duration: 130,
    rating: 4.9,
    language: 'English',
    tagline: 'Feel the need for speed.',
    poster: cinema4,
    description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past leading TOP GUN elite graduates.',
    showtimes: ['14:30', '20:15'],
    theaters: ['CineMax Kigali'],
    price: 'RWF 5,500',
    trailerId: 'giXco2jaZ_4',
    featured: true
  },
  {
    id: 5,
    title: 'Interstellar',
    genre: 'Sci-Fi',
    duration: 169,
    rating: 4.9,
    language: 'English',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    poster: cinema5,
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    showtimes: ['15:00', '19:00', '22:30'],
    theaters: ['CineMax Kigali', 'Century Cinemax'],
    price: 'RWF 6,000',
    trailerId: 'zSWdZVtXT7E',
    featured: true
  },
  {
    id: 6,
    title: 'Inception',
    genre: 'Sci-Fi',
    duration: 148,
    rating: 4.8,
    language: 'English',
    tagline: 'Your mind is the scene of the crime.',
    poster: cinema6,
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    showtimes: ['16:30', '20:30'],
    theaters: ['Century Cinemax'],
    price: 'RWF 4,500',
    trailerId: 'YoHD9XEInc0',
    featured: false
  }
];

const genres = ['All', 'Action', 'Sci-Fi', 'Drama', 'Comedy', 'Horror'];

const Home = ({ darkMode, toggleDarkMode }) => {
  const [movies] = useState(initialMovies);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerMovie, setTrailerMovie] = useState(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const navigate = useNavigate();

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          movie.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || movie.genre.toLowerCase() === selectedGenre.toLowerCase();
    return matchesSearch && matchesGenre;
  });

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleBookNow = (movieId) => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(`/booking/${movieId || 1}`);
    } else {
      setSelectedMovie(null);
      setLoginDialogOpen(true);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <>
      <Header
        isAuthenticated={false}
        user={null}
        onLogout={() => {}}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Hero Section */}
      <Box
        sx={{
          background: darkMode
            ? 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), rgba(255, 255, 255, 0))'
            : 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)',
          color: 'white',
          pt: { xs: 8, md: 10 },
          pb: { xs: 8, md: 12 },
          px: 2,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: { xs: '0 0 24px 24px', md: '0 0 40px 40px' },
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}
      >
        <Container maxWidth="lg">
          <Chip
            icon={<Star sx={{ color: '#ffd700 !important' }} />}
            label="Experience Cinema in 4K Ultra HD & Dolby Atmos"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              fontWeight: 600,
              mb: 3,
              px: 1,
              py: 0.5
            }}
          />

          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.4rem', sm: '3.4rem', md: '4.2rem' },
              letterSpacing: '-0.5px',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            Book Movie Tickets <br />
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(45deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Anytime, Anywhere.
            </Box>
          </Typography>

          <Typography
            variant="h6"
            sx={{
              maxWidth: 720,
              mx: 'auto',
              mb: 4,
              opacity: 0.9,
              fontWeight: 400,
              lineHeight: 1.6
            }}
          >
            Discover current box-office hits, choose premium seats with our real-time interactive map, and receive instant digital QR code tickets.
          </Typography>

          {/* Quick Action Buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            sx={{ mb: 5 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<ConfirmationNumber />}
              onClick={() => navigate('/login')}
              sx={{
                bgcolor: '#ff3366',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.05rem',
                fontWeight: 700,
                borderRadius: '50px',
                boxShadow: '0 8px 25px rgba(255, 51, 102, 0.4)',
                '&:hover': { bgcolor: '#e62e5c' }
              }}
            >
              Browse & Book Tickets
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<PlayArrow />}
              onClick={() => setTrailerMovie(movies[0])}
              sx={{
                borderColor: 'rgba(255,255,255,0.6)',
                color: 'white',
                px: 3.5,
                py: 1.5,
                fontSize: '1.05rem',
                fontWeight: 600,
                borderRadius: '50px',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Watch Featured Trailer
            </Button>
          </Stack>

          {/* Highlights Ribbon */}
          <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
            {[
              { icon: <Theaters />, label: 'Multiple Cities & Theaters' },
              { icon: <QrCodeScanner />, label: 'Instant QR Tickets' },
              { icon: <AccountBalanceWallet />, label: 'Wallet & Card Payments' },
              { icon: <Loyalty />, label: 'Loyalty Rewards Points' }
            ].map((feat, idx) => (
              <Grid item xs={6} sm={3} key={idx}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  {feat.icon}
                  <Typography variant="body2" fontWeight={600}>
                    {feat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth={false} sx={{ maxWidth: '1480px', mt: 5, mb: 10, px: { xs: 2, md: 3 } }}>
        {/* Search & Filter Bar */}
        <Paper
          elevation={3}
          sx={{
            p: 2.5,
            mb: 4,
            borderRadius: 3,
            background: darkMode ? 'rgba(26, 31, 58, 0.85)' : '#ffffff',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search movies by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="primary" fontSize="small" />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                {genres.map((genre) => (
                  <Chip
                    key={genre}
                    label={genre}
                    size="small"
                    clickable
                    color={selectedGenre === genre ? 'primary' : 'default'}
                    variant={selectedGenre === genre ? 'filled' : 'outlined'}
                    onClick={() => setSelectedGenre(genre)}
                    sx={{
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 0.5
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Section Title */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
          <Box>
            <Typography variant="overline" color="primary" fontWeight={800} letterSpacing={1.2}>
              NOW SHOWING IN CINEMAS
            </Typography>
            <Typography variant="h5" fontWeight={800}>
              Featured Movies
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''}
          </Typography>
        </Box>

        {/* 5-Column Responsive Movies Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(5, 1fr)'
            },
            gap: 2.5
          }}
        >
          {filteredMovies.map((movie) => (
            <Card
              key={movie.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.18)'
                }
              }}
            >
              {/* Poster Container */}
              <Box sx={{ position: 'relative', height: 230, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  image={movie.poster}
                  alt={movie.title}
                  sx={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                    '&:hover': {
                      transform: 'scale(1.06)'
                    }
                  }}
                />
                {/* Rating Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    bgcolor: 'rgba(0, 0, 0, 0.8)',
                    color: '#ffd700',
                    px: 1,
                    py: 0.3,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.3,
                    backdropFilter: 'blur(6px)',
                    fontWeight: 700,
                    fontSize: '0.78rem'
                  }}
                >
                  <Star sx={{ fontSize: 14 }} />
                  {movie.rating}
                </Box>

                {/* Genre Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    bgcolor: 'primary.main',
                    color: 'white',
                    px: 1,
                    py: 0.3,
                    borderRadius: 1.5,
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    textTransform: 'uppercase'
                  }}
                >
                  {movie.genre}
                </Box>

                {/* Play Trailer Overlay Button */}
                <Box
                  onClick={() => setTrailerMovie(movie)}
                  sx={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    bgcolor: 'rgba(255, 51, 102, 0.95)',
                    color: 'white',
                    p: 0.9,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(255, 51, 102, 0.5)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.12)',
                      bgcolor: '#ff3366'
                    }
                  }}
                >
                  <PlayArrow sx={{ fontSize: 18 }} />
                </Box>
              </Box>

              <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom noWrap sx={{ fontSize: '0.95rem' }}>
                  {movie.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1.5,
                    fontSize: '0.78rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.45
                  }}
                >
                  {movie.description}
                </Typography>

                <Stack direction="row" spacing={1.5} sx={{ mb: 1.5, color: 'text.secondary', fontSize: '0.75rem' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                    <AccessTime sx={{ fontSize: 14 }} />
                    {formatDuration(movie.duration)}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                    <Theaters sx={{ fontSize: 14 }} />
                    {movie.theaters.length} Halls
                  </Box>
                </Stack>

                <Box sx={{ mt: 'auto', pt: 1.5, borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.68rem' }}>
                      Price
                    </Typography>
                    <Typography variant="body2" fontWeight={800} color="primary" sx={{ fontSize: '0.85rem' }}>
                      {movie.price}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<LocalActivity sx={{ fontSize: '14px !important' }} />}
                    onClick={() => handleBookNow(movie.id)}
                    sx={{
                      borderRadius: 2,
                      px: 1.5,
                      py: 0.5,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'none'
                    }}
                  >
                    Book
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {filteredMovies.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No movies found matching "{searchQuery}"
            </Typography>
            <Button
              variant="outlined"
              onClick={() => { setSearchQuery(''); setSelectedGenre('All'); }}
              sx={{ mt: 2, borderRadius: 3 }}
            >
              Reset Filters
            </Button>
          </Box>
        )}
      </Container>

      {/* Trailer Modal */}
      <Dialog
        open={Boolean(trailerMovie)}
        onClose={() => setTrailerMovie(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden',
            bgcolor: '#000'
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            🎬 {trailerMovie?.title} — Official Trailer
          </Typography>
          <Button onClick={() => setTrailerMovie(null)} sx={{ color: 'white', minWidth: 'auto' }}>
            <Close />
          </Button>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: { xs: 260, sm: 420, md: 480 } }}>
          {trailerMovie && (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube-nocookie.com/embed/${trailerMovie.trailerId}?autoplay=1`}
              title={trailerMovie.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Login Prompt Dialog */}
      <Dialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1, width: 56, height: 56 }}>
            <ConfirmationNumber />
          </Avatar>
          <Typography variant="h5" fontWeight={700}>
            Ready to Book?
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Please log in or create an account to choose your seats, redeem loyalty points, and download digital tickets.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', gap: 1.5, px: 3, pb: 3 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{ borderRadius: 3, py: 1.2, fontWeight: 700 }}
          >
            Sign In to Continue
          </Button>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ borderRadius: 3, py: 1.2, fontWeight: 700 }}
          >
            Create Free Account
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Home;
