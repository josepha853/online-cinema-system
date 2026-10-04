import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Paper,
  Stack,
  Divider,
  Avatar,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from '@mui/material';
import Header from '../components/Header';
import {
  PlayArrow,
  AccessTime,
  LocationOn,
  Star,
  Search,
  ConfirmationNumber,
  AccountBalanceWallet,
  QrCodeScanner,
  Loyalty,
  Theaters,
  LocalActivity,
  Close,
  CheckCircle,
  CreditCard,
  PhoneAndroid,
  Redeem,
  CameraAlt,
  EventSeat,
  Person,
  DoneAll
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
    trailerId: 'TcMBFSGVi1c'
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
    trailerId: 'JfVOs4VSpmA'
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
    trailerId: 'mqqft2x_Aa4'
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
    trailerId: 'giXco2jaZ_4'
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
    trailerId: 'zSWdZVtXT7E'
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
    trailerId: 'YoHD9XEInc0'
  }
];

const genres = ['All', 'Action', 'Sci-Fi', 'Drama', 'Comedy', 'Horror'];

const sampleTickets = {
  'TICKET-AVENGERS-9821': {
    movie: 'Avengers: Endgame',
    theater: 'CineMax Kigali (Hall 1)',
    seat: 'Row D, Seat 7 (VIP)',
    date: 'Today, 17:30 PM',
    customer: 'Alice Customer (alice@example.com)',
    status: 'Valid & Paid',
    checkedIn: false
  },
  'TICKET-SPIDERMAN-4512': {
    movie: 'Spider-Man: No Way Home',
    theater: 'Century Cinemax (Screen 2)',
    seat: 'Row E, Seat 12 (Standard)',
    date: 'Today, 18:45 PM',
    customer: 'Bob Staff (bob@example.com)',
    status: 'Valid & Paid',
    checkedIn: false
  },
  'TICKET-BATMAN-7719': {
    movie: 'The Batman',
    theater: 'Century Cinemax (Premium Hall)',
    seat: 'Row C, Seat 4 (VIP)',
    date: 'Today, 19:30 PM',
    customer: 'Josepha M (josepha@gmail.com)',
    status: 'Valid & Paid',
    checkedIn: true
  }
};

