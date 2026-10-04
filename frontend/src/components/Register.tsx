// src/components/Register.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import { Movie, Person, Email, Lock } from '@mui/icons-material';
import { authService } from '../services/authService';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (response.success) {
        setSuccess('Registration successful! Redirecting to login...');
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%' }}>
        <Card elevation={8}>
          <CardContent sx={{ p: 5 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Movie sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
              <Typography component="h1" variant="h4" gutterBottom>
                Create Account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Join Cinema RW today
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
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
                autoFocus
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                error={!!error}
              />

              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                error={!!error}
              />

              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                error={!!error}
                helperText="Password must be at least 6 characters long"
              />

              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                error={!!error}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mb: 3, py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Account'}
              </Button>

              <Grid container justifyContent="center">
                <Grid>
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" color="primary">
                      Already have an account? Sign In
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Register;