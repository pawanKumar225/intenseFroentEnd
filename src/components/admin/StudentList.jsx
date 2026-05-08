// src/components/admin/StudentList.jsx
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
  IconButton,
  Pagination
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  Clear as ClearIcon,
  Download as DownloadIcon,
  Print as PrintIcon
} from '@mui/icons-material';

// Mock Data
const initialStudents = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', batch: 'Batch A', status: 'Active', paymentStatus: 'Paid', phone: '+1 234 567 8900', joinDate: '2024-01-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', batch: 'Batch B', status: 'Active', paymentStatus: 'Pending', phone: '+1 234 567 8901', joinDate: '2024-02-10' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', batch: 'Batch A', status: 'Inactive', paymentStatus: 'Overdue', phone: '+1 234 567 8902', joinDate: '2024-01-20' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', batch: 'Batch C', status: 'Active', paymentStatus: 'Paid', phone: '+1 234 567 8903', joinDate: '2024-03-05' },
  { id: 5, name: 'Ethan Hunt', email: 'ethan@example.com', batch: 'Batch B', status: 'Active', paymentStatus: 'Pending', phone: '+1 234 567 8904', joinDate: '2024-02-25' },
  { id: 6, name: 'Fiona Apple', email: 'fiona@example.com', batch: 'Batch A', status: 'Inactive', paymentStatus: 'Pending', phone: '+1 234 567 8905', joinDate: '2024-01-10' },
  { id: 7, name: 'George King', email: 'george@example.com', batch: 'Batch C', status: 'Active', paymentStatus: 'Overdue', phone: '+1 234 567 8906', joinDate: '2024-03-15' },
  { id: 8, name: 'Hannah Lee', email: 'hannah@example.com', batch: 'Batch B', status: 'Active', paymentStatus: 'Paid', phone: '+1 234 567 8907', joinDate: '2024-02-18' },
];

const StudentList = () => {
  const [students] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [batchFilter, setBatchFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Get unique filter options
  const statusOptions = ['All', ...new Set(students.map(s => s.status))];
  const batchOptions = ['All', ...new Set(students.map(s => s.batch))];
  const paymentOptions = ['All', ...new Set(students.map(s => s.paymentStatus))];

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
    const matchesBatch = batchFilter === 'All' || student.batch === batchFilter;
    const matchesPayment = paymentFilter === 'All' || student.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesBatch && matchesPayment;
  });

  // Pagination
  const paginatedStudents = filteredStudents.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pageCount = Math.ceil(filteredStudents.length / rowsPerPage);

  // Statistics
  const totalStudents = filteredStudents.length;
  const activeStudents = filteredStudents.filter(s => s.status === 'Active').length;
  const pendingPayments = filteredStudents.filter(s => s.paymentStatus === 'Pending').length;

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setBatchFilter('All');
    setPaymentFilter('All');
    setPage(1);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'success';
      case 'Inactive': return 'default';
      default: return 'default';
    }
  };

  const getPaymentColor = (status) => {
    switch(status) {
      case 'Paid': return 'success';
      case 'Pending': return 'warning';
      case 'Overdue': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
        Student Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total Students
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2' }}>
                {totalStudents}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Active Students
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#10b981' }}>
                {activeStudents}
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
                {pendingPayments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total Revenue
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#e91e63' }}>
                ${totalStudents * 500}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters Section */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
          <TextField
            size="small"
            placeholder="Search by name or email..."
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
            <InputLabel>Batch</InputLabel>
            <Select value={batchFilter} label="Batch" onChange={(e) => setBatchFilter(e.target.value)}>
              {batchOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Payment</InputLabel>
            <Select value={paymentFilter} label="Payment" onChange={(e) => setPaymentFilter(e.target.value)}>
              {paymentOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {(searchTerm || statusFilter !== 'All' || batchFilter !== 'All' || paymentFilter !== 'All') && (
            <Button variant="outlined" onClick={clearFilters} startIcon={<ClearIcon />} size="small">
              Clear Filters
            </Button>
          )}

          <Box sx={{ flex: 1 }} />
          
          <Button variant="outlined" startIcon={<DownloadIcon />} size="small">
            Export
          </Button>
          <Button variant="outlined" startIcon={<PrintIcon />} size="small">
            Print
          </Button>
        </Stack>

        <Typography variant="body2" sx={{ mt: 2, color: '#64748b' }}>
          Showing {filteredStudents.length} of {students.length} students
        </Typography>
      </Paper>

      {/* Students Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Batch</strong></TableCell>
              <TableCell><strong>Join Date</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Payment</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((student) => (
                <TableRow key={student.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>{student.batch}</TableCell>
                  <TableCell>{student.joinDate}</TableCell>
                  <TableCell>
                    <Chip label={student.status} color={getStatusColor(student.status)} size="small" sx={{ fontWeight: 500 }} />
                  </TableCell>
                  <TableCell>
                    <Chip label={student.paymentStatus} color={getPaymentColor(student.paymentStatus)} size="small" sx={{ fontWeight: 500 }} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    No students found matching the filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination count={pageCount} page={page} onChange={(e, value) => setPage(value)} color="primary" />
        </Box>
      )}
    </Box>
  );
};

export default StudentList;