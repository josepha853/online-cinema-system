import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardContent,
  Grid,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  AdminPanelSettings, 
  People, 
  Theaters, 
  Analytics,
  Settings,
  Security
} from '@mui/icons-material';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const adminFeatures = [
    {
      icon: <People sx={{ fontSize: 40 }} />,
      title: 'User Management',
      description: 'Manage customers, staff, and administrators',
      action: 'Manage Users',
      onClick: () => navigate('/admin/users')
    },
    {
      icon: <Theaters sx={{ fontSize: 40 }} />,
      title: 'Movie Management',
      description: 'Add, edit, and manage movies',
      action: 'Manage Movies',
      onClick: () => navigate('/admin/movies')
    },
    {
      icon: <Analytics sx={{ fontSize: 40 }} />,
      title: 'Analytics',
      description: 'View comprehensive reports and analytics',
      action: 'View Analytics',
      onClick: () => navigate('/admin/analytics')
    },
    {
      icon: <Settings sx={{ fontSize: 40 }} />,
      title: 'System Settings',
      description: 'Configure cinema system settings',
      action: 'Settings',
      onClick: () => navigate('/admin/settings')
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      {/* Welcome Section */}
      <Card elevation={3} sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent sx={{ p: 4, color: 'white' }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <AdminPanelSettings sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="h6">
              Welcome, {user?.name || 'Administrator'}!
            </Typography>
            <Typography variant="body2">
              Full system control and management
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" color="secondary" size="large">
              System Overview
            </Button>
            <Button variant="outlined" sx={{ color: 'white', borderColor: 'white' }} size="large">
              Quick Reports
            </Button>
            <Button variant="outlined" sx={{ color: 'white', borderColor: 'white' }} size="large" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Admin Features Grid - FIXED */}
      <Grid container spacing={3}>
        {adminFeatures.map((feature, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                textAlign: 'center', 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={feature.onClick}
            >
              <Box sx={{ color: 'primary.main', mb: 2 }}>
                {feature.icon}
              </Box>
              <Typography variant="h6" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                {feature.description}
              </Typography>
              <Button variant="outlined" size="small">
                {feature.action}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Admin Quick Stats - FIXED */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" gutterBottom>
                1,245
              </Typography>
              <Typography variant="body2">
                Total Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="secondary" gutterBottom>
                56
              </Typography>
              <Typography variant="body2">
                Active Movies
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" gutterBottom>
                $12,458
              </Typography>
              <Typography variant="body2">
                Revenue Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" gutterBottom>
                92%
              </Typography>
              <Typography variant="body2">
                System Health
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Security Section - FIXED */}
      <Card elevation={2} sx={{ mt: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Security color="primary" sx={{ mr: 2 }} />
            <Typography variant="h6">
              Security & Monitoring
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Button variant="outlined" fullWidth>
                Audit Logs
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Button variant="outlined" fullWidth>
                System Backups
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminDashboard;