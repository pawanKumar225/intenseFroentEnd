// App.tsx
import React, { useState } from 'react';
import {
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
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
  IconButton,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  InputAdornment,
 Alert,
    Snackbar,
    CircularProgress,
    Paper
} from '@mui/material';
import {
  People as PeopleIcon,
  Payment as PaymentIcon,
  BusinessCenter as BusinessCenterIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  FilterAlt as FilterIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  PersonAdd, Email, VpnKey, Business
} from '@mui/icons-material';
import { getLoggedInUser } from "../../utils/auth";
const drawerWidth = 188;
import adminAPI from '../../services/api'; // ✅ IMPORTANT: Add this import

// Mock Data
const initialStudents = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', batch: 'Batch A', status: 'Active', paymentStatus: 'Paid' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', batch: 'Batch B', status: 'Active', paymentStatus: 'Pending' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', batch: 'Batch A', status: 'Inactive', paymentStatus: 'Overdue' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', batch: 'Batch C', status: 'Active', paymentStatus: 'Paid' },
  { id: 5, name: 'Ethan Hunt', email: 'ethan@example.com', batch: 'Batch B', status: 'Active', paymentStatus: 'Paid' },
  { id: 6, name: 'Fiona Apple', email: 'fiona@example.com', batch: 'Batch A', status: 'Inactive', paymentStatus: 'Pending' },
  { id: 7, name: 'George King', email: 'george@example.com', batch: 'Batch C', status: 'Active', paymentStatus: 'Overdue' },
  { id: 8, name: 'Hannah Lee', email: 'hannah@example.com', batch: 'Batch B', status: 'Active', paymentStatus: 'Paid' },
];

const initialPayments = [
  { id: 1, student: 'Alice Johnson', amount: 500, date: '2025-01-15', status: 'Completed' },
  { id: 2, student: 'Bob Smith', amount: 500, date: '2025-01-10', status: 'Pending' },
  { id: 3, student: 'Charlie Brown', amount: 500, date: '2025-01-05', status: 'Failed' },
  { id: 4, student: 'Diana Prince', amount: 500, date: '2025-01-20', status: 'Completed' },
  { id: 5, student: 'Ethan Hunt', amount: 500, date: '2025-02-01', status: 'Completed' },
  { id: 6, student: 'Fiona Apple', amount: 500, date: '2025-02-05', status: 'Pending' },
  { id: 7, student: 'George King', amount: 500, date: '2025-02-10', status: 'Failed' },
  { id: 8, student: 'Hannah Lee', amount: 500, date: '2025-02-15', status: 'Completed' },
  { id: 9, student: 'Ian Wright', amount: 750, date: '2025-02-20', status: 'Completed' },
  { id: 10, student: 'Julia Roberts', amount: 500, date: '2025-02-25', status: 'Pending' },
];

const initialHRData = [
  { id: 1, name: 'John Manager', role: 'HR Manager', email: 'john@hr.com', status: 'Active' },
  { id: 2, name: 'Sarah Recruiter', role: 'Talent Acquisition', email: 'sarah@hr.com', status: 'Active' },
  { id: 3, name: 'Mike Coordinator', role: 'HR Coordinator', email: 'mike@hr.com', status: 'Inactive' },
];

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0f172a',
          color: '#e2e8f0',
          borderRight: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1e293b',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#94a3b8',
          minWidth: 42,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '4px 12px',
          padding: '10px 16px',
          '&:hover': {
            backgroundColor: '#1e293b',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          borderRadius: 16,
        },
      },
    },
  },
});

