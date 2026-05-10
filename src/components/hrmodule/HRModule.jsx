// src/hr/HRModule.jsx
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
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Container,
  useMediaQuery,
  useTheme,
  alpha,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  People as PeopleIcon,
  BusinessCenter as BusinessCenterIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// API Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const HRModule = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    role: '', 
    phone: '', 
    department: '', 
    salary: '',
    status: 'Active'
  });
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const rowsPerPage = 5;

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admins`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Transform data to match component format
        const transformedData = data.data.map(emp => ({
          id: emp._id,
          employeeId: emp.employeeId,
          name: emp.name,
          email: emp.email,
          role: emp.role,
          department: emp.department || 'General',
          status: emp.isActive ? 'Active' : 'Inactive',
          phone: emp.phone || '',
          salary: emp.salary || '$0',
          joinDate: emp.createdAt ? new Date(emp.createdAt).toISOString().split('T')[0] : ''
        }));
        setEmployees(transformedData);
      } else {
        showSnackbar('Failed to fetch employees', 'error');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      showSnackbar('Error loading employees', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Get unique departments from employees
  const departmentOptions = ['All', ...new Set(employees.map(e => e.department).filter(Boolean))];

  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || employee.status === statusFilter;
    const matchesDepartment = departmentFilter === 'All' || employee.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const paginatedEmployees = filteredEmployees.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pageCount = Math.ceil(filteredEmployees.length / rowsPerPage);

  const activeEmployees = filteredEmployees.filter(e => e.status === 'Active').length;
  const totalDepartments = [...new Set(filteredEmployees.map(e => e.department).filter(Boolean))].length;

  // Add or Edit Employee
  const handleAddEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = editingEmployee 
        ? `${API_BASE_URL}/admins/${editingEmployee.id}`
        : `${API_BASE_URL}/admins`;
      
      const method = editingEmployee ? 'PUT' : 'POST';
      
      // Map role to backend format
      let backendRole = 'employee';
      switch(formData.role) {
        case 'HR Manager':
          backendRole = 'hr_manager';
          break;
        case 'Super Admin':
          backendRole = 'super_admin';
          break;
        case 'Admin':
          backendRole = 'admin';
          break;
        default:
          backendRole = 'employee';
      }
      
      const payload = {
        name: formData.name,
        email: formData.email,
        role: backendRole,
        phone: formData.phone,
        department: formData.department,
        salary: formData.salary,
        status: formData.status
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.success) {
        showSnackbar(
          editingEmployee ? 'Employee updated successfully!' : 'Employee added successfully!',
          'success'
        );
        fetchEmployees(); // Refresh the list
        handleCloseDialog();
      } else {
        showSnackbar(data.message || 'Operation failed', 'error');
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      showSnackbar('Error saving employee', 'error');
    }
  };

  // Delete Employee
  const handleDelete = async () => {
    if (!employeeToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admins/${employeeToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        showSnackbar('Employee deleted successfully!', 'success');
        fetchEmployees(); // Refresh the list
        setDeleteConfirmOpen(false);
        setEmployeeToDelete(null);
      } else {
        showSnackbar(data.message || 'Delete failed', 'error');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      showSnackbar('Error deleting employee', 'error');
    }
  };

  const handleOpenDialog = (employee = null) => {
    console.log("emp.......",employee)
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        email: employee.email,
        role: employee.role,
        phone: employee.phone,
        department: employee.department,
        salary: employee.salary,
        status: employee.status
      });
    } else {
      setEditingEmployee(null);
      setFormData({ 
        name: '', 
        email: '', 
        role: '', 
        phone: '', 
        department: '', 
        salary: '',
        status: 'Active'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEmployee(null);
    setFormData({ name: '', email: '', role: '', phone: '', department: '', salary: '', status: 'Active' });
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteConfirmOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setDepartmentFilter('All');
    setPage(1);
  };

  const getRoleDisplay = (role) => {
    switch(role) {
      case 'super_admin': return 'Super Admin';
      case 'hr_manager': return 'HR Manager';
      case 'admin': return 'Admin';
      case 'employee': return 'Employee';
      default: return role || 'Employee';
    }
  };

  // Mobile Card View
  const MobileCardView = () => (
    <Stack spacing={2}>
      {paginatedEmployees.map((employee) => (
        <Card key={employee.id} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <Avatar sx={{ bgcolor: '#e91e63', width: 45, height: 45 }}>
                  {employee.name?.charAt(0) || 'E'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>{employee.name}</Typography>
                  <Chip label={employee.employeeId} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                </Box>
              </Box>
              <Chip 
                label={employee.status} 
                color={employee.status === 'Active' ? 'success' : 'default'} 
                size="small" 
              />
            </Box>
            
            <Grid container spacing={1.5}>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">Role</Typography>
                <Typography variant="body2" fontWeight={500}>{getRoleDisplay(employee.role)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">Department</Typography>
                <Typography variant="body2" fontWeight={500}>{employee.department}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">Email</Typography>
                <Typography variant="body2" noWrap>{employee.email}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">Phone</Typography>
                <Typography variant="body2">{employee.phone || '-'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">Salary</Typography>
                <Typography variant="body2" fontWeight={600} color="#e91e63">{employee.salary}</Typography>
              </Grid>
            </Grid>
            
            <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
              <IconButton size="small" onClick={() => handleOpenDialog(employee)} color="primary">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => handleDeleteClick(employee)} color="error">
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
      <Table sx={{ minWidth: 700 }}>
        <TableHead sx={{ backgroundColor: '#f8fafc' }}>
          <TableRow>
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Employee</strong></TableCell>
            <TableCell><strong>Role</strong></TableCell>
            <TableCell><strong>Department</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : paginatedEmployees.length > 0 ? (
            paginatedEmployees.map((employee) => (
              <TableRow key={employee.id} hover>
                <TableCell>
                  <Chip label={employee.employeeId} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar sx={{ bgcolor: '#e91e63', width: 32, height: 32, fontSize: '0.875rem' }}>
                      {employee.name?.charAt(0) || 'E'}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>{employee.name}</Typography>
                      <Typography variant="caption" color="textSecondary">{employee.email}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{getRoleDisplay(employee.role)}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>
                  <Chip 
                    label={employee.status} 
                    color={employee.status === 'Active' ? 'success' : 'default'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpenDialog(employee)} color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteClick(employee)} color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                <Typography variant="body1" color="textSecondary">
                  No employees found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loading && employees.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2, px: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header */}
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
            Employee Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage all employees, track performance, and handle HR operations
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpenDialog()} 
          sx={{ bgcolor: '#e91e63', '&:hover': { bgcolor: '#c2185b' } }}
        >
          Add Employee
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="textSecondary">Total Employees</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#e91e63', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                    {filteredEmployees.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha('#e91e63', 0.1), color: '#e91e63', width: 50, height: 50 }}>
                  <PeopleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="textSecondary">Active Employees</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                    {activeEmployees}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha('#4caf50', 0.1), color: '#4caf50', width: 50, height: 50 }}>
                  <PeopleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #e91e63 0%, #ff6f91 100%)', color: 'white' }}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Departments</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                    {totalDepartments}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', width: 50, height: 50 }}>
                  <BusinessCenterIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: { xs: 2, sm: 2.5 }, mb: { xs: 3, sm: 4 }, borderRadius: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
          <TextField
            size="small"
            placeholder="Search by name, email or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1 }}
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
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
            <InputLabel>Department</InputLabel>
            <Select value={departmentFilter} label="Department" onChange={(e) => setDepartmentFilter(e.target.value)}>
              {departmentOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {(searchTerm || statusFilter !== 'All' || departmentFilter !== 'All') && (
            <Button variant="outlined" onClick={clearFilters} startIcon={<ClearIcon />} size="small">
              Clear
            </Button>
          )}
        </Stack>

        <Typography variant="body2" sx={{ mt: 2, color: '#64748b' }}>
          Showing {filteredEmployees.length} of {employees.length} employees
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

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#f8fafc', py: 2 }}>
          {editingEmployee ? '✏️ Edit Employee' : '➕ Add New Employee'}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
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
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select 
                value={formData.role} 
                label="Role" 
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="employee">Employee</MenuItem>
                <MenuItem value="HR Manager">HR Manager</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Super Admin">Super Admin</MenuItem>
              </Select>
            </FormControl>
            <TextField 
              label="Phone" 
              fullWidth 
              value={formData.phone} 
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <TextField 
              label="Department" 
              fullWidth 
              value={formData.department} 
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
            <TextField 
              label="Salary" 
              fullWidth 
              placeholder="$50,000"
              value={formData.salary} 
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            />
            <FormControl fullWidth>
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
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f8fafc' }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddEdit} variant="contained" sx={{ bgcolor: '#e91e63', '&:hover': { bgcolor: '#c2185b' } }}>
            {editingEmployee ? 'Update' : 'Add Employee'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete employee <strong>{employeeToDelete?.name}</strong>?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HRModule;