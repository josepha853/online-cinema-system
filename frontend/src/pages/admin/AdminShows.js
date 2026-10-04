import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const AdminShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [formData, setFormData] = useState({
    movie_id: '',
    theater_id: '',
    show_date: '',
    show_time: '',
    price: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls
      // const [showsRes, moviesRes, theatersRes] = await Promise.all([
      //   showService.getAllShows(),
      //   movieService.getAllMovies(),
      //   theaterService.getAllTheaters()
      // ]);

      // Mock data for now
      setTimeout(() => {
        setMovies([
          { id: 1, title: 'Avengers: Endgame' },
          { id: 2, title: 'Spider-Man: No Way Home' },
          { id: 3, title: 'The Batman' }
        ]);

        setTheaters([
          { id: 1, name: 'Grand Cinema Hall 1' },
          { id: 2, name: 'Royal Theater Screen 2' },
          { id: 3, name: 'City Cinema Hall A' }
        ]);

        setShows([
          {
            id: 1,
            movie_id: 1,
            movie_title: 'Avengers: Endgame',
            theater_id: 1,
            theater_name: 'Grand Cinema Hall 1',
            show_date: '2024-01-15',
            show_time: '18:00',
            price: 12.99
          },
          {
            id: 2,
            movie_id: 2,
            movie_title: 'Spider-Man: No Way Home',
            theater_id: 2,
            theater_name: 'Royal Theater Screen 2',
            show_date: '2024-01-15',
            show_time: '20:30',
            price: 15.99
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const handleOpenDialog = (show = null) => {
    if (show) {
      setEditingShow(show);
      setFormData({
        movie_id: show.movie_id.toString(),
        theater_id: show.theater_id.toString(),
        show_date: show.show_date,
        show_time: show.show_time,
        price: show.price.toString()
      });
    } else {
      setEditingShow(null);
      setFormData({
        movie_id: '',
        theater_id: '',
        show_date: '',
        show_time: '',
        price: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingShow(null);
    setFormData({
      movie_id: '',
      theater_id: '',
      show_date: '',
      show_time: '',
      price: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const movie = movies.find(m => m.id === parseInt(formData.movie_id));
      const theater = theaters.find(t => t.id === parseInt(formData.theater_id));

      const showData = {
        movie_id: parseInt(formData.movie_id),
        theater_id: parseInt(formData.theater_id),
        show_date: formData.show_date,
        show_time: formData.show_time,
        price: parseFloat(formData.price),
        movie_title: movie?.title,
        theater_name: theater?.name
      };

      if (editingShow) {
        // TODO: Update show API call
        // await showService.updateShow(editingShow.id, showData);
        setShows(prev => prev.map(show => 
          show.id === editingShow.id 
            ? { ...show, ...showData }
            : show
        ));
      } else {
        // TODO: Create show API call
        // const response = await showService.createShow(showData);
        const newShow = {
          id: Date.now(),
          ...showData
        };
        setShows(prev => [...prev, newShow]);
      }

      handleCloseDialog();
    } catch (error) {
      setError('Failed to save show');
    }
  };

  const handleDelete = async (showId) => {
    if (window.confirm('Are you sure you want to delete this show?')) {
      try {
        // TODO: Delete show API call
        // await showService.deleteShow(showId);
        setShows(prev => prev.filter(show => show.id !== showId));
      } catch (error) {
        setError('Failed to delete show');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Show Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Show
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Movie</TableCell>
              <TableCell>Theater</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shows.map((show) => (
              <TableRow key={show.id}>
                <TableCell>
                  <Chip label={show.movie_title} color="primary" variant="outlined" />
                </TableCell>
                <TableCell>{show.theater_name}</TableCell>
                <TableCell>{formatDate(show.show_date)}</TableCell>
                <TableCell>{formatTime(show.show_time)}</TableCell>
                <TableCell>${show.price}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(show)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(show.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingShow ? 'Edit Show' : 'Add New Show'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Movie</InputLabel>
            <Select
              name="movie_id"
              value={formData.movie_id}
              onChange={handleInputChange}
              label="Movie"
            >
              {movies.map((movie) => (
                <MenuItem key={movie.id} value={movie.id.toString()}>
                  {movie.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Theater</InputLabel>
            <Select
              name="theater_id"
              value={formData.theater_id}
              onChange={handleInputChange}
              label="Theater"
            >
              {theaters.map((theater) => (
                <MenuItem key={theater.id} value={theater.id.toString()}>
                  {theater.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            name="show_date"
            label="Show Date"
            type="date"
            fullWidth
            variant="outlined"
            value={formData.show_date}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            name="show_time"
            label="Show Time"
            type="time"
            fullWidth
            variant="outlined"
            value={formData.show_time}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            name="price"
            label="Price ($)"
            type="number"
            step="0.01"
            fullWidth
            variant="outlined"
            value={formData.price}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingShow ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminShows;
