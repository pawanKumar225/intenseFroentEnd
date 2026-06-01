import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  Divider
} from '@mui/material';
import {
  Login as LoginIcon,
  Logout as LogoutIcon,
  AccessTime as TimeIcon,
  DateRange as DateIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import attendanceService from '../../../services';

const CheckInOutCard = ({ user, onUpdate }) => {
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [location, setLocation] = useState(null);

  useEffect(() => {
    fetchTodayStatus();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location error:', error);
        }
      );
    }
  };

  const fetchTodayStatus = async () => {
    setLoading(true);
    const response = await attendanceService.getTodayStatus();
    if (response.success) {
      setTodayStatus(response.data);
    }
    setLoading(false);
  };

  const handleCheckIn = async () => {
    setActionLoading(true);
    const locationData = location ? {
      latitude: location.latitude,
      longitude: location.longitude,
      address: 'Current Location'
    } : null;
    
    const response = await attendanceService.checkIn(locationData);
    if (response.success) {
      setSnackbar({ open: true, message: response.message, severity: 'success' });
      fetchTodayStatus();
      if (onUpdate) onUpdate();
    } else {
      setSnackbar({ open: true, message: response.message || 'Check-in failed', severity: 'error' });
    }
    setActionLoading(false);
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    const locationData = location ? {
      latitude: location.latitude,
      longitude: location.longitude,
      address: 'Current Location'
    } : null;
    
    const response = await attendanceService.checkOut(locationData);
    if (response.success) {
      setSnackbar({ open: true, message: response.message, severity: 'success' });
      fetchTodayStatus();
      if (onUpdate) onUpdate();
    } else {
      setSnackbar({ open: true, message: response.message || 'Check-out failed', severity: 'error' });
    }
    setActionLoading(false);
  };

  const getStatusChip = () => {
    if (!todayStatus) return null;
    
    if (todayStatus.isHoliday) {
      return <Chip icon={<WarningIcon />} label="Holiday" color="warning" />;
    }
    if (todayStatus.isCheckedOut) {
      return <Chip icon={<CheckIcon />} label="Completed" color="success" />;
    }
    if (todayStatus.isCheckedIn) {
      return <Chip icon={<TimeIcon />} label="Checked In" color="info" />;
    }
    return <Chip icon={<TimeIcon />} label="Not Checked In" color="default" />;
  };

  if (loading) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
            Today's Attendance
          </Typography>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <DateIcon />
                  <Typography>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                </Box>
                {todayStatus?.checkInTime && (
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <LoginIcon />
                    <Typography>Check In: {new Date(todayStatus.checkInTime).toLocaleTimeString()}</Typography>
                  </Box>
                )}
                {todayStatus?.checkOutTime && (
                  <Box display="flex" alignItems="center" gap={2}>
                    <LogoutIcon />
                    <Typography>Check Out: {new Date(todayStatus.checkOutTime).toLocaleTimeString()}</Typography>
                  </Box>
                )}
                {todayStatus?.totalWorkingHours > 0 && (
                  <Box display="flex" alignItems="center" gap={2} mt={1}>
                    <TimeIcon />
                    <Typography>Total Hours: {todayStatus.totalWorkingHours} hrs</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box textAlign="center">
                <Box mb={2}>{getStatusChip()}</Box>
                {!todayStatus?.isHoliday && !todayStatus?.isCheckedOut && (
                  <Box display="flex" gap={2} justifyContent="center">
                    {!todayStatus?.isCheckedIn ? (
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<LoginIcon />}
                        onClick={handleCheckIn}
                        disabled={actionLoading}
                        sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#45a049' } }}
                      >
                        {actionLoading ? <CircularProgress size={24} /> : 'Check In'}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<LogoutIcon />}
                        onClick={handleCheckOut}
                        disabled={actionLoading}
                        sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#fb8c00' } }}
                      >
                        {actionLoading ? <CircularProgress size={24} /> : 'Check Out'}
                      </Button>
                    )}
                  </Box>
                )}
                {todayStatus?.isHoliday && (
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    No check-in required today
                  </Typography>
                )}
                {todayStatus?.isCheckedOut && (
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    You have completed your attendance for today
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CheckInOutCard;