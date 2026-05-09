// src/employee/EmployeeAttendance.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Container,
  useMediaQuery,
  useTheme,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  RadioButtonChecked as ClockInIcon,
  RadioButtonUnchecked as ClockOutIcon,
  History as HistoryIcon,
  QrCodeScanner as QRCodeIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const EmployeeAttendance = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [showQRDialog, setShowQRDialog] = useState(false);

  const attendanceHistory = [
    { date: '2024-02-20', clockIn: '09:00 AM', clockOut: '06:00 PM', status: 'Present', hours: 9 },
    { date: '2024-02-19', clockIn: '09:15 AM', clockOut: '06:30 PM', status: 'Late', hours: 9.25 },
    { date: '2024-02-18', clockIn: '', clockOut: '', status: 'Leave', hours: 0 },
    { date: '2024-02-17', clockIn: '09:00 AM', clockOut: '06:00 PM', status: 'Present', hours: 9 }
  ];

  const handleClockIn = () => {
    setClockInTime(new Date());
    setIsClockedIn(true);
  };

  const handleClockOut = () => {
    setIsClockedIn(false);
    setClockInTime(null);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Present': return <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />;
      case 'Late': return <CancelIcon sx={{ color: '#ff9800', fontSize: 20 }} />;
      case 'Leave': return <HistoryIcon sx={{ color: '#2196f3', fontSize: 20 }} />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Present': return 'success';
      case 'Late': return 'warning';
      case 'Leave': return 'info';
      default: return 'default';
    }
  };

  const todayStats = {
    presentDays: 18,
    totalDays: 22,
    lateArrivals: 2,
    absentDays: 2,
    totalHours: 162
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2, px: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
          Attendance Management
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Track your daily attendance and work hours
        </Typography>
      </Box>

      {/* Today's Attendance Card */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, textAlign: 'center', background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)', color: 'white' }}>
            <Typography variant="h6" gutterBottom>Today's Status</Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', sm: '3rem' }, fontWeight: 700, my: 2 }}>
              {isClockedIn ? 'Clocked In' : 'Not Clocked In'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              {isClockedIn ? `Clocked in at: ${format(clockInTime, 'hh:mm a')}` : 'Start your work day by clocking in'}
            </Typography>
            <Box display="flex" gap={2} justifyContent="center">
              {!isClockedIn ? (
                <Button 
                  variant="contained" 
                  size="large" 
                  startIcon={<ClockInIcon />}
                  onClick={handleClockIn}
                  sx={{ bgcolor: 'white', color: '#1976d2', '&:hover': { bgcolor: '#f5f5f5' } }}
                >
                  Clock In
                </Button>
              ) : (
                <Button 
                  variant="contained" 
                  size="large" 
                  startIcon={<ClockOutIcon />}
                  onClick={handleClockOut}
                  sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#f57c00' } }}
                >
                  Clock Out
                </Button>
              )}
              <Button 
                variant="outlined" 
                size="large" 
                startIcon={<QRCodeIcon />}
                onClick={() => setShowQRDialog(true)}
                sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                QR Scan
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Typography variant="body2" color="textSecondary" gutterBottom>Present Days</Typography>
                  <Typography variant="h3" fontWeight={700} color="#4caf50">{todayStats.presentDays}</Typography>
                  <Typography variant="caption" color="textSecondary">out of {todayStats.totalDays}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Typography variant="body2" color="textSecondary" gutterBottom>Total Hours</Typography>
                  <Typography variant="h3" fontWeight={700} color="#2196f3">{todayStats.totalHours}</Typography>
                  <Typography variant="caption" color="textSecondary">Hours Worked</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Typography variant="body2" color="textSecondary" gutterBottom>Late Arrivals</Typography>
                  <Typography variant="h3" fontWeight={700} color="#ff9800">{todayStats.lateArrivals}</Typography>
                  <Typography variant="caption" color="textSecondary">This Month</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Typography variant="body2" color="textSecondary" gutterBottom>Absent Days</Typography>
                  <Typography variant="h3" fontWeight={700} color="#f44336">{todayStats.absentDays}</Typography>
                  <Typography variant="caption" color="textSecondary">This Month</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Attendance Progress */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>Monthly Attendance Progress</Typography>
        <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
          {Math.round((todayStats.presentDays / todayStats.totalDays) * 100)}% Attendance Rate
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={(todayStats.presentDays / todayStats.totalDays) * 100} 
          sx={{ height: 10, borderRadius: 5, mb: 2 }}
        />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="textSecondary">Target: 90%</Typography>
          <Typography variant="caption" color="textSecondary">
            {todayStats.presentDays} / {todayStats.totalDays} days present
          </Typography>
        </Box>
      </Paper>

      {/* Attendance History Table */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>Attendance History</Typography>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Clock In</strong></TableCell>
                <TableCell><strong>Clock Out</strong></TableCell>
                <TableCell><strong>Hours</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceHistory.map((record, index) => (
                <TableRow key={index} hover>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.clockIn || '-'}</TableCell>
                  <TableCell>{record.clockOut || '-'}</TableCell>
                  <TableCell>{record.hours > 0 ? record.hours : '-'}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getStatusIcon(record.status)}
                      <Chip label={record.status} color={getStatusColor(record.status)} size="small" />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* QR Scanner Dialog */}
      <Dialog open={showQRDialog} onClose={() => setShowQRDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>QR Code Scanner</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f5f5f5' }}>
              <QRCodeIcon sx={{ fontSize: 100, color: '#666' }} />
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Scan QR code at the office entrance to mark attendance
              </Typography>
            </Paper>
            <Button variant="contained" fullWidth onClick={() => setShowQRDialog(false)}>
              Open Scanner
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowQRDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmployeeAttendance;