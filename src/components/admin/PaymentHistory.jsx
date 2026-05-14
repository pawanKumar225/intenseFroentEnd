// src/admin/PaymentHistory.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  useMediaQuery,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachMoney as AttachMoneyIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

// API Service for Payments
const API_BASE_URL = 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

const paymentApiService = {
  // Get all payments
  getPayments: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/payments`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch payments');
    const result = await response.json();
    return result.data;
  },

  // Get payment by ID
  getPaymentById: async (paymentId) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch payment');
    const result = await response.json();
    return result.data;
  },

  // Create new payment
  createPayment: async (paymentData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData),
    });
    if (!response.ok) throw new Error('Failed to create payment');
    const result = await response.json();
    return result.data;
  },

  // Update payment
  updatePayment: async (paymentId, paymentData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/payments/${paymentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData),
    });
    if (!response.ok) throw new Error('Failed to update payment');
    const result = await response.json();
    return result.data;
  },

  // Delete payment
  deletePayment: async (paymentId) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/payments/${paymentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to delete payment');
    return response.json();
  },

  // Get payment statistics
  getPaymentStats: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/payments/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch payment stats');
    const result = await response.json();
    return result.data;
  },

  // Get students list for dropdown
  getStudents: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/all-students`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch students');
    const result = await response.json();
    return result.data;
  }
};

