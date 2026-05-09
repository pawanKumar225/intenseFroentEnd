// src/hr/HRModule.jsx
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
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  People as PeopleIcon,
  BusinessCenter as BusinessCenterIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';

// Mock Employee Data
const initialEmployees = [
  { id: 1, name: 'John Manager', role: 'HR Manager', email: 'john@hr.com', phone: '+91 98765 43210', status: 'Active', joinDate: '2023-01-15', department: 'Human Resources', salary: '$75,000', employeeId: 'HR001' },
  { id: 2, name: 'Sarah Recruiter', role: 'Talent Acquisition', email: 'sarah@hr.com', phone: '+91 98765 43211', status: 'Active', joinDate: '2023-03-20', department: 'Recruitment', salary: '$65,000', employeeId: 'HR002' },
  { id: 3, name: 'Mike Coordinator', role: 'HR Coordinator', email: 'mike@hr.com', phone: '+91 98765 43212', status: 'Active', joinDate: '2023-02-10', department: 'Human Resources', salary: '$55,000', employeeId: 'HR003' },
  { id: 4, name: 'Lisa Benefits', role: 'Benefits Specialist', email: 'lisa@hr.com', phone: '+91 98765 43213', status: 'Active', joinDate: '2023-04-05', department: 'Benefits', salary: '$70,000', employeeId: 'HR004' },
  { id: 5, name: 'Tom Training', role: 'Training Coordinator', email: 'tom@hr.com', phone: '+91 98765 43214', status: 'Active', joinDate: '2023-05-12', department: 'Training', salary: '$60,000', employeeId: 'HR005' },
];

const HRModule = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: '', phone: '', department: '', salary: '' });
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const statusOptions = ['All', 'Active', 'Inactive'];
  const departmentOptions = ['All', ...new Set(employees.map(e => e.department))];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || employee.status === statusFilter;
    const matchesDepartment = departmentFilter === 'All' || employee.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const paginatedEmployees = filteredEmployees.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pageCount = Math.ceil(filteredEmployees.length / rowsPerPage);

  const activeEmployees = filteredEmployees.filter(e => e.status === 'Active').length;
  const totalDepartments = [...new Set(filteredEmployees.map(e => e.department))].length;

  const handleAddEdit = () => {
    if (editingEmployee) {
      setEmployees(employees.map(e => e.id === editingEmployee.id ? { ...editingEmployee, ...formData } : e));
    } else {
      const newId = employees.length + 1;
      const newEmployeeId = `HR${String(newId).padStart(3, '0')}`;
      setEmployees([...employees, { 
        id: newId, 
        ...formData, 
        status: 'Active', 
        joinDate: new Date().toISOString().split('T')[0],
        employeeId: newEmployeeId
      }]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  const handleOpenDialog = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData(employee);
    } else {
      setEditingEmployee(null);
      setFormData({ name: '', email: '', role: '', phone: '', department: '', salary: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEmployee(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setDepartmentFilter('All');
    setPage(1);
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
                  {employee.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>{employee.name}</Typography>
                  <Chip label={employee.employeeId} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                </Box>
              </Box>
              <Chip label={employee.status} color="success" size="small" />
            </Box>
            
            <Grid container spacing={1.5}>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">Role</Typography>
                <Typography variant="body2" fontWeight={500}>{employee.role}</Typography>
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
                <Typography variant="body2">{employee.phone}</Typography>
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
              <IconButton size="small" onClick={() => handleDelete(employee.id)} color="error">
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
          {paginatedEmployees.length > 0 ? (
            paginatedEmployees.map((employee) => (
              <TableRow key={employee.id} hover>
                <TableCell>
                  <Chip label={employee.employeeId} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar sx={{ bgcolor: '#e91e63', width: 32, height: 32, fontSize: '0.875rem' }}>
                      {employee.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>{employee.name}</Typography>
                      <Typography variant="caption" color="textSecondary">{employee.email}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>
                  <Chip label={employee.status} color="success" size="small" />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpenDialog(employee)} color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(employee.id)} color="error">
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
              {statusOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
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
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
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
              label="Role" 
              fullWidth 
              value={formData.role} 
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            />
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
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f8fafc' }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddEdit} variant="contained" sx={{ bgcolor: '#e91e63', '&:hover': { bgcolor: '#c2185b' } }}>
            {editingEmployee ? 'Update' : 'Add Employee'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HRModule;