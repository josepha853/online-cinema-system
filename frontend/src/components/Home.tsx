import React from 'react';
import { Container, Typography, Button, Box, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import { Movie } from '@mui/icons-material';

const Home: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Card elevation={3}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Movie sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" gutterBottom color="primary">
            Cinema RW
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Welcome to the Best Movie Experience
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Discover amazing movies, book tickets, and enjoy the ultimate cinema experience.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              component={Link} 
              to="/login" 
              variant="contained" 
              size="large"
            >
              Sign In
            </Button>
            <Button 
              component={Link} 
              to="/register" 
              variant="outlined" 
              size="large"
            >
              Create Account
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Home;