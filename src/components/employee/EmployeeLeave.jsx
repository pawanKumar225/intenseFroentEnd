// src/employee/EmployeeLeave.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Assignment as LeaveIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const EmployeeLeave = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openDialog, setOpenDialog] = useState(false);
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const leaveBalance = {
    casual: 12,
    sick: 10,
    earned: 15,
    emergency: 3
  };

  const leaveHistory = [
    { id: 1, type: 'Sick Leave', startDate: '2024-02-10', endDate: '2024-02-11', days: 2, status: 'Approved', reason: 'Fever and cold' },
    { id: 2, type: 'Casual Leave', startDate: '2024-01-25', endDate: '2024-01-25', days: 1, status: 'Approved', reason: 'Personal work' },
    { id: 3, type: 'Emergency Leave', startDate: '2024-02-01', endDate: '2024-02-01', days: 1, status: 'Pending', reason: 'Family emergency' },
    { id: 4, type: 'Casual Leave', startDate: '2024-01-15', endDate: '2024-01-16', days: 2, status: 'Rejected', reason: 'Wedding' }
  ];

  const handleSubmit = () => {
    setSubmitSuccess(true);
    setTimeout(() => {
      setOpenDialog(false);
      setSubmitSuccess(false);
      setLeaveType('');
      setStartDate(null);
      setEndDate(null);
      setReason('');
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved': return <CheckCircleIcon sx={{ fontSize: 18 }} />;
      case 'Pending': return <PendingIcon sx={{ fontSize: 18 }} />;
      case 'Rejected': return <CancelIcon sx={{ fontSize: 18 }} />;
      default: return null;
    }
  };

  const calculateDays = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ py: 2, px: { xs: 1, sm: 2, md: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
              Leave Management
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Apply for leave and track your leave requests
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<LeaveIcon />} 
            onClick={() => setOpenDialog(true)}
            sx={{ bgcolor: '#2196f3', '&:hover': { bgcolor: '#1976d2' } }}
          >
            Apply for Leave
          </Button>
        </Box>

        {/* Leave Balance Cards */}
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: alpha('#4caf50', 0.1), borderBottom: `3px solid #4caf50` }}>
              <CardContent>
                <Typography variant="body2" color="textSecondary" gutterBottom>Casual Leave</Typography>
                <Typography variant="h3" fontWeight={700} color="#4caf50">{leaveBalance.casual}</Typography>
                <Typography variant="caption" color="textSecondary">Days Remaining</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: alpha('#2196f3', 0.1), borderBottom: `3px solid #2196f3` }}>
              <CardContent>
                <Typography variant="body2" color="textSecondary" gutterBottom>Sick Leave</Typography>
                <Typography variant="h3" fontWeight={700} color="#2196f3">{leaveBalance.sick}</Typography>
                <Typography variant="caption" color="textSecondary">Days Remaining</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: alpha('#ff9800', 0.1), borderBottom: `3px solid #ff9800` }}>
              <CardContent>
                <Typography variant="body2" color="textSecondary" gutterBottom>Earned Leave</Typography>
                <Typography variant="h3" fontWeight={700} color="#ff9800">{leaveBalance.earned}</Typography>
                <Typography variant="caption" color="textSecondary">Days Remaining</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: alpha('#e91e63', 0.1), borderBottom: `3px solid #e91e63` }}>
              <CardContent>
                <Typography variant="body2" color="textSecondary" gutterBottom>Emergency Leave</Typography>
                <Typography variant="h3" fontWeight={700} color="#e91e63">{leaveBalance.emergency}</Typography>
                <Typography variant="caption" color="textSecondary">Days Remaining</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Leave Usage Chart */}
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>Leave Usage (2024)</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Casual Leave</Typography>
                  <Typography variant="body2">8 / 20 days used</Typography>
                </Box>
                <LinearProgress variant="determinate" value={40} sx={{ height: 8, borderRadius: 4, mb: 2 }} />
                
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Sick Leave</Typography>
                  <Typography variant="body2">5 / 15 days used</Typography>
                </Box>
                <LinearProgress variant="determinate" value={33} sx={{ height: 8, borderRadius: 4, mb: 2 }} />
                
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Earned Leave</Typography>
                  <Typography variant="body2">3 / 18 days used</Typography>
                </Box>
                <LinearProgress variant="determinate" value={17} sx={{ height: 8, borderRadius: 4, mb: 2 }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, bgcolor: alpha('#2196f3', 0.1), textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="body2" color="textSecondary">Total Leave Taken</Typography>
                <Typography variant="h2" fontWeight={700} color="#2196f3">16</Typography>
                <Typography variant="caption" color="textSecondary">Days in 2024</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        {/* Leave History Table */}
        <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>Leave History</Typography>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell><strong>Type</strong></TableCell>
                  <TableCell><strong>Start Date</strong></TableCell>
                  <TableCell><strong>End Date</strong></TableCell>
                  <TableCell><strong>Days</strong></TableCell>
                  <TableCell><strong>Reason</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveHistory.map((leave) => (
                  <TableRow key={leave.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <LeaveIcon sx={{ fontSize: 18, color: '#666' }} />
                        {leave.type}
                      </Box>
                    </TableCell>
                    <TableCell>{leave.startDate}</TableCell>
                    <TableCell>{leave.endDate}</TableCell>
                    <TableCell>{leave.days}</TableCell>
                    <TableCell>{leave.reason}</TableCell>
                    <TableCell>
                      <Chip 
                        icon={getStatusIcon(leave.status)}
                        label={leave.status} 
                        color={getStatusColor(leave.status)} 
                        size="small" 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Apply Leave Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Apply for Leave</DialogTitle>
          <DialogContent>
            {submitSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Leave application submitted successfully!
              </Alert>
            )}
            <Stack spacing={2.5} sx={{ mt: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Leave Type</InputLabel>
                <Select value={leaveType} label="Leave Type" onChange={(e) => setLeaveType(e.target.value)}>
                  <MenuItem value="casual">Casual Leave</MenuItem>
                  <MenuItem value="sick">Sick Leave</MenuItem>
                  <MenuItem value="earned">Earned Leave</MenuItem>
                  <MenuItem value="emergency">Emergency Leave</MenuItem>
                </Select>
              </FormControl>

              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />

              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />

              {startDate && endDate && (
                <Paper sx={{ p: 2, bgcolor: alpha('#2196f3', 0.1), textAlign: 'center' }}>
                  <Typography variant="body2" color="textSecondary">Total Days</Typography>
                  <Typography variant="h4" fontWeight={700} color="#2196f3">{calculateDays()}</Typography>
                </Paper>
              )}

              <TextField
                label="Reason for Leave"
                multiline
                rows={3}
                fullWidth
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide detailed reason for your leave..."
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#2196f3' }}>
              Submit Application
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default EmployeeLeave;