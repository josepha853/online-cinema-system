import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar
} from '@mui/material';
import {
  TrendingUp,
  Movie,
  Theaters,
  People,
  AttachMoney,
  Download,
  PictureAsPdf
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const AdminReports = () => {
  const [reportData, setReportData] = useState({
    revenue: {
      daily: 0,
      weekly: 0,
      monthly: 0,
      yearly: 0
    },
    bookings: {
      today: 0,
      thisWeek: 0,
      thisMonth: 0
    },
    topMovies: [],
    topTheaters: [],
    recentTransactions: [],
    dailySales: [],
    revenueByTheater: [],
    moviePerformance: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('monthly');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await reportService.getReports(timeRange);

      // Mock data for now
      setTimeout(() => {
        setReportData({
          revenue: {
            daily: 2450.00,
            weekly: 15680.00,
            monthly: 67890.00,
            yearly: 825000.00
          },
          bookings: {
            today: 45,
            thisWeek: 312,
            thisMonth: 1456
          },
          topMovies: [
            { title: 'Avengers: Endgame', bookings: 245, revenue: 3675.00 },
            { title: 'Spider-Man: No Way Home', bookings: 198, revenue: 3168.00 },
            { title: 'The Batman', bookings: 156, revenue: 2028.00 },
            { title: 'Top Gun: Maverick', bookings: 134, revenue: 2010.00 },
            { title: 'Doctor Strange 2', bookings: 98, revenue: 1470.00 }
          ],
          topTheaters: [
            { name: 'Grand Cinema Hall 1', bookings: 189, revenue: 2835.00 },
            { name: 'Royal Theater Screen 2', bookings: 167, revenue: 2672.00 },
            { name: 'City Cinema Hall A', bookings: 145, revenue: 1885.00 },
            { name: 'Premium IMAX Theater', bookings: 98, revenue: 1960.00 }
          ],
          recentTransactions: [
            {
              id: 1,
              order_id: 'ORD001',
              customer: 'John Doe',
              movie: 'Avengers: Endgame',
              amount: 25.98,
              date: '2024-01-15T10:30:00Z'
            },
            {
              id: 2,
              order_id: 'ORD002',
              customer: 'ineza kellen',
              movie: 'Spider-Man: No Way Home',
              amount: 47.97,
              date: '2024-01-15T09:15:00Z'
            },
            {
              id: 3,
              order_id: 'ORD003',
              customer: 'gracia ngaboo',
              movie: 'The Batman',
              amount: 12.99,
              date: '2024-01-15T08:45:00Z'
            }
          ],
          dailySales: [
            { date: 'Mon', tickets: 45, revenue: 675 },
            { date: 'Tue', tickets: 52, revenue: 780 },
            { date: 'Wed', tickets: 38, revenue: 570 },
            { date: 'Thu', tickets: 61, revenue: 915 },
            { date: 'Fri', tickets: 89, revenue: 1335 },
            { date: 'Sat', tickets: 125, revenue: 1875 },
            { date: 'Sun', tickets: 98, revenue: 1470 }
          ],
          revenueByTheater: [
            { name: 'Grand Cinema', revenue: 2835, fill: '#8884d8' },
            { name: 'Royal Theater', revenue: 2672, fill: '#82ca9d' },
            { name: 'City Cinema', revenue: 1885, fill: '#ffc658' },
            { name: 'Premium IMAX', revenue: 1960, fill: '#ff7300' }
          ],
          moviePerformance: [
            { movie: 'Avengers', bookings: 245, rating: 4.8 },
            { movie: 'Spider-Man', bookings: 198, rating: 4.6 },
            { movie: 'Batman', bookings: 156, rating: 4.4 },
            { movie: 'Top Gun', bookings: 134, rating: 4.7 },
            { movie: 'Dr Strange', bookings: 98, rating: 4.3 }
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setError('Failed to fetch report data');
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch(
        `http://localhost/cine/backend/controllers/ReportController.php?action=export_revenue&range=${timeRange}`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `revenue_report_${timeRange}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setSuccessMessage('Revenue report exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export CSV report. Please ensure you are logged in as admin.');
    }
  };

  const handleExportOccupancyCSV = async () => {
    try {
      const response = await fetch(
        `http://localhost/cine/backend/controllers/ReportController.php?action=export_occupancy&range=${timeRange}`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `occupancy_report_${timeRange}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setSuccessMessage('Occupancy report exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export occupancy report. Please ensure you are logged in as admin.');
    }
  };

  const RevenueCard = ({ title, amount, icon, color = 'primary' }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h5" component="div">
              ${amount.toLocaleString()}
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

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString();
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h4" component="h1">
          Reports & Analytics
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportCSV}
            size="small"
          >
            Export Revenue CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportOccupancyCSV}
            size="small"
          >
            Export Occupancy CSV
          </Button>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Revenue Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <RevenueCard
            title="Daily Revenue"
            amount={reportData.revenue.daily}
            icon={<AttachMoney />}
            color="success"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <RevenueCard
            title="Weekly Revenue"
            amount={reportData.revenue.weekly}
            icon={<TrendingUp />}
            color="info"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <RevenueCard
            title="Monthly Revenue"
            amount={reportData.revenue.monthly}
            icon={<TrendingUp />}
            color="warning"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <RevenueCard
            title="Yearly Revenue"
            amount={reportData.revenue.yearly}
            icon={<TrendingUp />}
            color="primary"
          />
        </Grid>

        {/* Booking Statistics */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Booking Statistics
            </Typography>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Today's Bookings
              </Typography>
              <Typography variant="h4">
                {reportData.bookings.today}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                This Week
              </Typography>
              <Typography variant="h5">
                {reportData.bookings.thisWeek}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                This Month
              </Typography>
              <Typography variant="h5">
                {reportData.bookings.thisMonth}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Top Movies */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Top Movies
            </Typography>
            {reportData.topMovies.map((movie, index) => (
              <Box key={index} mb={1}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" noWrap>
                    {movie.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {movie.bookings} bookings
                  </Typography>
                </Box>
                <Typography variant="caption" color="success.main">
                  ${movie.revenue}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Top Theaters */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Top Theaters
            </Typography>
            {reportData.topTheaters.map((theater, index) => (
              <Box key={index} mb={1}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" noWrap>
                    {theater.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {theater.bookings} bookings
                  </Typography>
                </Box>
                <Typography variant="caption" color="success.main">
                  ${theater.revenue}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Charts Section */}
        {/* Daily Sales Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Daily Ticket Sales
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData.dailySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tickets" stroke="#8884d8" name="Tickets Sold" />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue ($)" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Revenue by Theater Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Revenue by Theater
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.revenueByTheater}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="revenue"
                  label={({ name, value }) => `${name}: $${value}`}
                >
                  {reportData.revenueByTheater.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Movie Performance Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Performing Movies
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.moviePerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="movie" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#8884d8" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Movie</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.order_id}</TableCell>
                      <TableCell>{transaction.customer}</TableCell>
                      <TableCell>{transaction.movie}</TableCell>
                      <TableCell>${transaction.amount}</TableCell>
                      <TableCell>{formatDateTime(transaction.date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminReports;



