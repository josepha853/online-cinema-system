import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  ButtonGroup,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  People,
  Movie,
  Theaters,
  BookOnline,
  TrendingUp,
  Security,
  EventSeat,
  CalendarToday,
  ReceiptLong,
  History
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const exportControllerUrl = 'http://localhost/cine/backend/controllers/ReportController.php';
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMovies: 0,
    totalTheaters: 0,
    totalBookings: 0,
    todayBookings: 0,
    revenue: 0
  });
  const [reportData, setReportData] = useState({
    occupancy: [],
    revenueByShow: [],
    topPerformers: [],
    dailySales: [],
    revenueByTheater: []
  });
  const [fraudAlerts, setFraudAlerts] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [managementCounts, setManagementCounts] = useState({
    theaters: 0,
    auditoriums: 0,
    shows: 0,
    ticketTypes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportRange, setReportRange] = useState('monthly');

  useEffect(() => {
    fetchDashboardStats();
  }, [reportRange]);

  const loadDashboardScript = (range) =>
    new Promise((resolve, reject) => {
      const existing = document.getElementById('admin-dashboard-data');
      if (existing) {
        existing.remove();
      }

      window.__ADMIN_DASHBOARD_DATA__ = null;

      const script = document.createElement('script');
      script.id = 'admin-dashboard-data';
      script.src = `http://localhost/cine/backend/admin/dashboard_data.php?range=${range}&_=${Date.now()}`;
      script.async = true;
      script.onload = () => {
        if (!window.__ADMIN_DASHBOARD_DATA__) {
          reject(new Error('Dashboard data did not load.'));
          return;
        }
        resolve(window.__ADMIN_DASHBOARD_DATA__);
      };
      script.onerror = () => reject(new Error('Failed to fetch dashboard data.'));
      document.body.appendChild(script);
    });

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const payload = await loadDashboardScript(reportRange);
      setStats(payload.stats ?? stats);
      setManagementCounts(payload.management_counts ?? managementCounts);
      const report = payload.report_data ?? {};
      setReportData({
        occupancy: report.occupancy ?? [],
        revenueByShow: report.revenueByShow ?? [],
        topPerformers: (report.moviePerformance ?? []).map((item) => ({
          title: item.movie,
          type: 'Movie',
          seatsSold: item.bookings,
          rating: item.rating
        })),
        dailySales: report.dailySales ?? [],
        revenueByTheater: report.revenueByTheater ?? []
      });
      setFraudAlerts(payload.fraud_alerts ?? []);
      setAuditLogs(payload.audit_logs ?? []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getExportUrl = (action) => `${exportControllerUrl}?action=${action}&range=${reportRange}`;

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {typeof value === 'number' && title.includes('Revenue')
                ? `$${value.toLocaleString()}`
                : value.toLocaleString()}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const managementActions = [
    { title: 'Manage Theaters', description: 'Configure locations, addresses, and auditoriums.', icon: <Theaters />, link: '/admin/theaters', count: managementCounts.theaters },
    { title: 'Manage Shows', description: 'Define show times, seat maps, and posters.', icon: <Movie />, link: '/admin/shows', count: managementCounts.shows },
    { title: 'Ticket Types', description: 'Create pricing tiers & seat categories.', icon: <EventSeat />, link: '/admin/ticket-types', count: managementCounts.ticketTypes },
    { title: 'Audit Logs', description: 'Review administrative actions for compliance.', icon: <History />, link: '/admin/reports', count: auditLogs.length }
  ];

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
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<People />}
            color="primary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Movies"
            value={stats.totalMovies}
            icon={<Movie />}
            color="secondary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Theaters"
            value={stats.totalTheaters}
            icon={<Theaters />}
            color="success"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={<BookOnline />}
            color="info"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Report Range
            </Typography>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
              <Button onClick={() => setReportRange('daily')}>Daily</Button>
              <Button onClick={() => setReportRange('weekly')}>Weekly</Button>
              <Button onClick={() => setReportRange('monthly')}>Monthly</Button>
            </ButtonGroup>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Export Data
            </Typography>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
              <Button href={getExportUrl('csv')} target="_blank" rel="noopener noreferrer">CSV</Button>
              <Button href={getExportUrl('pdf')} target="_blank" rel="noopener noreferrer">PDF</Button>
            </ButtonGroup>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Today's Bookings"
            value={stats.todayBookings}
            icon={<TrendingUp />}
            color="warning"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Revenue"
            value={stats.revenue}
            icon={<TrendingUp />}
            color="success"
          />
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Recent activity data will be displayed here. This includes recent bookings,
              new user registrations, and system updates.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Management Console
            </Typography>
            <Grid container spacing={2}>
              {managementActions.map((action) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={action.title}>
                  <Card sx={{ height: '100%', border: 1, borderColor: 'divider', cursor: 'pointer' }} onClick={() => navigate(action.link)}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            {action.title}
                          </Typography>
                          <Typography variant="h5" fontWeight="bold">
                            {action.count}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {action.description}
                          </Typography>
                        </Box>
                        <Box sx={{ color: 'primary.main', fontSize: 36 }}>{action.icon}</Box>
                      </Box>
                      <Button size="small" sx={{ mt: 2 }} onClick={() => navigate(action.link)}>
                        Go
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Reports */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Reports & Insights
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Occupancy, revenue, and daily sales keep you informed on performance.
            </Typography>
            <Stack spacing={2}>
              {reportData.occupancy.map((item) => (
                <Box key={`occ-${item.show}`} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Occupancy • {item.show}</Typography>
                  <Typography variant="body2" fontWeight="bold">{item.rate}</Typography>
                </Box>
              ))}
              {reportData.revenueByShow.map((item) => (
                <Box key={`rev-${item.show}`} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Revenue • {item.show}</Typography>
                  <Typography variant="body2" fontWeight="bold">${item.amount.toLocaleString()}</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Highlights
            </Typography>
            <Stack spacing={2}>
              {reportData.topPerformers.map((item) => (
                <Box key={`top-${item.title}`}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.type} • {item.seatsSold} seats sold
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Daily Ticket Sales
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Tickets Sold</TableCell>
                    <TableCell>Revenue (RWF)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.dailySales.map((row) => (
                    <TableRow key={`sales-${row.date}`}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.tickets}</TableCell>
                      <TableCell>{row.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Fraud & Audit */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Fraud Detection Alerts
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Potential duplicate accounts and suspicious payments surfaced in real time.
            </Typography>
            <List>
              {fraudAlerts.map((alert, index) => [
                <ListItem key={`fraud-${alert.id}`} alignItems="flex-start">
                  <ListItemIcon>
                    <Security color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={alert.issue}
                    secondary={alert.detail}
                  />
                  <Chip label={alert.severity.toUpperCase()} size="small" color={alert.severity === 'error' ? 'error' : alert.severity === 'warning' ? 'warning' : 'info'} />
                </ListItem>,
                index < fraudAlerts.length - 1 && <Divider key={`divider-${alert.id}`} />
              ].filter(Boolean))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Audit Logs
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Every administrative action is timestamped for accountability.
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Actor</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Target</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={`log-${log.id}`}>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{log.actor}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.target}</TableCell>
                      <TableCell>
                        <Chip label={log.status} size="small" color={log.status === 'success' ? 'success' : log.status === 'warning' ? 'warning' : 'default'} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;



