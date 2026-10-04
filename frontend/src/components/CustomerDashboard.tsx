import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardContent 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface CustomerDashboardProps {
  user: User | null;
  onLogout: () => void;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" gutterBottom color="primary">
              Welcome back, {user?.name || 'Customer'}!
            </Typography>
            <Typography variant="h6" color="text.secondary">
              What would you like to do today?
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" color="primary" size="large">
              Browse Movies
            </Button>
            <Button variant="outlined" color="secondary" size="large">
              My Bookings
            </Button>
            <Button variant="outlined" color="error" size="large" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CustomerDashboard;