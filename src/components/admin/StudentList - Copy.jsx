// src/admin/StudentList.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  alpha,
  Container,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  People as PeopleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';

// Mock Data
const initialStudents = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', batch: 'Batch A', status: 'Active', paymentStatus: 'Paid', phone: '+91 98765 43210', joinDate: '2024-01-15', studentId: 'STU001' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', batch: 'Batch B', status: 'Active', paymentStatus: 'Pending', phone: '+91 98765 43211', joinDate: '2024-02-10', studentId: 'STU002' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', batch: 'Batch A', status: 'Inactive', paymentStatus: 'Overdue', phone: '+91 98765 43212', joinDate: '2024-01-20', studentId: 'STU003' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', batch: 'Batch C', status: 'Active', paymentStatus: 'Paid', phone: '+91 98765 43213', joinDate: '2024-03-05', studentId: 'STU004' },
  { id: 5, name: 'Ethan Hunt', email: 'ethan@example.com', batch: 'Batch B', status: 'Active', paymentStatus: 'Pending', phone: '+91 98765 43214', joinDate: '2024-02-25', studentId: 'STU005' },
  { id: 6, name: 'Fiona Apple', email: 'fiona@example.com', batch: 'Batch A', status: 'Inactive', paymentStatus: 'Pending', phone: '+91 98765 43215', joinDate: '2024-01-10', studentId: 'STU006' },
  { id: 7, name: 'George King', email: 'george@example.com', batch: 'Batch C', status: 'Active', paymentStatus: 'Overdue', phone: '+91 98765 43216', joinDate: '2024-03-15', studentId: 'STU007' },
  { id: 8, name: 'Hannah Lee', email: 'hannah@example.com', batch: 'Batch B', status: 'Active', paymentStatus: 'Paid', phone: '+91 98765 43217', joinDate: '2024-02-18', studentId: 'STU008' },
  { id: 9, name: 'Ian Wright', email: 'ian@example.com', batch: 'Batch A', status: 'Active', paymentStatus: 'Paid', phone: '+91 98765 43218', joinDate: '2024-03-20', studentId: 'STU009' },
  { id: 10, name: 'Julia Roberts', email: 'julia@example.com', batch: 'Batch C', status: 'Active', paymentStatus: 'Pending', phone: '+91 98765 43219', joinDate: '2024-04-01', studentId: 'STU010' },
];

