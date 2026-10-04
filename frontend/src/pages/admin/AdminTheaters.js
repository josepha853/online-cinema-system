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
  CircularProgress
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const AdminTheaters = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTheater, setEditingTheater] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    facilities: ''
  });

  useEffect(() => {
    fetchTheaters();
  }, []);

  const fetchTheaters = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await theaterService.getAllTheaters();
      
      // Mock data for now
      setTimeout(() => {
        setTheaters([
          {
            id: 1,
            name: 'Grand Cinema Hall 1',
            location: 'Downtown Plaza',
            capacity: 150,
            facilities: 'AC, Dolby Sound, Recliner Seats'
          },
          {
            id: 2,
            name: 'Royal Theater Screen 2',
            location: 'Mall Complex',
            capacity: 200,
            facilities: 'IMAX, AC, Premium Sound'
          },
          {
            id: 3,
            name: 'City Cinema Hall A',
            location: 'Central Square',
            capacity: 120,
            facilities: 'AC, Digital Sound'
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setError('Failed to fetch theaters');
      setLoading(false);
    }
  };

  const handleOpenDialog = (theater = null) => {
    if (theater) {
      setEditingTheater(theater);
      setFormData({
        name: theater.name,
        location: theater.location,
        capacity: theater.capacity.toString(),
        facilities: theater.facilities
      });
    } else {
      setEditingTheater(null);
      setFormData({
        name: '',
        location: '',
        capacity: '',
        facilities: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTheater(null);
    setFormData({
      name: '',
      location: '',
      capacity: '',
      facilities: ''
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
      const theaterData = {
        ...formData,
        capacity: parseInt(formData.capacity)
      };

      if (editingTheater) {
        // TODO: Update theater API call
        // await theaterService.updateTheater(editingTheater.id, theaterData);
        setTheaters(prev => prev.map(theater => 
          theater.id === editingTheater.id 
            ? { ...theater, ...theaterData }
            : theater
        ));
      } else {
        // TODO: Create theater API call
        // const response = await theaterService.createTheater(theaterData);
        const newTheater = {
          id: Date.now(),
          ...theaterData
        };
        setTheaters(prev => [...prev, newTheater]);
      }

      handleCloseDialog();
    } catch (error) {
      setError('Failed to save theater');
    }
  };

  const handleDelete = async (theaterId) => {
    if (window.confirm('Are you sure you want to delete this theater?')) {
      try {
        // TODO: Delete theater API call
        // await theaterService.deleteTheater(theaterId);
        setTheaters(prev => prev.filter(theater => theater.id !== theaterId));
      } catch (error) {
        setError('Failed to delete theater');
      }
    }
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
          Theater Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Theater
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
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Facilities</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {theaters.map((theater) => (
              <TableRow key={theater.id}>
                <TableCell>{theater.name}</TableCell>
                <TableCell>{theater.location}</TableCell>
                <TableCell>{theater.capacity}</TableCell>
                <TableCell>{theater.facilities}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(theater)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(theater.id)}
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
          {editingTheater ? 'Edit Theater' : 'Add New Theater'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Theater Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            fullWidth
            variant="outlined"
            value={formData.location}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="capacity"
            label="Capacity"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.capacity}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="facilities"
            label="Facilities"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.facilities}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTheater ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminTheaters;
