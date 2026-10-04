import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
  Popover,
  Divider,
  Button,
  Chip
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  CheckCircle,
  Info,
  Warning,
  Error,
  Close,
  MarkEmailRead
} from '@mui/icons-material';

const NotificationCenter = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const fetchNotifications = async () => {
    // Mock notifications - replace with actual API call
    const mockNotifications = [
      {
        id: 1,
        type: 'success',
        title: 'Booking Confirmed',
        message: 'Your booking for Avengers: Endgame has been confirmed. Order #ORD001',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false
      },
      {
        id: 2,
        type: 'info',
        title: 'New Movie Added',
        message: 'Spider-Man: No Way Home is now available for booking!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false
      },
      {
        id: 3,
        type: 'warning',
        title: 'Show Reminder',
        message: 'Your show starts in 2 hours. Please arrive 30 minutes early.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: true
      },
      {
        id: 4,
        type: 'info',
        title: 'Loyalty Points Earned',
        message: 'You earned 50 loyalty points from your recent booking!',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true
      },
      {
        id: 5,
        type: 'error',
        title: 'Payment Failed',
        message: 'Your payment for Order #ORD002 failed. Please try again.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        read: true
      }
    ];

    setNotifications(mockNotifications);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(n => n.id !== notificationId)
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'error':
        return <Error color="error" />;
      default:
        return <Info color="info" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          {unreadCount > 0 ? <NotificationsActive /> : <Notifications />}
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ width: 400, maxHeight: 500 }}>
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                Notifications
              </Typography>
              {unreadCount > 0 && (
                <Button
                  size="small"
                  startIcon={<MarkEmailRead />}
                  onClick={markAllAsRead}
                >
                  Mark all read
                </Button>
              )}
            </Box>
          </Box>

          {/* Notifications List */}
          <List sx={{ maxHeight: 400, overflow: 'auto', p: 0 }}>
            {notifications.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="No notifications"
                  secondary="You're all caught up!"
                  sx={{ textAlign: 'center' }}
                />
              </ListItem>
            ) : (
              notifications.map((notification, index) => [
                <ListItem
                  key={notification.id}
                  sx={{
                    backgroundColor: notification.read ? 'transparent' : 'action.hover',
                    '&:hover': {
                      backgroundColor: 'action.selected'
                    }
                  }}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle2">
                          {notification.title}
                        </Typography>
                        <Chip
                          label={notification.type}
                          size="small"
                          color={getNotificationColor(notification.type)}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTimestamp(notification.timestamp)}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box display="flex" flexDirection="column" gap={1}>
                    {!notification.read && (
                      <IconButton
                        size="small"
                        onClick={() => markAsRead(notification.id)}
                        title="Mark as read"
                      >
                        <CheckCircle fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => deleteNotification(notification.id)}
                      title="Delete notification"
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>,
                index < notifications.length - 1 && <Divider key={`divider-${notification.id}`} />
              ].filter(Boolean))
            )}
          </List>
        </Paper>
      </Popover>
    </>
  );
};

export default NotificationCenter;
