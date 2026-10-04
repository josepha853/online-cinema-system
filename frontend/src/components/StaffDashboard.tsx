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

interface StaffDashboardProps {
  user: User;
  onLogout: () => void;
}

const StaffDashboard: React.FC<StaffDashboardProps> = ({ user, onLogout }) => {
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
              Staff Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Welcome, {user?.name || 'Staff Member'}!
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" color="primary" size="large">
              Manage Screenings
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

export default StaffDashboard;