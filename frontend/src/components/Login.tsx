// src/components/Login.tsx
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
import { Movie, Lock, Email } from '@mui/icons-material';
import { authService } from '../services/authService';

interface Credentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'staff' | 'admin';
}

interface LoginProps {
  onLogin: (user: User, token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState<Credentials>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Call parent handler
        onLogin(user, token);
        
        // Navigate to dashboard based on role
        navigate('/dashboard');
        
        // Show success message
        console.log(`Welcome back, ${user.name}! (${user.role})`);
      } else {
        setError(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
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
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
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
                error={!!error}
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
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
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