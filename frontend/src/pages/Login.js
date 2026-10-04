import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { Movie, Lock, Email } from '@mui/icons-material';
import { authService } from '../services/authService';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        onLogin(response.data.user, response.data.token);
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to your Cinema RW account
              </Typography>
            </Box>

            {error && (
              <Typography color="error" align="center" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                type="email"
                value={credentials.email}
                onChange={handleChange}
                required
                autoComplete="email"
                autoFocus
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />

              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mb: 3, py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>

              {/* Fixed Grid usage - removed deprecated props */}
              <Grid container justifyContent="space-between">
                <Grid>
                  <Link to="/" style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" color="primary">
                      ← Back to Home
                    </Typography>
                  </Link>
                </Grid>
                <Grid>
                  <Link to="/register" style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" color="primary">
                      Don't have an account? Register
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

export default Login;