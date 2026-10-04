import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Avatar
} from '@mui/material';
import {
  AccountBalanceWallet,
  Add,
  Remove,
  CreditCard,
  Phone,
  AccountBalance,
  History,
  TrendingUp,
  TrendingDown,
  Star,
  LocalOffer
} from '@mui/icons-material';

const WalletSystem = ({ userId, currentBalance = 0, onBalanceUpdate }) => {
  const [balance, setBalance] = useState(currentBalance);
  const [topUpDialog, setTopUpDialog] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTransactionHistory();
  }, [userId]);

  const fetchTransactionHistory = async () => {
    try {
      // Mock transaction history
      const mockTransactions = [
        {
          id: 1,
          type: 'credit',
          amount: 10000,
          description: 'Wallet Top-up via Mobile Money',
          date: '2024-12-20 14:30:00',
          status: 'completed',
          reference: 'TXN001234'
        },
        {
          id: 2,
          type: 'debit',
          amount: 7000,
          description: 'Movie Ticket Purchase - Avengers Endgame',
          date: '2024-12-20 15:45:00',
          status: 'completed',
          reference: 'BK001234'
        },
        {
          id: 3,
          type: 'credit',
          amount: 500,
          description: 'Loyalty Points Conversion',
          date: '2024-12-20 16:00:00',
          status: 'completed',
          reference: 'LP001234'
        },
        {
          id: 4,
          type: 'credit',
          amount: 1500,
          description: 'Refund - Cancelled Booking',
          date: '2024-12-19 10:15:00',
          status: 'completed',
          reference: 'RF001234'
        }
      ];

      setTransactions(mockTransactions);
    } catch (err) {
      console.error('Failed to fetch transaction history:', err);
    }
  };

  const handleTopUp = async () => {
    if (!topUpAmount || !paymentMethod) {
      setError('Please enter amount and select payment method');
      return;
    }

    const amount = parseFloat(topUpAmount);
    if (amount < 1000) {
      setError('Minimum top-up amount is RWF 1,000');
      return;
    }

    if (amount > 100000) {
      setError('Maximum top-up amount is RWF 100,000');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update balance
      const newBalance = balance + amount;
      setBalance(newBalance);

      // Add transaction record
      const newTransaction = {
        id: Date.now(),
        type: 'credit',
        amount: amount,
        description: `Wallet Top-up via ${getPaymentMethodName(paymentMethod)}`,
        date: new Date().toISOString(),
        status: 'completed',
        reference: `TXN${Date.now().toString().slice(-6)}`
      };

      setTransactions(prev => [newTransaction, ...prev]);

      // Notify parent component
      if (onBalanceUpdate) {
        onBalanceUpdate(newBalance);
      }

      setSuccess(`Successfully added ${formatCurrency(amount)} to your wallet`);
      setTopUpDialog(false);
      setTopUpAmount('');
      setPaymentMethod('');

    } catch (err) {
      setError('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodName = (method) => {
    const methods = {
      'momo': 'Mobile Money',
      'card': 'Credit/Debit Card',
      'bank': 'Bank Transfer'
    };
    return methods[method] || method;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-RW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    return type === 'credit' ? <TrendingUp color="success" /> : <TrendingDown color="error" />;
  };

  const quickTopUpAmounts = [1000, 2500, 5000, 10000, 20000, 50000];

  return (
    <Box>
      {/* Wallet Balance Card */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccountBalanceWallet sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h6">Wallet Balance</Typography>
            <Typography variant="h3" fontWeight="bold">
              {formatCurrency(balance)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setTopUpDialog(true)}
            sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
          >
            Top Up
          </Button>
          <Button
            variant="outlined"
            startIcon={<History />}
            sx={{ borderColor: 'white', color: 'white' }}
          >
            History
          </Button>
        </Box>
      </Paper>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Quick Top-up</Typography>
        <Grid container spacing={2}>
          {quickTopUpAmounts.map((amount) => (
            <Grid item xs={6} sm={4} md={2} key={amount}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setTopUpAmount(amount.toString());
                  setTopUpDialog(true);
                }}
                sx={{ py: 1.5 }}
              >
                {formatCurrency(amount)}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Transaction History */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Recent Transactions</Typography>

        {transactions.length > 0 ? (
          <List>
            {transactions.slice(0, 10).map((transaction, index) => [
              <ListItem key={transaction.id} sx={{ px: 0 }}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: transaction.type === 'credit' ? 'success.light' : 'error.light' }}>
                    {getTransactionIcon(transaction.type)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1">
                        {transaction.description}
                      </Typography>
                      <Typography
                        variant="h6"
                        color={transaction.type === 'credit' ? 'success.main' : 'error.main'}
                        fontWeight="bold"
                      >
                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(transaction.date)}
                      </Typography>
                      <Chip
                        label={transaction.status}
                        size="small"
                        color={transaction.status === 'completed' ? 'success' : 'warning'}
                      />
                    </Box>
                  }
                />
              </ListItem>,
              index < transactions.length - 1 && <Divider key={`divider-${transaction.id}`} />
            ].filter(Boolean))}
          </List>
        ) : (
          <Alert severity="info">No transactions found</Alert>
        )}
      </Paper>

      {/* Top-up Dialog */}
      <Dialog open={topUpDialog} onClose={() => setTopUpDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Top Up Wallet</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <TextField
            fullWidth
            label="Amount (RWF)"
            type="number"
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            sx={{ mb: 3 }}
            inputProps={{ min: 1000, max: 100000 }}
            helperText="Minimum: RWF 1,000 | Maximum: RWF 100,000"
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              label="Payment Method"
            >
              <MenuItem value="momo">
                <Phone sx={{ mr: 1 }} />
                Mobile Money (MTN, Airtel)
              </MenuItem>
              <MenuItem value="card">
                <CreditCard sx={{ mr: 1 }} />
                Credit/Debit Card
              </MenuItem>
              <MenuItem value="bank">
                <AccountBalance sx={{ mr: 1 }} />
                Bank Transfer
              </MenuItem>
            </Select>
          </FormControl>

          {paymentMethod === 'momo' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              You will receive an SMS prompt to complete the payment via Mobile Money.
            </Alert>
          )}

          {paymentMethod === 'card' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              You will be redirected to a secure payment gateway to complete the transaction.
            </Alert>
          )}

          {paymentMethod === 'bank' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Bank transfer details will be provided after confirmation.
            </Alert>
          )}

          {loading && <LinearProgress sx={{ mb: 2 }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTopUpDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleTopUp}
            variant="contained"
            disabled={loading || !topUpAmount || !paymentMethod}
          >
            {loading ? 'Processing...' : `Top Up ${topUpAmount ? formatCurrency(parseFloat(topUpAmount)) : ''}`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WalletSystem;