const App = () => {
  const loginUser = getLoggedInUser();
  console.log("loginUser........................", loginUser)
  const [selectedItem, setSelectedItem] = useState('Student List');
  const [students] = useState(initialStudents);
  const [payments] = useState(initialPayments);
  const [hrList, setHrList] = useState(initialHRData);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: '' });
  const [errors, setErrors] = useState({});

  
  // Filter states for Student List
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');

  // Filter states for Payment History
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [searchStudentFilter, setSearchStudentFilter] = useState('');
  const [minAmountFilter, setMinAmountFilter] = useState('');
  const [maxAmountFilter, setMaxAmountFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Get unique filter options for Students
  const statusOptions = ['All', ...new Set(students.map(s => s.status))];
  const paymentOptions = ['All', ...new Set(students.map(s => s.paymentStatus))];

  // Get unique filter options for Payments
  const paymentStatusOptions = ['All', ...new Set(payments.map(p => p.status))];

  // Filter students based on selected filters
  const filteredStudents = students.filter(student => {
    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
    const matchesPayment = paymentFilter === 'All' || student.paymentStatus === paymentFilter;
    return matchesStatus && matchesPayment;
  });

  // Filter payments based on selected filters
  const filteredPayments = payments.filter(payment => {
    const matchesStatus = paymentStatusFilter === 'All' || payment.status === paymentStatusFilter;
    const matchesSearch = searchStudentFilter === '' || payment.student.toLowerCase().includes(searchStudentFilter.toLowerCase());
    const matchesMinAmount = minAmountFilter === '' || payment.amount >= parseFloat(minAmountFilter);
    const matchesMaxAmount = maxAmountFilter === '' || payment.amount <= parseFloat(maxAmountFilter);
    const matchesDate = dateFilter === '' || payment.date === dateFilter;
    return matchesStatus && matchesSearch && matchesMinAmount && matchesMaxAmount && matchesDate;
  });

  // Statistics for Payments based on filtered data
  const totalPaymentAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const completedPayments = filteredPayments.filter(p => p.status === 'Completed').length;
  const pendingPaymentsCount = filteredPayments.filter(p => p.status === 'Pending').length;

  // Clear all payment filters
  const clearPaymentFilters = () => {
    setPaymentStatusFilter('All');
    setSearchStudentFilter('');
    setMinAmountFilter('');
    setMaxAmountFilter('');
    setDateFilter('');
  };

  // Clear all student filters
  const clearStudentFilters = () => {
    setStatusFilter('All');
    setPaymentFilter('All');
  };

  // Statistics based on filtered student data
  const totalFiltered = filteredStudents.length;
  const activeFiltered = filteredStudents.filter(s => s.status === 'Active').length;
  const pendingPaymentsFiltered = filteredStudents.filter(s => s.paymentStatus === 'Pending').length;     
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const validate = () => {
        let tempErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!newAdmin.name) {
            tempErrors.name = 'Full name is required';
        } else if (newAdmin.name.length < 2) {
            tempErrors.name = 'Name must be at least 2 characters';
        }
        
        if (!newAdmin.email) {
            tempErrors.email = 'Email is required';
        } else if (!emailRegex.test(newAdmin.email)) {
            tempErrors.email = 'Please enter a valid email address';
        }
        
        if (!newAdmin.role) {
            tempErrors.role = 'Role is required';
        }
        
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleCreateAdmin = async () => {
        if (!validate()) return;
        
        setLoading(true);
        
        try {
            const token = adminAPI.getToken();
            const response = await fetch('http://localhost:5000/api/admins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newAdmin)
            });
            
            const data = await response.json();
            console.log(data);
            if (data.success) {
                setSnackbar({
                    open: true,
                    message: `✅ ${newAdmin.name} created successfully! Credentials sent to ${newAdmin.email}`,
                    severity: 'success'
                });
                
                // Reset form
                setNewAdmin({
                    name: '',
                    email: '',
                    role: 'Employee'
                });
                
                // Refresh admin list if needed
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                setSnackbar({
                    open: true,
                    message: data.message || 'Failed to create admin',
                    severity: 'error'
                });
            }
        } catch (error) {
            console.error('Create admin error:', error);
            setSnackbar({
                open: true,
                message: 'Network error. Please try again.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const roleOptions = [
        { value: 'Super Admin', label: 'Super Admin', color: '#e91e63' },
        { value: 'HR Manager', label: 'HR Manager', color: '#2196f3' },
        { value: 'Admin', label: 'Admin', color: '#4caf50' },
        { value: 'Employee', label: 'Employee', color: '#ff9800' }
    ];

    const getRoleColor = (role) => {
        const option = roleOptions.find(opt => opt.value === role);
        return option ? option.color : '#666';
    };

  const drawer = (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ px: 3, py: 2, mb: 2 }}>
        {loginUser && (
  <>
    <Typography
      variant="caption"
      sx={{ color: '#64748b' }}
    >
      Welcome to
    </Typography>

    <Typography
      variant="h5"
      gutterBottom
      sx={{
        fontWeight: 400,
        mb: 3,
        color: '#28dd18'
      }}
    >
      {loginUser}
    </Typography>
  </>
)}
        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700, letterSpacing: '-0.5px' }}>
          Admin Panel
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748b' }}>
          Manage everything
        </Typography>
      </Box>
      <List>
        {[
          { text: 'Student List', icon: <PeopleIcon /> },
          { text: 'Payment History', icon: <PaymentIcon /> },
          { text: 'HR Module', icon: <BusinessCenterIcon /> },
          { text: 'Create User', icon: <AdminPanelSettingsIcon /> },
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                setSelectedItem(item.text);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                backgroundColor: selectedItem === item.text ? '#1e293b' : 'transparent',
                '&:hover': {
                  backgroundColor: '#1e293b',
                },
              }}
            >
              <ListItemIcon sx={{ color: selectedItem === item.text ? '#60a5fa' : '#94a3b8' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  '& .MuiTypography-root': { 
                    color: selectedItem === item.text ? '#ffffff' : '#cbd5e1',
                    fontWeight: selectedItem === item.text ? 600 : 400,
                    fontSize: '0.9rem',
                  } 
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const renderContent = () => {
    switch (selectedItem) {
      case 'Student List':
        return (
          <Box>
           
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
              Student Management
            </Typography>

            {/* Filter Section */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <FilterIcon fontSize="small" />
                      </InputAdornment>
                    }
                  >
                    {statusOptions.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Payment</InputLabel>
                  <Select
                    value={paymentFilter}
                    label="Payment"
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <PaymentIcon fontSize="small" />
                      </InputAdornment>
                    }
                  >
                    {paymentOptions.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {(statusFilter !== 'All' || paymentFilter !== 'All') && (
                  <Button 
                    variant="outlined" 
                    onClick={clearStudentFilters}
                    startIcon={<ClearIcon />}
                    size="small"
                  >
                    Clear Filters
                  </Button>
                )}

                <Typography variant="body2" sx={{ ml: 'auto', color: '#64748b' }}>
                  Showing {filteredStudents.length} of {students.length} students
                </Typography>
              </Stack>
            </Paper>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Total Students
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2' }}>
                      {totalFiltered}
                    </Typography>
                    {totalFiltered !== students.length && (
                      <Typography variant="caption" color="textSecondary">
                        (Filtered from {students.length})
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Active Students
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#10b981' }}>
                      {activeFiltered}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Pending Payments
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                      {pendingPaymentsFiltered}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Student Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 3, overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Batch</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Payment</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.batch}</TableCell>
                        <TableCell>
                          <Chip 
                            label={student.status} 
                            color={student.status === 'Active' ? 'success' : 'default'} 
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={student.paymentStatus} 
                            color={student.paymentStatus === 'Paid' ? 'success' : student.paymentStatus === 'Pending' ? 'warning' : 'error'} 
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography variant="body1" color="textSecondary">
                          No students match the selected filters
                        </Typography>
                        <Button 
                          variant="text" 
                          onClick={clearStudentFilters}
                          sx={{ mt: 1 }}
                        >
                          Clear Filters
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      case 'Payment History':
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
              Payment History
            </Typography>

            {/* Payment Filter Section */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} flexWrap="wrap" useFlexGap>
                <FormControl size="small" sx={{ minWidth: 150, flex: 1 }}>
                  <InputLabel>Payment Status</InputLabel>
                  <Select
                    value={paymentStatusFilter}
                    label="Payment Status"
                    onChange={(e) => setPaymentStatusFilter(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <FilterIcon fontSize="small" />
                      </InputAdornment>
                    }
                  >
                    {paymentStatusOptions.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  size="small"
                  label="Search Student"
                  placeholder="Enter student name..."
                  value={searchStudentFilter}
                  onChange={(e) => setSearchStudentFilter(e.target.value)}
                  sx={{ minWidth: 200, flex: 1.5 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />


                {(paymentStatusFilter !== 'All' || searchStudentFilter !== '' || minAmountFilter !== '' || maxAmountFilter !== '' || dateFilter !== '') && (
                  <Button 
                    variant="outlined" 
                    onClick={clearPaymentFilters}
                    startIcon={<ClearIcon />}
                    size="small"
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    Clear Filters
                  </Button>
                )}
              </Stack>

              {/* Filter summary */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Showing {filteredPayments.length} of {payments.length} transactions
                </Typography>
                {filteredPayments.length !== payments.length && (
                  <Typography variant="caption" sx={{ color: '#1976d2' }}>
                    Filters applied
                  </Typography>
                )}
              </Stack>
            </Paper>

            {/* Payment Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Total Amount
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2' }}>
                      ${totalPaymentAmount}
                    </Typography>
                    {filteredPayments.length !== payments.length && (
                      <Typography variant="caption" color="textSecondary">
                        (Filtered total)
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Completed Payments
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#10b981' }}>
                      {completedPayments}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
               
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Pending Payments
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                      {pendingPaymentsCount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Payment Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 3, overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell><strong>Student Name</strong></TableCell>
                    <TableCell><strong>Amount</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{payment.student}</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>${payment.amount}</TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>
                          <Chip 
                            label={payment.status} 
                            color={payment.status === 'Completed' ? 'success' : payment.status === 'Pending' ? 'warning' : 'error'} 
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                        <Typography variant="body1" color="textSecondary">
                          No payment records match the selected filters
                        </Typography>
                        <Button 
                          variant="text" 
                          onClick={clearPaymentFilters}
                          sx={{ mt: 1 }}
                        >
                          Clear Filters
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      case 'HR Module':
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
              HR Team Management
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 3, overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Role</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hrList.map((member) => (
                    <TableRow key={member.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Chip label={member.status} color={member.status === 'Active' ? 'success' : 'default'} size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      case 'Create User':
        return (
           <Box>
            <Typography
                variant="h5"
                gutterBottom
                sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: "#1e293b",
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <PersonAdd sx={{ color: '#e91e63' }} />
                Create New User
            </Typography>

            <Card sx={{ p: 4, maxWidth: 600, borderRadius: 3 }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                    Fill in the details below to create a new user. Credentials will be sent automatically to their email.
                </Typography>

                {/* Full Name */}
                <TextField
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    margin="normal"
                    value={newAdmin.name}
                    onChange={(e) =>
                        setNewAdmin({
                            ...newAdmin,
                            name: e.target.value
                        })
                    }
                    error={!!errors.name}
                    helperText={errors.name}
                    sx={{ mb: 2 }}
                    InputProps={{
                        startAdornment: <Business sx={{ mr: 1, color: '#666' }} />
                    }}
                />

                {/* Email */}
                <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    variant="outlined"
                    margin="normal"
                    value={newAdmin.email}
                    onChange={(e) =>
                        setNewAdmin({
                            ...newAdmin,
                            email: e.target.value
                        })
                    }
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={{ mb: 2 }}
                    InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: '#666' }} />
                    }}
                />

                {/* Role Dropdown */}
                <TextField
                    fullWidth
                    select
                    label="Role"
                    variant="outlined"
                    margin="normal"
                    value={newAdmin.role}
                    onChange={(e) =>
                        setNewAdmin({
                            ...newAdmin,
                            role: e.target.value
                        })
                    }
                    error={!!errors.role}
                    helperText={errors.role}
                    sx={{ mb: 3 }}
                    InputProps={{
                        startAdornment: <VpnKey sx={{ mr: 1, color: '#666' }} />
                    }}
                >
                    {roleOptions.map((option) => (
                        <MenuItem 
                            key={option.value} 
                            value={option.value}
                            sx={{ 
                                color: option.color,
                                fontWeight: option.value === newAdmin.role ? 'bold' : 'normal'
                            }}
                        >
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Info Box */}
                <Paper 
                    variant="outlined" 
                    sx={{ 
                        p: 2, 
                        mb: 3, 
                        bgcolor: '#f0f4ff',
                        borderRadius: 2
                    }}
                >
                    <Typography variant="body2" color="textSecondary">
                        <strong>📧 Email Notification:</strong> The user will receive an email with:
                    </Typography>
                    <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                        <li>Login credentials (default password)</li>
                        <li>Login URL</li>
                        <li>Security instructions</li>
                    </ul>
                </Paper>

                {/* Button */}
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleCreateAdmin}
                    disabled={loading}
                    fullWidth
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        py: 1.5,
                        background: "linear-gradient(45deg, #e91e63, #ff6f91)",
                        '&:hover': {
                            background: "linear-gradient(45deg, #c2185b, #e91e63)"
                        }
                    }}
                >
                    {loading ? (
                        <>
                            <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                            Creating User...
                        </>
                    ) : (
                        'Create User'
                    )}
                </Button>
            </Card>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
        );
      default:
        return <Typography>Select an option</Typography>;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      

        {/* Sidebar for Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            display: { xs: 'none', md: 'block' },
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', borderRight: 'none' },
          }}
          open
        >
          <Toolbar />
          {drawer}
        </Drawer>

        {/* Sidebar for Mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            display: { xs: 'block', md: 'none' },
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          {drawer}
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            width: { md: `calc(100% - ${drawerWidth}px)` },
            minHeight: '100vh',
            backgroundColor: '#f5f7fa',
          }}
        >
          <Toolbar />
          <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 1 } }}>
            {renderContent()}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;