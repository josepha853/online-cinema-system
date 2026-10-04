import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Stack,
  Divider
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Movie,
  Search,
  Close,
  Save,
  Image as ImageIcon,
  AccessTime,
  Category,
  Language,
  Star,
  Visibility
} from '@mui/icons-material';
import { movieApi } from '../../services/apiService';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    duration: '',
    language: '',
    release_date: '',
    rating: '',
    director: '',
    cast: '',
    poster: null
  });

  const genres = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Thriller',
    'Romance', 'Sci-Fi', 'Fantasy', 'Animation', 'Documentary'
  ];

  const languages = ['English', 'Kinyarwanda', 'French', 'Swahili'];

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await movieApi.getMovies();
      if (response.data.success) {
        setMovies(response.data.data || []);
      }
      setError('');
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (movie = null) => {
    if (movie) {
      setEditMode(true);
      setCurrentMovie(movie);
      setFormData({
        title: movie.title || '',
        description: movie.description || '',
        genre: movie.genre || '',
        duration: movie.duration || '',
        language: movie.language || '',
        release_date: movie.release_date || '',
        rating: movie.rating || '',
        director: movie.director || '',
        cast: movie.cast || '',
        poster: null
      });
    } else {
      setEditMode(false);
      setCurrentMovie(null);
      setFormData({
        title: '',
        description: '',
        genre: '',
        duration: '',
        language: '',
        release_date: '',
        rating: '',
        director: '',
        cast: '',
        poster: null
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setCurrentMovie(null);
    setFormData({
      title: '',
      description: '',
      genre: '',
      duration: '',
      language: '',
      release_date: '',
      rating: '',
      director: '',
      cast: '',
      poster: null
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        poster: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(''); // Clear any previous errors

      const submitData = {
        ...formData,
        movie_id: editMode ? currentMovie.movie_id : undefined
      };

      // Debug logging
      console.log('Submitting movie data:', {
        editMode,
        movie_id: submitData.movie_id,
        title: submitData.title
      });

      let response;
      if (editMode) {
        if (!submitData.movie_id) {
          setError('Movie ID is missing. Please try again.');
          setLoading(false);
          return;
        }
        response = await movieApi.updateMovie(submitData);
      } else {
        response = await movieApi.createMovie(submitData);
      }

      console.log('API Response:', response.data);

      if (response.data.success) {
        setSuccess(editMode ? 'Movie updated successfully! ?' : 'Movie added successfully! ??');
        handleCloseDialog();
        fetchMovies();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving movie:', error);
      console.error('Error details:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save movie';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (movieId) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await movieApi.deleteMovie(movieId);

      if (response.data.success) {
        setSuccess('Movie deleted successfully!');
        fetchMovies();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.data.message || 'Failed to delete movie');
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
      setError('Failed to delete movie');
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.genre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.language?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && movies.length === 0) {
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
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Movie /> Movies Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add, edit, and manage all movies in the system
        </Typography>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Action Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant={viewMode === 'grid' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('grid')}
            >
              Grid View
            </Button>
            <Button
              variant={viewMode === 'table' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('table')}
            >
              Table View
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Add Movie
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Movies Display */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredMovies.map((movie) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={movie.movie_id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={movie.poster_url || 'https://via.placeholder.com/300x450?text=No+Poster'}
                  alt={movie.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    {movie.title}
                  </Typography>
                  <Stack spacing={1}>
                    <Chip
                      label={movie.genre}
                      size="small"
                      color="primary"
                      icon={<Category />}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {movie.duration} mins
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Language fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {movie.language}
                      </Typography>
                    </Box>
                    {movie.rating && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Star fontSize="small" color="warning" />
                        <Typography variant="body2" color="text.secondary">
                          {movie.rating}/10
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Tooltip title="Edit Movie">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(movie)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Movie">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(movie.movie_id)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Poster</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Language</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Release Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMovies.map((movie) => (
                <TableRow key={movie.movie_id} hover>
                  <TableCell>
                    <Box
                      component="img"
                      src={movie.poster_url || 'https://via.placeholder.com/50x75?text=No+Poster'}
                      alt={movie.title}
                      sx={{ width: 50, height: 75, objectFit: 'cover', borderRadius: 1 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {movie.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={movie.genre} size="small" color="primary" />
                  </TableCell>
                  <TableCell>{movie.duration} mins</TableCell>
                  <TableCell>{movie.language}</TableCell>
                  <TableCell>
                    {movie.rating ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Star fontSize="small" color="warning" />
                        {movie.rating}/10
                      </Box>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>{movie.release_date || 'N/A'}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(movie)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(movie.movie_id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {filteredMovies.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Movie sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No movies found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? 'Try adjusting your search' : 'Start by adding your first movie'}
          </Typography>
        </Paper>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              {editMode ? 'Edit Movie' : 'Add New Movie'}
            </Typography>
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Movie Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Genre</InputLabel>
                  <Select
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    label="Genre"
                  >
                    {genres.map((genre) => (
                      <MenuItem key={genre} value={genre}>
                        {genre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Duration (minutes)"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Language</InputLabel>
                  <Select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    label="Language"
                  >
                    {languages.map((lang) => (
                      <MenuItem key={lang} value={lang}>
                        {lang}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Release Date"
                  name="release_date"
                  type="date"
                  value={formData.release_date}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Rating (0-10)"
                  name="rating"
                  type="number"
                  value={formData.rating}
                  onChange={handleInputChange}
                  inputProps={{ min: 0, max: 10, step: 0.1 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Director"
                  name="director"
                  value={formData.director}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cast (comma separated)"
                  name="cast"
                  value={formData.cast}
                  onChange={handleInputChange}
                  placeholder="Actor 1, Actor 2, Actor 3"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<ImageIcon />}
                >
                  {formData.poster ? formData.poster.name : 'Upload Poster'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                {formData.poster && (
                  <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                    ? File selected: {formData.poster.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : (editMode ? 'Update' : 'Add')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default AdminMovies;



