// src/components/admin/NotificationBell.jsx
import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button
} from '@mui/material';
import { Notifications as NotificationIcon } from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/api/admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setNotifications(response.data.data.notifications);
        setUnreadCount(response.data.data.unreadCount);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_BASE_URL}/api/admin/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_BASE_URL}/api/admin/notifications/mark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const getNotificationColor = (type) => {
    switch(type) {
      case 'registration': return '#2196f3';
      case 'approval': return '#4caf50';
      case 'rejection': return '#f44336';
      default: return '#666';
    }
  };

  return (
    <>
      <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationIcon />
        </Badge>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { width: 350, maxHeight: 400 } }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={markAllAsRead}>Mark all as read</Button>
          )}
        </Box>
        <Divider />
        
        {notifications.length === 0 ? (
          <MenuItem>No notifications</MenuItem>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification) => (
              <React.Fragment key={notification._id}>
                <ListItem
                  button
                  onClick={() => markAsRead(notification._id)}
                  sx={{
                    bgcolor: notification.isRead ? 'transparent' : '#f0f7ff',
                    '&:hover': { bgcolor: '#e3f2fd' }
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2">
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="textSecondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;