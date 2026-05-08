// src/components/admin/HRModule.jsx
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
  Pagination
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterAlt as FilterIcon,
  Clear as ClearIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';

// Mock Data
const initialHRMembers = [
  { id: 1, name: 'John Manager', role: 'HR Manager', email: 'john@hr.com', phone: '+1 234 567 8900', status: 'Active', joinDate: '2023-01-15', department: 'Human Resources' },
  { id: 2, name: 'Sarah Recruiter', role: 'Talent Acquisition', email: 'sarah@hr.com', phone: '+1 234 567 8901', status: 'Active', joinDate: '2023-03-20', department: 'Recruitment' },
  { id: 3, name: 'Mike Coordinator', role: 'HR Coordinator', email: 'mike@hr.com', phone: '+1 234 567 8902', status: 'Inactive', joinDate: '2023-02-10', department: 'Human Resources' },
  { id: 4, name: 'Lisa Benefits', role: 'Benefits Specialist', email: 'lisa@hr.com', phone: '+1 234 567 8903', status: 'Active', joinDate: '2023-04-05', department: 'Benefits' },
  { id: 5, name: 'Tom Training', role: 'Training Coordinator', email: 'tom@hr.com', phone: '+1 234 567 8904', status: 'Active', joinDate: '2023-05-12', department: 'Training' },
];

const HRModule = () => {
  const [hrMembers, setHrMembers] = useState(initialHRMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: '', phone: '', department: '' });
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const statusOptions = ['All', 'Active', 'Inactive'];
  const departmentOptions = ['All', ...new Set(hrMembers.map(m => m.department))];

  const filteredMembers = hrMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || member.status === statusFilter;
    const matchesDepartment = departmentFilter === 'All' || member.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const paginatedMembers = filteredMembers.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pageCount = Math.ceil(filteredMembers.length / rowsPerPage);

  const activeMembers = filteredMembers.filter(m => m.status === 'Active').length;
  const totalDepartments = [...new Set(filteredMembers.map(m => m.department))].length;

  const handleAddEdit = () => {
    if (editingMember) {
      setHrMembers(hrMembers.map(m => m.id === editingMember.id ? { ...editingMember, ...formData } : m));
    } else {
      setHrMembers([...hrMembers, { id: hrMembers.length + 1, ...formData, status: 'Active', joinDate: new Date().toISOString().split('T')[0] }]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      setHrMembers(hrMembers.filter(m => m.id !== id));
    }
  };

  const handleOpenDialog = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData(member);
    } else {
      setEditingMember(null);
      setFormData({ name: '', email: '', role: '', phone: '', department: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMember(null);
    setFormData({ name: '', email: '', role: '', phone: '', department: '' });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setDepartmentFilter('All');
    setPage(1);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
        HR Team Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total Team Members
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2' }}>
                {filteredMembers.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Active Members
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#10b981' }}>
                {activeMembers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Departments
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                {totalDepartments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Typography color="rgba(255,255,255,0.8)" gutterBottom variant="body2">
                Team Efficiency
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                94%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Actions */}
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

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Department</InputLabel>
            <Select value={departmentFilter} label="Department" onChange={(e) => setDepartmentFilter(e.target.value)}>
              {departmentOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {(searchTerm || statusFilter !== 'All' || departmentFilter !== 'All') && (
            <Button variant="outlined" onClick={clearFilters} startIcon={<ClearIcon />} size="small">
              Clear Filters
            </Button>
          )}

          <Box sx={{ flex: 1 }} />

          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ bgcolor: '#e91e63', '&:hover': { bgcolor: '#c2185b' } }}>
            Add Team Member
          </Button>
        </Stack>

        <Typography variant="body2" sx={{ mt: 2, color: '#64748b' }}>
          Showing {filteredMembers.length} of {hrMembers.length} team members
        </Typography>
      </Paper>

      {/* HR Members Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell><strong>Member</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Department</strong></TableCell>
              <TableCell><strong>Contact</strong></TableCell>
              <TableCell><strong>Join Date</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedMembers.length > 0 ? (
              paginatedMembers.map((member) => (
                <TableRow key={member.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: '#1976d2' }}>{member.name.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>{member.name}</Typography>
                        <Typography variant="caption" color="textSecondary">{member.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.department}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="caption" display="flex" alignItems="center" gap={0.5}>
                        <PhoneIcon fontSize="small" /> {member.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{member.joinDate}</TableCell>
                  <TableCell>
                    <Chip label={member.status} color={member.status === 'Active' ? 'success' : 'default'} size="small" />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleOpenDialog(member)} color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(member.id)} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    No team members found
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

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingMember ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Full Name" fullWidth value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <TextField label="Email" type="email" fullWidth value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <TextField label="Role" fullWidth value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
            <TextField label="Phone" fullWidth value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <TextField label="Department" fullWidth value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddEdit} variant="contained" sx={{ bgcolor: '#e91e63' }}>
            {editingMember ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HRModule;