const Home = ({ darkMode, toggleDarkMode }) => {
  const [movies] = useState(initialMovies);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [trailerMovie, setTrailerMovie] = useState(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  // Interactive Modals State for Hero Buttons
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [theatersModalOpen, setTheatersModalOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [loyaltyModalOpen, setLoyaltyModalOpen] = useState(false);

  // QR Scanner Simulation State
  const [ticketInput, setTicketInput] = useState('TICKET-AVENGERS-9821');
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const [checkInSuccess, setCheckInSuccess] = useState(false);

  // Wallet Simulation State
  const [topUpAmount, setTopUpAmount] = useState('10000');
  const [walletMethod, setWalletMethod] = useState('card');
  const [walletBalance, setWalletBalance] = useState(25000);
  const [walletTopUpMsg, setWalletTopUpMsg] = useState('');

  // Loyalty Calculation State
  const [spendingAmount, setSpendingAmount] = useState(15000);

  const navigate = useNavigate();

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          movie.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || movie.genre.toLowerCase() === selectedGenre.toLowerCase();
    return matchesSearch && matchesGenre;
  });

  const handleBookNow = (movieId) => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(`/booking/${movieId || 1}`);
    } else {
      setLoginDialogOpen(true);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // QR Scan Handler
  const handleScanTicket = (ticketIdToScan) => {
    const target = ticketIdToScan || ticketInput;
    setScanning(true);
    setScannedResult(null);
    setCheckInSuccess(false);

    setTimeout(() => {
      setScanning(false);
      if (sampleTickets[target]) {
        setScannedResult({ id: target, ...sampleTickets[target] });
      } else {
        setScannedResult({
          id: target || 'UNKNOWN-TICKET',
          movie: 'Custom Movie Booking',
          theater: 'CineMax Kigali',
          seat: 'Seat A-1 (Standard)',
          date: 'Today, 20:00 PM',
          customer: 'Verified Customer',
          status: 'Valid & Paid',
          checkedIn: false
        });
      }
    }, 800);
  };

  const handleConfirmCheckIn = () => {
    if (scannedResult) {
      setScannedResult({ ...scannedResult, checkedIn: true });
      setCheckInSuccess(true);
    }
  };

  // Wallet Top Up Handler
  const handleTopUpSubmit = () => {
    const amountNum = parseInt(topUpAmount, 10);
    if (amountNum > 0) {
      setWalletBalance((prev) => prev + amountNum);
      setWalletTopUpMsg(`Successfully credited RWF ${amountNum.toLocaleString()} to your Cinema Wallet!`);
      setTimeout(() => setWalletTopUpMsg(''), 4000);
    }
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
          pt: { xs: 7, md: 9 },
          pb: { xs: 7, md: 10 },
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
              mb: 2.5,
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
              fontSize: { xs: '2.3rem', sm: '3.2rem', md: '4rem' },
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
              mb: 3.5,
              opacity: 0.9,
              fontWeight: 400,
              fontSize: { xs: '0.95rem', md: '1.1rem' },
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
            sx={{ mb: 4 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<ConfirmationNumber />}
              onClick={() => navigate('/login')}
              sx={{
                bgcolor: '#ff3366',
                color: 'white',
                px: 3.5,
                py: 1.3,
                fontSize: '1rem',
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
                px: 3,
                py: 1.3,
                fontSize: '1rem',
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

          {/* 4 Interactive Feature Buttons */}
          <Grid container spacing={2} justifyContent="center" sx={{ mt: 1 }}>
            {[
              {
                icon: <Theaters />,
                label: 'Multiple Cities & Theaters',
                onClick: () => setTheatersModalOpen(true),
                subtitle: 'Explore Locations'
              },
              {
                icon: <QrCodeScanner />,
                label: 'Instant QR Tickets',
                onClick: () => { setQrModalOpen(true); handleScanTicket('TICKET-AVENGERS-9821'); },
                subtitle: 'Scan & Verify'
              },
              {
                icon: <AccountBalanceWallet />,
                label: 'Wallet & Card Payments',
                onClick: () => setWalletModalOpen(true),
                subtitle: 'Top-up & Checkout'
              },
              {
                icon: <Loyalty />,
                label: 'Loyalty Rewards Points',
                onClick: () => setLoyaltyModalOpen(true),
                subtitle: 'Earn & Redeem'
              }
            ].map((feat, idx) => (
              <Grid item xs={6} sm={3} key={idx}>
                <Box
                  onClick={feat.onClick}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                    p: 1.8,
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      bgcolor: 'rgba(255,255,255,0.22)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.25)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {feat.icon}
                    <Typography variant="body2" fontWeight={700}>
                      {feat.label}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.72rem' }}>
                    {feat.subtitle} (Click to open)
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
      </Container>

      {/* ================= 1. QR CODE SCANNER & VERIFIER MODAL ================= */}
      <Dialog
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
              <QrCodeScanner />
            </Avatar>
            <Typography variant="h6" fontWeight={700}>
              QR Ticket Scanner & Check-in
            </Typography>
          </Box>
          <IconButton onClick={() => setQrModalOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {/* Scanner Simulation Viewport */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              textAlign: 'center',
              borderRadius: 3,
              bgcolor: darkMode ? 'rgba(0,0,0,0.5)' : '#f8f9fa',
              border: '2px dashed',
              borderColor: scanning ? 'primary.main' : 'divider',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {scanning && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  bgcolor: '#ff3366',
                  boxShadow: '0 0 10px #ff3366',
                  animation: 'scan 1s infinite alternate'
                }}
              />
            )}
            <CameraAlt sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="subtitle2" fontWeight={700}>
              Camera Scanner Active
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Point QR code towards scanner or test with sample tickets below
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              {Object.keys(sampleTickets).map((ticketKey) => (
                <Chip
                  key={ticketKey}
                  label={ticketKey}
                  size="small"
                  clickable
                  variant={ticketInput === ticketKey ? 'filled' : 'outlined'}
                  color={ticketInput === ticketKey ? 'primary' : 'default'}
                  onClick={() => {
                    setTicketInput(ticketKey);
                    handleScanTicket(ticketKey);
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* Manual Input */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Or enter Ticket Code (e.g. TICKET-AVENGERS-9821)"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => handleScanTicket(ticketInput)}
              disabled={scanning}
              startIcon={<QrCodeScanner />}
            >
              {scanning ? 'Scanning...' : 'Verify'}
            </Button>
          </Box>

          {/* Scanned Verification Card */}
          {scannedResult && (
            <Card
              elevation={3}
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: scannedResult.checkedIn || checkInSuccess ? 'success.main' : 'primary.main',
                p: 2,
                bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : '#fff'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="subtitle1" fontWeight={800}>
                  🎬 {scannedResult.movie}
                </Typography>
                <Chip
                  label={scannedResult.checkedIn || checkInSuccess ? 'ALREADY CHECKED IN' : 'VALID TICKET'}
                  color={scannedResult.checkedIn || checkInSuccess ? 'warning' : 'success'}
                  size="small"
                  sx={{ fontWeight: 800 }}
                />
              </Box>

              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Ticket Reference
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {scannedResult.id}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Showtime & Date
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {scannedResult.date}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Location & Hall
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {scannedResult.theater}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Assigned Seat
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="secondary">
                    {scannedResult.seat}
                  </Typography>
                </Grid>
              </Grid>

              {checkInSuccess && (
                <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
                  Ticket validated successfully! Customer authorized for hall entry.
                </Alert>
              )}

              {!scannedResult.checkedIn && !checkInSuccess && (
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<DoneAll />}
                  onClick={handleConfirmCheckIn}
                  sx={{ mt: 2, borderRadius: 2, fontWeight: 700 }}
                >
                  Confirm Customer Entry
                </Button>
              )}
            </Card>
          )}
        </DialogContent>
      </Dialog>

      {/* ================= 2. THEATERS & LOCATIONS MODAL ================= */}
      <Dialog
        open={theatersModalOpen}
        onClose={() => setTheatersModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
              <Theaters />
            </Avatar>
            <Typography variant="h6" fontWeight={700}>
              Cinema Locations & Auditoriums
            </Typography>
          </Box>
          <IconButton onClick={() => setTheatersModalOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {[
              {
                name: 'CineMax Kigali',
                city: 'Kigali City',
                address: 'KN 4 Ave, Downtown Kigali',
                phone: '+250 788 123 456',
                halls: ['Hall 1 (100 seats, Dolby 7.1)', 'Hall 2 (80 seats, 4K Laser)'],
                amenities: 'Dolby Atmos, VIP Recliner Seats, Popcorn Bar, Wheelchair Access'
              },
              {
                name: 'Century Cinemax',
                city: 'Kigali (Kimihurura)',
                address: 'Kimihurura Heights, Kigali',
                phone: '+250 788 654 321',
                halls: ['Premium IMAX Hall (120 seats)', 'Screen 2 (90 seats)'],
                amenities: 'IMAX 3D Laser, Luxury VIP Lounge, In-seat Service'
              },
              {
                name: 'Rwanda Cultural Center Cinema',
                city: 'Huye (Butare)',
                address: 'Main Boulevard, Butare',
                phone: '+250 788 999 888',
                halls: ['Grand Auditorium (150 seats)'],
                amenities: 'Surround Sound, Student Discounts, Cultural Film Festivals'
              }
            ].map((theater, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card elevation={2} sx={{ height: '100%', borderRadius: 3, p: 2 }}>
                  <Typography variant="subtitle1" fontWeight={800} color="primary" gutterBottom>
                    {theater.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <LocationOn sx={{ fontSize: 16, verticalAlign: 'text-bottom' }} /> {theater.address} ({theater.city})
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="caption" fontWeight={700} display="block">
                    Halls & Capacity:
                  </Typography>
                  <List dense disablePadding>
                    {theater.halls.map((h, idx) => (
                      <ListItem key={idx} disableGutters sx={{ py: 0.2 }}>
                        <ListItemIcon sx={{ minWidth: 20 }}>•</ListItemIcon>
                        <ListItemText primary={<Typography variant="caption">{h}</Typography>} />
                      </ListItem>
                    ))}
                  </List>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1.5 }}>
                    Features: {theater.amenities}
                  </Typography>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    onClick={() => { setTheatersModalOpen(false); navigate('/theaters'); }}
                    sx={{ mt: 2, borderRadius: 2 }}
                  >
                    View Shows at Venue
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      {/* ================= 3. WALLET & PAYMENT SIMULATION MODAL ================= */}
      <Dialog
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'success.main', width: 36, height: 36 }}>
              <AccountBalanceWallet />
            </Avatar>
            <Typography variant="h6" fontWeight={700}>
              Cinema Digital Wallet System
            </Typography>
          </Box>
          <IconButton onClick={() => setWalletModalOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {/* Wallet Balance Card */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #1a237e 0%, #303f9f 100%)',
              color: 'white'
            }}
          >
            <Typography variant="overline" sx={{ opacity: 0.8 }}>
              Active Wallet Balance
            </Typography>
            <Typography variant="h3" fontWeight={800}>
              RWF {walletBalance.toLocaleString()}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85, display: 'block', mt: 1 }}>
              Enjoy 1-click checkout with zero booking fees on all movie orders.
            </Typography>
          </Paper>

          {walletTopUpMsg && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              {walletTopUpMsg}
            </Alert>
          )}

          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            Top-Up Wallet Simulation:
          </Typography>

          <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
            <FormLabel component="legend">Payment Method</FormLabel>
            <RadioGroup
              row
              value={walletMethod}
              onChange={(e) => setWalletMethod(e.target.value)}
            >
              <FormControlLabel value="card" control={<Radio />} label="Credit / Debit Card" />
              <FormControlLabel value="momo" control={<Radio />} label="MTN / Airtel MoMo" />
            </RadioGroup>
          </FormControl>

          <TextField
            fullWidth
            size="small"
            label="Top-Up Amount (RWF)"
            type="number"
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            {['5000', '10000', '20000', '50000'].map((amt) => (
              <Chip
                key={amt}
                label={`+ RWF ${parseInt(amt).toLocaleString()}`}
                clickable
                variant={topUpAmount === amt ? 'filled' : 'outlined'}
                color={topUpAmount === amt ? 'primary' : 'default'}
                onClick={() => setTopUpAmount(amt)}
              />
            ))}
          </Stack>

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<CreditCard />}
            onClick={handleTopUpSubmit}
            sx={{ borderRadius: 3, py: 1.2, fontWeight: 700 }}
          >
            Simulate Instant Top-Up
          </Button>
        </DialogContent>
      </Dialog>

      {/* ================= 4. LOYALTY REWARDS MODAL ================= */}
      <Dialog
        open={loyaltyModalOpen}
        onClose={() => setLoyaltyModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'warning.main', width: 36, height: 36 }}>
              <Loyalty />
            </Avatar>
            <Typography variant="h6" fontWeight={700}>
              Loyalty Rewards & VIP Points
            </Typography>
          </Box>
          <IconButton onClick={() => setLoyaltyModalOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Paper
            elevation={2}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 3,
              bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : '#fff8e1',
              border: '1px solid #ffe082'
            }}
          >
            <Typography variant="subtitle1" fontWeight={800} color="warning.dark">
              ⭐ Earn 10 Points for Every RWF 1,000 Spent!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Collect loyalty points automatically every time you book tickets. Redeem points for ticket discounts, free VIP upgrades, and complimentary popcorn!
            </Typography>
          </Paper>

          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            Reward Milestones:
          </Typography>
          <List dense disablePadding sx={{ mb: 3 }}>
            {[
              { pts: '50 Points', reward: 'Free Soft Drink (Soda or Juice)' },
              { pts: '100 Points', reward: 'Large Butter Popcorn Bucket' },
              { pts: '250 Points', reward: '50% Discount on Standard Ticket' },
              { pts: '500 Points', reward: '100% Free VIP Movie Ticket' }
            ].map((milestone, idx) => (
              <ListItem key={idx} sx={{ bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : '#fafafa', mb: 1, borderRadius: 2 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Redeem color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="subtitle2" fontWeight={700}>{milestone.reward}</Typography>}
                  secondary={`Requires ${milestone.pts}`}
                />
              </ListItem>
            ))}
          </List>

          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            Interactive Points Calculator:
          </Typography>
          <TextField
            fullWidth
            size="small"
            label="Estimated Booking Spend (RWF)"
            type="number"
            value={spendingAmount}
            onChange={(e) => setSpendingAmount(parseInt(e.target.value) || 0)}
            sx={{ mb: 2 }}
          />
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            Booking for <strong>RWF {spendingAmount.toLocaleString()}</strong> earns you <strong>{Math.floor(spendingAmount / 100)} Loyalty Points</strong> (~RWF {Math.floor(spendingAmount * 0.1).toLocaleString()} reward value).
          </Alert>
        </DialogContent>
      </Dialog>

      {/* ================= TRAILER MODAL ================= */}
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

      {/* ================= LOGIN DIALOG ================= */}
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
