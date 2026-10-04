import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Person, Email, Phone, Lock } from '@mui/icons-material';
import { PhotoCamera } from '@mui/icons-material';
import { authService } from '../services/authService';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer'
    ,
    profilePhoto: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setUserData((prev) => ({
      ...prev,
      profilePhoto: file
    }));

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(file ? URL.createObjectURL(file) : '');
  };

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const validateForm = () => {
    const errors = [];

    // Name validation
    if (!userData.name || userData.name.trim().length === 0) {
      errors.push('Name is required');
    }

    // Email validation
    if (!userData.email || userData.email.trim().length === 0) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.push('Invalid email format');
    }

    // Password validation
    if (!userData.password || userData.password.length === 0) {
      errors.push('Password is required');
    } else if (userData.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    // Phone validation
    if (!userData.phone || userData.phone.trim().length === 0) {
      errors.push('Phone number is required');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register(userData);

      if (response.success) {
        setSuccess('Registration successful! Please login to continue.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration Error:', err);
      let errorMessage = 'An error occurred during registration';
      if (err.message) errorMessage = err.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper sx={{ p: 4, mt: 8, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Create Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join CinemaHub and start booking your favorite movies
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Avatar
                  src={photoPreview || ''}
                  sx={{ width: 80, height: 80, bgcolor: 'primary.light' }}
                >
                  {!photoPreview && <PhotoCamera fontSize="large" />}
                </Avatar>
                <Button component="label" variant="outlined">
                  Upload Profile Photo
                  <input
                    type="file"
                    hidden
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                  />
                </Button>
                <Typography variant="caption" color="text.secondary">
                  Optional · JPG, PNG, WEBP · Max 5MB
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Full Name"
                value={userData.name}
                onChange={handleChange}
                required
                autoComplete="name"
                autoFocus
                InputProps={{
                  startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Phone Number"
                value={userData.phone}
                onChange={handleChange}
                required
                autoComplete="tel"
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                type="email"
                value={userData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                value={userData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                helperText="Password must be at least 8 characters long"
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="role-label">Account Type</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={userData.role}
                  onChange={handleChange}
                  label="Account Type"
                >
                  <MenuItem value="customer">Customer</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Account'}
          </Button>

          <Grid container justifyContent="space-between">
            <Grid>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  ← Back to Home
                </Typography>
              </Link>
            </Grid>
            <Grid>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Already have an account? Login
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>


      </Paper>
    </Container>
  );
};

export default Register;