const PaymentHistory = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [stats, setStats] = useState({
    totalRevenue: 0,
    completedAmount: 0,
    pendingAmount: 0,
    successRate: 0
  });
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    amount: '',
    paymentDate: '',
    status: 'pending',
    paymentMethod: '',
    transactionId: '',
    remarks: ''
  });
  
  const rowsPerPage = 5;

  const statusOptions = ['All', 'completed', 'pending', 'failed'];
  const methodOptions = ['All', 'Credit Card', 'Bank Transfer', 'PayPal', 'Cash', 'UPI'];

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchPayments(),
        fetchStudents(),
        fetchPaymentStats()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSnackbar({ open: true, message: 'Failed to load data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const data = await paymentApiService.getPayments();
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await paymentApiService.getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  };

  const fetchPaymentStats = async () => {
    try {
      const data = await paymentApiService.getPaymentStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Don't throw, stats are not critical
    }
  };

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'All' || payment.paymentMethod === methodFilter;
    const matchesStartDate = !startDate || payment.paymentDate >= startDate;
    const matchesEndDate = !endDate || payment.paymentDate <= endDate;
    return matchesSearch && matchesStatus && matchesMethod && matchesStartDate && matchesEndDate;
  });

  const paginatedPayments = filteredPayments.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pageCount = Math.ceil(filteredPayments.length / rowsPerPage);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setMethodFilter('All');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      case 'failed': return 'Failed';
      default: return status;
    }
  };

  const handleAddEdit = async () => {
    try {
      const paymentData = {
        studentId: formData.studentId,
        studentName: formData.studentName,
        amount: parseFloat(formData.amount),
        paymentDate: formData.paymentDate,
        status: formData.status,
        paymentMethod: formData.paymentMethod,
        transactionId: formData.transactionId || `TXN${Date.now()}`,
        remarks: formData.remarks
      };

      if (editingPayment) {
        await paymentApiService.updatePayment(editingPayment._id, paymentData);
        setSnackbar({ open: true, message: 'Payment updated successfully', severity: 'success' });
      } else {
        await paymentApiService.createPayment(paymentData);
        setSnackbar({ open: true, message: 'Payment added successfully', severity: 'success' });
      }
      
      handleCloseDialog();
      await fetchAllData();
    } catch (error) {
      console.error('Error saving payment:', error);
      setSnackbar({ open: true, message: error.message || 'Failed to save payment', severity: 'error' });
    }
  };

  const handleDelete = async (payment) => {
    if (window.confirm(`Are you sure you want to delete payment record for ${payment.studentName}?`)) {
      try {
        await paymentApiService.deletePayment(payment._id);
        setSnackbar({ open: true, message: 'Payment deleted successfully', severity: 'success' });
        await fetchAllData();
      } catch (error) {
        console.error('Error deleting payment:', error);
        setSnackbar({ open: true, message: 'Failed to delete payment', severity: 'error' });
      }
    }
  };

  const handleOpenDialog = (payment = null) => {
    if (payment) {
      setEditingPayment(payment);
      setFormData({
        studentId: payment.studentId,
        studentName: payment.studentName,
        amount: payment.amount,
        paymentDate: payment.paymentDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId,
        remarks: payment.remarks || ''
      });
    } else {
      setEditingPayment(null);
      setFormData({
        studentId: '',
        studentName: '',
        amount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        paymentMethod: '',
        transactionId: '',
        remarks: ''
      });
    }
    setOpenDialog(true);
  };

  const handleStudentSelect = (studentId) => {
    const selectedStudent = students.find(s => s._id === studentId);
    if (selectedStudent) {
      setFormData({
        ...formData,
        studentId: selectedStudent._id,
        studentName: selectedStudent.name
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPayment(null);
    setFormData({
      studentId: '',
      studentName: '',
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      paymentMethod: '',
      transactionId: '',
      remarks: ''
    });
  };

  // Mobile Card View
  const MobileCardView = () => (
    <Stack spacing={2}>
      {paginatedPayments.map((payment) => (
        <Card key={payment._id} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>{payment.studentName}</Typography>
                <Typography variant="caption" color="textSecondary">{payment.transactionId}</Typography>
              </Box>
              <Chip label={getStatusLabel(payment.status)} color={getStatusColor(payment.status)} size="small" />
            </Box>
            
            <Grid container spacing={1.5}>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">Amount</Typography>
                <Typography variant="h6" fontWeight={700} color="#1976d2">${payment.amount}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">Date</Typography>
                <Typography variant="body2">{new Date(payment.paymentDate).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">Method</Typography>
                <Typography variant="body2">{payment.paymentMethod}</Typography>
              </Grid>
            </Grid>
            
            <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
              <IconButton size="small" onClick={() => handleOpenDialog(payment)} color="primary">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => handleDelete(payment)} color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );

  // Desktop Table View
  const DesktopTableView = () => (
    <TableContainer component={Paper} sx={{ borderRadius: 3, overflowX: 'auto' }}>
      <Table sx={{ minWidth: 800 }}>
        <TableHead sx={{ backgroundColor: '#f8fafc' }}>
          <TableRow>
            <TableCell><strong>Student</strong></TableCell>
            <TableCell><strong>Amount</strong></TableCell>
            <TableCell><strong>Date</strong></TableCell>
            <TableCell><strong>Method</strong></TableCell>
            <TableCell><strong>Txn ID</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedPayments.length > 0 ? (
            paginatedPayments.map((payment) => (
              <TableRow key={payment._id} hover>
                <TableCell sx={{ fontWeight: 500 }}>{payment.studentName}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>${payment.amount}</TableCell>
                <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell>
                  <Typography variant="caption" fontFamily="monospace">{payment.transactionId}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={getStatusLabel(payment.status)} color={getStatusColor(payment.status)} size="small" />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpenDialog(payment)} color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(payment)} color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                <Typography variant="body1" color="textSecondary">
                  No payment records found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header Section */}
      <Box sx={{ mb: { xs: 3, sm: 4 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#1e293b',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              mb: 0.5
            }}
          >
            Payment History
          </Typography>
          <Typography 
            variant="body2" 
            color="textSecondary"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Track and manage all financial transactions
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button 
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchAllData}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleOpenDialog()} 
            sx={{ bgcolor: '#e91e63', '&:hover': { bgcolor: '#c2185b' } }}
          >
            Add Payment
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', fontSize: { xs: '1.25rem', sm: '2rem' } }}>
                    ${stats.totalRevenue || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha('#1976d2', 0.1), color: '#1976d2' }}>
                  <AttachMoneyIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    Completed
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981', fontSize: { xs: '1.25rem', sm: '2rem' } }}>
                    ${stats.completedAmount || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha('#10b981', 0.1), color: '#10b981' }}>
                  <CheckCircleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    Pending
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b', fontSize: { xs: '1.25rem', sm: '2rem' } }}>
                    ${stats.pendingAmount || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha('#f59e0b', 0.1), color: '#f59e0b' }}>
                  <PendingIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    Success Rate
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.25rem', sm: '2rem' } }}>
                    {stats.successRate || 0}%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                  <TrendingUpIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters Section */}
      <Paper sx={{ p: { xs: 2, sm: 2.5 }, mb: { xs: 3, sm: 4 }, borderRadius: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Search by student name or transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 } }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
              {statusOptions.map(option => (
                <MenuItem key={option} value={option}>{getStatusLabel(option)}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 140 } }}>
            <InputLabel>Method</InputLabel>
            <Select value={methodFilter} label="Method" onChange={(e) => setMethodFilter(e.target.value)}>
              {methodOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField 
            size="small" 
            type="date"
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            sx={{ minWidth: { xs: '100%', sm: 150 } }}
            InputLabelProps={{ shrink: true }}
            placeholder="Start Date"
          />
          
          <TextField 
            size="small" 
            type="date"
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            sx={{ minWidth: { xs: '100%', sm: 150 } }}
            InputLabelProps={{ shrink: true }}
            placeholder="End Date"
          />

          {(searchTerm || statusFilter !== 'All' || methodFilter !== 'All' || startDate || endDate) && (
            <Button variant="outlined" onClick={clearFilters} startIcon={<ClearIcon />} size="small">
              Clear
            </Button>
          )}
        </Stack>

        <Typography variant="body2" sx={{ mt: 2, color: '#64748b' }}>
          Showing {filteredPayments.length} of {payments.length} transactions
        </Typography>
      </Paper>

      {/* Responsive View */}
      {isMobile ? <MobileCardView /> : <DesktopTableView />}

      {/* Pagination */}
      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination 
            count={pageCount} 
            page={page} 
            onChange={(e, value) => setPage(value)} 
            color="primary" 
            size={isMobile ? "small" : "medium"}
          />
        </Box>
      )}

      {/* Add/Edit Payment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#f8fafc', py: 2 }}>
          {editingPayment ? '✏️ Edit Payment Record' : '➕ Add New Payment'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Select Student</InputLabel>
              <Select 
                value={formData.studentId} 
                label="Select Student" 
                onChange={(e) => handleStudentSelect(e.target.value)}
                disabled={editingPayment}
              >
                {students.map(student => (
                  <MenuItem key={student._id} value={student._id}>
                    {student.name} ({student.registrationId})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {formData.studentName && (
              <TextField 
                label="Student Name" 
                fullWidth 
                value={formData.studentName} 
                disabled
              />
            )}
            
            <TextField 
              label="Amount" 
              type="number"
              fullWidth 
              value={formData.amount} 
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
            
            <TextField 
              label="Payment Date" 
              type="date"
              fullWidth 
              value={formData.paymentDate} 
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              required
              InputLabelProps={{ shrink: true }}
            />
            
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select 
                value={formData.status} 
                label="Status" 
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth required>
              <InputLabel>Payment Method</InputLabel>
              <Select 
                value={formData.paymentMethod} 
                label="Payment Method" 
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <MenuItem value="Credit Card">Credit Card</MenuItem>
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                <MenuItem value="PayPal">PayPal</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="UPI">UPI</MenuItem>
              </Select>
            </FormControl>
            
            <TextField 
              label="Transaction ID" 
              fullWidth 
              value={formData.transactionId} 
              onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
              placeholder="Optional - Auto-generated if left empty"
            />
            
            <TextField 
              label="Remarks" 
              fullWidth 
              multiline
              rows={2}
              value={formData.remarks} 
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Optional remarks"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f8fafc' }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddEdit} variant="contained" sx={{ bgcolor: '#e91e63', '&:hover': { bgcolor: '#c2185b' } }}>
            {editingPayment ? 'Update' : 'Add Payment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PaymentHistory;