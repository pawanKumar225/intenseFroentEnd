// src/components/admin/PaymentHistory.jsx
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
  Pagination
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  Clear as ClearIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
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
  const [payments] = useState(initialPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const statusOptions = ['All', ...new Set(payments.map(p => p.status))];
  const methodOptions = ['All', ...new Set(payments.map(p => p.method))];

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

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
        Payment History
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total Revenue
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2' }}>
                ${totalAmount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Completed Payments
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#10b981' }}>
                ${completedAmount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Pending Payments
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                ${pendingAmount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Typography color="rgba(255,255,255,0.8)" gutterBottom variant="body2">
                Success Rate
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {Math.round((completedAmount / totalAmount) * 100)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters Section */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Search by student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 200, flex: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
              {statusOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Method</InputLabel>
            <Select value={methodFilter} label="Method" onChange={(e) => setMethodFilter(e.target.value)}>
              {methodOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField size="small" type="date" label="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField size="small" type="date" label="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} />

          {(searchTerm || statusFilter !== 'All' || methodFilter !== 'All' || startDate || endDate) && (
            <Button variant="outlined" onClick={clearFilters} startIcon={<ClearIcon />} size="small">
              Clear Filters
            </Button>
          )}
        </Stack>

        <Typography variant="body2" sx={{ mt: 2, color: '#64748b' }}>
          Showing {filteredPayments.length} of {payments.length} transactions
        </Typography>
      </Paper>

      {/* Payments Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell><strong>Student Name</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Method</strong></TableCell>
              <TableCell><strong>Transaction ID</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
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
                  <TableCell><Typography variant="caption" fontFamily="monospace">{payment.transactionId}</Typography></TableCell>
                  <TableCell>
                    <Chip label={payment.status} color={getStatusColor(payment.status)} size="small" sx={{ fontWeight: 500 }} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    No payment records found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination count={pageCount} page={page} onChange={(e, value) => setPage(value)} color="primary" />
        </Box>
      )}
    </Box>
  );
};

export default PaymentHistory;