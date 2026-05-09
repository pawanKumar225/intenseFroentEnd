// src/admin/PaymentHistory.jsx
import React, { useState } from 'react';
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
  alpha
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
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

// Mock Data
const initialPayments = [
  { id: 1, student: 'Alice Johnson', amount: 500, date: '2025-01-15', status: 'Completed', method: 'Credit Card', transactionId: 'TXN001' },
  { id: 2, student: 'Bob Smith', amount: 500, date: '2025-01-10', status: 'Pending', method: 'Bank Transfer', transactionId: 'TXN002' },
  { id: 3, student: 'Charlie Brown', amount: 500, date: '2025-01-05', status: 'Failed', method: 'PayPal', transactionId: 'TXN003' },
  { id: 4, student: 'Diana Prince', amount: 500, date: '2025-01-20', status: 'Completed', method: 'Credit Card', transactionId: 'TXN004' },
  { id: 5, student: 'Ethan Hunt', amount: 500, date: '2025-02-01', status: 'Completed', method: 'Bank Transfer', transactionId: 'TXN005' },
  { id: 6, student: 'Fiona Apple', amount: 500, date: '2025-02-05', status: 'Pending', method: 'Credit Card', transactionId: 'TXN006' },
  { id: 7, student: 'George King', amount: 500, date: '2025-02-10', status: 'Failed', method: 'PayPal', transactionId: 'TXN007' },
  { id: 8, student: 'Hannah Lee', amount: 500, date: '2025-02-15', status: 'Completed', method: 'Bank Transfer', transactionId: 'TXN008' },
  { id: 9, student: 'Ian Wright', amount: 750, date: '2025-02-20', status: 'Completed', method: 'Credit Card', transactionId: 'TXN009' },
  { id: 10, student: 'Julia Roberts', amount: 500, date: '2025-02-25', status: 'Pending', method: 'PayPal', transactionId: 'TXN010' },
];

const PaymentHistory = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [payments, setPayments] = useState(initialPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({
    student: '',
    amount: '',
    date: '',
    status: '',
    method: '',
    transactionId: ''
  });
  const rowsPerPage = 5;

  const statusOptions = ['All', 'Completed', 'Pending', 'Failed'];
  const methodOptions = ['All', 'Credit Card', 'Bank Transfer', 'PayPal'];

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.student.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'All' || payment.method === methodFilter;
    const matchesStartDate = !startDate || payment.date >= startDate;
    const matchesEndDate = !endDate || payment.date <= endDate;
    return matchesSearch && matchesStatus && matchesMethod && matchesStartDate && matchesEndDate;
  });

  const paginatedPayments = filteredPayments.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pageCount = Math.ceil(filteredPayments.length / rowsPerPage);

  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const completedAmount = filteredPayments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = filteredPayments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);
  const successRate = totalAmount > 0 ? Math.round((completedAmount / totalAmount) * 100) : 0;

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
      case 'Completed': return 'success';
      case 'Pending': return 'warning';
      case 'Failed': return 'error';
      default: return 'default';
    }
  };

  const handleAddEdit = () => {
    if (editingPayment) {
      setPayments(payments.map(p => p.id === editingPayment.id ? { ...editingPayment, ...formData } : p));
    } else {
      const newId = Math.max(...payments.map(p => p.id), 0) + 1;
      const newTransactionId = `TXN${String(newId).padStart(3, '0')}`;
      setPayments([...payments, { 
        id: newId, 
        ...formData, 
        transactionId: newTransactionId
      }]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      setPayments(payments.filter(p => p.id !== id));
    }
  };

  const handleOpenDialog = (payment = null) => {
    if (payment) {
      setEditingPayment(payment);
      setFormData({
        student: payment.student,
        amount: payment.amount,
        date: payment.date,
        status: payment.status,
        method: payment.method,
        transactionId: payment.transactionId
      });
    } else {
      setEditingPayment(null);
      setFormData({
        student: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        method: 'Credit Card',
        transactionId: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPayment(null);
  };

  // Mobile Card View
  const MobileCardView = () => (
    <Stack spacing={2}>
      {paginatedPayments.map((payment) => (
        <Card key={payment.id} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>{payment.student}</Typography>
                <Typography variant="caption" color="textSecondary">{payment.transactionId}</Typography>
              </Box>
              <Chip label={payment.status} color={getStatusColor(payment.status)} size="small" />
            </Box>
            
            <Grid container spacing={1.5}>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">Amount</Typography>
                <Typography variant="h6" fontWeight={700} color="#1976d2">${payment.amount}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">Date</Typography>
                <Typography variant="body2">{payment.date}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">Method</Typography>
                <Typography variant="body2">{payment.method}</Typography>
              </Grid>
            </Grid>
            
            <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
              <IconButton size="small" onClick={() => handleOpenDialog(payment)} color="primary">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => handleDelete(payment.id)} color="error">
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
              <TableRow key={payment.id} hover>
                <TableCell sx={{ fontWeight: 500 }}>{payment.student}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>${payment.amount}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell>
                  <Typography variant="caption" fontFamily="monospace">{payment.transactionId}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={payment.status} color={getStatusColor(payment.status)} size="small" />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpenDialog(payment)} color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(payment.id)} color="error">
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
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpenDialog()} 
          sx={{ bgcolor: '#e91e63', '&:hover': { bgcolor: '#c2185b' } }}
        >
          Add Payment
        </Button>
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
                    ${totalAmount}
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
                    ${completedAmount}
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
                    ${pendingAmount}
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
                    {successRate}%
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
            placeholder="Search by student name..."
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
                <MenuItem key={option} value={option}>{option}</MenuItem>
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
            <TextField 
              label="Student Name" 
              fullWidth 
              value={formData.student} 
              onChange={(e) => setFormData({ ...formData, student: e.target.value })}
              required
            />
            <TextField 
              label="Amount" 
              type="number"
              fullWidth 
              value={formData.amount} 
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
            <TextField 
              label="Date" 
              type="date"
              fullWidth 
              value={formData.date} 
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Failed">Failed</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Payment Method</InputLabel>
              <Select 
                value={formData.method} 
                label="Payment Method" 
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              >
                <MenuItem value="Credit Card">Credit Card</MenuItem>
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                <MenuItem value="PayPal">PayPal</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f8fafc' }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddEdit} variant="contained" sx={{ bgcolor: '#e91e63', '&:hover': { bgcolor: '#c2185b' } }}>
            {editingPayment ? 'Update' : 'Add Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PaymentHistory;