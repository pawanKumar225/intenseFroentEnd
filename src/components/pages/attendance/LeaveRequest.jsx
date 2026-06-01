import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  AssignmentTurnedIn as AppliedIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Pending as PendingIcon
} from '@mui/icons-material';
import attendanceService from '../../../services/attendanceService';

const LeaveRequest = () => {
  const [formData, setFormData] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: '',
    documents: []
  });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    const response = await attendanceService.getMyLeaveRequests();
    if (response.success) {
      setLeaveRequests(response.data.leaveRequests);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.leaveType || !formData.fromDate || !formData.toDate || !formData.reason) {
      setSnackbar({ open: true, message: 'Please fill all required fields', severity: 'error' });
      return;
    }

    setSubmitting(true);
    const response = await attendanceService.applyLeave(formData);
    if (response.success) {
      setSnackbar({ open: true, message: 'Leave request submitted successfully', severity: 'success' });
      setFormData({ leaveType: '', fromDate: '', toDate: '', reason: '', documents: [] });
      fetchLeaveRequests();
    } else {
      setSnackbar({ open: true, message: response.message || 'Failed to submit leave request', severity: 'error' });
    }
    setSubmitting(false);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <ApprovedIcon sx={{ color: '#4caf50' }} />;
      case 'rejected': return <RejectedIcon sx={{ color: '#f44336' }} />;
      default: return <PendingIcon sx={{ color: '#ff9800' }} />;
    }
  };

  const getStatusChip = (status) => {
    switch(status) {
      case 'approved':
        return <Chip label="Approved" color="success" size="small" />;
      case 'rejected':
        return <Chip label="Rejected" color="error" size="small" />;
      default:
        return <Chip label="Pending" color="warning" size="small" />;
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Leave Management
      </Typography>

      <Grid container spacing={3}>
        {/* Apply Leave Form */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Apply for Leave
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Leave Type *</InputLabel>
                <Select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  label="Leave Type *"
                  required
                >
                  <MenuItem value="sick">Sick Leave</MenuItem>
                  <MenuItem value="casual">Casual Leave</MenuItem>
                  <MenuItem value="annual">Annual Leave</MenuItem>
                  <MenuItem value="emergency">Emergency Leave</MenuItem>
                  <MenuItem value="unpaid">Unpaid Leave</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                size="small"
                label="From Date *"
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
                required
              />

              <TextField
                fullWidth
                size="small"
                label="To Date *"
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
                required
              />

              <TextField
                fullWidth
                size="small"
                label="Reason *"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                multiline
                rows={3}
                sx={{ mb: 2 }}
                required
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={submitting}
                sx={{ bgcolor: '#2196f3', '&:hover': { bgcolor: '#1976d2' } }}
              >
                {submitting ? <CircularProgress size={24} /> : 'Submit Leave Request'}
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Leave History */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              My Leave Requests
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : leaveRequests.length === 0 ? (
              <Alert severity="info">No leave requests found</Alert>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell>Type</TableCell>
                      <TableCell>From Date</TableCell>
                      <TableCell>To Date</TableCell>
                      <TableCell>Days</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaveRequests.map((request) => {
                      const days = Math.ceil((new Date(request.toDate) - new Date(request.fromDate)) / (1000 * 60 * 60 * 24)) + 1;
                      return (
                        <TableRow key={request._id}>
                          <TableCell sx={{ textTransform: 'capitalize' }}>{request.leaveType}</TableCell>
                          <TableCell>{new Date(request.fromDate).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(request.toDate).toLocaleDateString()}</TableCell>
                          <TableCell>{days}</TableCell>
                          <TableCell>{getStatusChip(request.status)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

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
    </Box>
  );
};

export default LeaveRequest;