const StudentList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [batchFilter, setBatchFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    batch: '',
    status: '',
    paymentStatus: '',
    joinDate: ''
  });
  const rowsPerPage = 5;

  // Get unique filter options
  const statusOptions = ['All', 'Active', 'Inactive'];
  const batchOptions = ['All', 'Batch A', 'Batch B', 'Batch C'];
  const paymentOptions = ['All', 'Paid', 'Pending', 'Overdue'];

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId?.toLowerCase().includes(searchTerm.toLowerCase());
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
  const totalRevenue = filteredStudents.reduce((sum, s) => sum + (s.paymentStatus === 'Paid' ? 500 : 0), 0);

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

  // Handle Add/Edit Student
  const handleAddEdit = () => {
    if (editingStudent) {
      setStudents(students.map(s => s.id === editingStudent.id ? { ...editingStudent, ...formData } : s));
    } else {
      const newId = Math.max(...students.map(s => s.id), 0) + 1;
      const newStudentId = `STU${String(newId).padStart(3, '0')}`;
      setStudents([...students, { 
        id: newId, 
        ...formData, 
        studentId: newStudentId
      }]);
    }
    handleCloseDialog();
  };

  // Handle Delete Student
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student record?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  // Open Dialog for Add/Edit
  const handleOpenDialog = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        name: student.name,
        email: student.email,
        phone: student.phone,
        batch: student.batch,
        status: student.status,
        paymentStatus: student.paymentStatus,
        joinDate: student.joinDate
      });
    } else {
      setEditingStudent(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        batch: 'Batch A',
        status: 'Active',
        paymentStatus: 'Pending',
        joinDate: new Date().toISOString().split('T')[0]
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStudent(null);
  };

  // Mobile Card View
  const MobileCardView = () => (
    <Stack spacing={2}>
      {paginatedStudents.map((student) => (
        <Card key={student.id} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <Avatar sx={{ bgcolor: '#1976d2', width: 45, height: 45 }}>
                  {student.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>{student.name}</Typography>
                  <Typography variant="caption" color="textSecondary">{student.studentId}</Typography>
                </Box>
              </Box>
              <Chip label={student.status} color={getStatusColor(student.status)} size="small" />
            </Box>
            
            <Grid container spacing={1.5}>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">Email</Typography>
                <Typography variant="body2" noWrap>{student.email}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">Phone</Typography>
                <Typography variant="body2">{student.phone}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="textSecondary">Batch</Typography>
                <Typography variant="body2">{student.batch}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="textSecondary">Join Date</Typography>
                <Typography variant="body2">{student.joinDate}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="textSecondary">Payment</Typography>
                <Chip label={student.paymentStatus} color={getPaymentColor(student.paymentStatus)} size="small" sx={{ mt: 0.5 }} />
              </Grid>
            </Grid>
            
            <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
              <IconButton size="small" onClick={() => handleOpenDialog(student)} color="primary">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => handleDelete(student.id)} color="error">
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
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Student</strong></TableCell>
            <TableCell><strong>Contact</strong></TableCell>
            <TableCell><strong>Batch</strong></TableCell>
            <TableCell><strong>Join Date</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Payment</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedStudents.length > 0 ? (
            paginatedStudents.map((student) => (
              <TableRow key={student.id} hover>
                <TableCell>
                  <Chip label={student.studentId} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32, fontSize: '0.875rem' }}>
                      {student.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>{student.name}</Typography>
                      <Typography variant="caption" color="textSecondary">{student.email}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{student.phone}</Typography>
                </TableCell>
                <TableCell>{student.batch}</TableCell>
                <TableCell>{student.joinDate}</TableCell>
                <TableCell>
                  <Chip label={student.status} color={getStatusColor(student.status)} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={student.paymentStatus} color={getPaymentColor(student.paymentStatus)} size="small" />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpenDialog(student)} color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(student.id)} color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                <Typography variant="body1" color="textSecondary">
                  No students found matching the filters
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
      {/* Header Section with Add Button */}
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
            Student Management
          </Typography>
          <Typography 
            variant="body2" 
            color="textSecondary"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Manage all student records, track progress and payments
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpenDialog()} 
          sx={{ bgcolor: '#e91e63', '&:hover': { bgcolor: '#c2185b' } }}
        >
          Add Student
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
                    Total Students
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', fontSize: { xs: '1.25rem', sm: '2rem' } }}>
                    {totalStudents}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha('#1976d2', 0.1), color: '#1976d2' }}>
                  <SchoolIcon />
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
                    Active Students
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981', fontSize: { xs: '1.25rem', sm: '2rem' } }}>
                    {activeStudents}
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
                    Pending Payments
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b', fontSize: { xs: '1.25rem', sm: '2rem' } }}>
                    {pendingPayments}
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
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.1rem', sm: '1.5rem', md: '2rem' } }}>
                    ₹{totalRevenue}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                  <AttachMoneyIcon />
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
            placeholder="Search by name, email or ID..."
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

          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 } }}>
            <InputLabel>Batch</InputLabel>
            <Select value={batchFilter} label="Batch" onChange={(e) => setBatchFilter(e.target.value)}>
              {batchOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 } }}>
            <InputLabel>Payment</InputLabel>
            <Select value={paymentFilter} label="Payment" onChange={(e) => setPaymentFilter(e.target.value)}>
              {paymentOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {(searchTerm || statusFilter !== 'All' || batchFilter !== 'All' || paymentFilter !== 'All') && (
            <Button variant="outlined" onClick={clearFilters} startIcon={<ClearIcon />} size="small">
              Clear
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

      {/* Add/Edit Student Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#f8fafc', py: 2 }}>
          {editingStudent ? '✏️ Edit Student' : '➕ Add New Student'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 2 }}>
            <TextField 
              label="Full Name" 
              fullWidth 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField 
              label="Email" 
              type="email"
              fullWidth 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <TextField 
              label="Phone" 
              fullWidth 
              value={formData.phone} 
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Batch</InputLabel>
              <Select 
                value={formData.batch} 
                label="Batch" 
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              >
                <MenuItem value="Batch A">Batch A</MenuItem>
                <MenuItem value="Batch B">Batch B</MenuItem>
                <MenuItem value="Batch C">Batch C</MenuItem>
              </Select>
            </FormControl>
            <TextField 
              label="Join Date" 
              type="date"
              fullWidth 
              value={formData.joinDate} 
              onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
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
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Payment Status</InputLabel>
              <Select 
                value={formData.paymentStatus} 
                label="Payment Status" 
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
              >
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Overdue">Overdue</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f8fafc' }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddEdit} variant="contained" sx={{ bgcolor: '#e91e63', '&:hover': { bgcolor: '#c2185b' } }}>
            {editingStudent ? 'Update' : 'Add Student'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentList;