import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Typography,
  Box,
  Chip,
  Avatar,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import 'bootstrap/dist/css/bootstrap.min.css';

// API Service - Real API endpoints
const API_BASE_URL = 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

const apiService = {
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
  },
  
  deleteStudent: async (studentId) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/students/${studentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to delete student');
    return response.json();
  },
  
  updateStudent: async (studentId, data) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/students/${studentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update student');
    return response.json();
  },
  
  getStudentById: async (studentId) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/students/${studentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch student details');
    const result = await response.json();
    return result.data;
  }
};

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
}));

const StatusChip = styled(Chip)(({ status, theme }) => ({
  backgroundColor:
    status === 'completed' || status === 'active'
      ? theme.palette.success.light
      : status === 'pending'
      ? theme.palette.warning.light
      : theme.palette.error.light,
  color:
    status === 'completed' || status === 'active'
      ? theme.palette.success.dark
      : status === 'pending'
      ? theme.palette.warning.dark
      : theme.palette.error.dark,
  fontWeight: 500,
}));

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on search term and status
  useEffect(() => {
    let filtered = [...students];
    
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.registrationId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter((student) => student.status === filterStatus);
    }
    
    setFilteredStudents(filtered);
    setPage(0);
  }, [searchTerm, students, filterStatus]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await apiService.getStudents();
      // Transform data to match component expectations
      const transformedData = data.map(student => ({
        _id: student._id,
        studentId: student.registrationId,
        fullName: student.name,
        email: student.email,
        phone: student.contactNumber,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender || 'Not specified',
        address: student.presentAddress,
        course: student.packageDetails,
        semester: 1,
        registrationDate: student.dateOfJoin,
        status: student.status,
        paymentStatus: student.paymentStatus || 'pending',
        paymentAmount: student.packagePrice || 0,
        paymentDate: student.paymentDate,
        paymentMethod: student.paymentMethod,
        transactionId: student.transactionId,
        profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`,
        fatherName: student.fatherName,
        aadharNumber: student.aadharNumber,
        permanentAddress: student.permanentAddress,
        altContactNumber: student.altContactNumber,
        packageValue: student.packageValue,
        packageDuration: student.packageDuration
      }));
      setStudents(transformedData);
      setFilteredStudents(transformedData);
    } catch (error) {
      console.error('Error fetching students:', error);
      setSnackbar({ open: true, message: 'Failed to fetch students', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.deleteStudent(selectedStudent._id);
      setStudents(students.filter((s) => s._id !== selectedStudent._id));
      setSnackbar({ open: true, message: 'Student deleted successfully', severity: 'success' });
      setDeleteDialogOpen(false);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete student', severity: 'error' });
    }
  };

  const handleEdit = async (updatedData) => {
    try {
      await apiService.updateStudent(selectedStudent._id, updatedData);
      const updatedStudents = students.map((s) =>
        s._id === selectedStudent._id ? { ...s, ...updatedData } : s
      );
      setStudents(updatedStudents);
      setSnackbar({ open: true, message: 'Student updated successfully', severity: 'success' });
      setEditDialogOpen(false);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update student', severity: 'error' });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Responsive Card View for Mobile
  const MobileCardView = () => {
    const displayedStudents = filteredStudents.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    return (
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {displayedStudents.map((student) => (
          <Card key={student._id} sx={{ mb: 2, borderRadius: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar src={student.profileImage} sx={{ width: 50, height: 50, mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h6">{student.fullName}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    ID: {student.studentId}
                  </Typography>
                </Box>
                <StatusChip
                  label={student.status?.toUpperCase()}
                  status={student.status}
                  size="small"
                />
              </Box>
              
              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2">{student.email}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2">{student.phone}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    Course: {student.course}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <PaymentIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      Amount: ${student.paymentAmount} | Status: {student.status}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Box display="flex" justifyContent="flex-end" gap={1}>
                <Tooltip title="View Details">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedStudent(student);
                      setViewDialogOpen(true);
                    }}
                  >
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedStudent(student);
                      setEditDialogOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedStudent(student);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  };

  // Desktop Table View
  const DesktopTableView = () => (
    <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student Info</TableCell>
            <TableCell>Contact Details</TableCell>
            <TableCell>Course Info</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredStudents
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((student) => (
              <TableRow key={student._id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar src={student.profileImage}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {student.fullName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        ID: {student.studentId}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" display="block">
                        DOB: {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{student.email}</Typography>
                  <Typography variant="body2">{student.phone}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {student.address}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{student.course}</Typography>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Reg: {student.registrationDate ? new Date(student.registrationDate).toLocaleDateString() : 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <StatusChip
                      label={student.status?.toUpperCase()}
                      status={student.status}
                      size="small"
                    />
                    {student.paymentAmount > 0 && (
                      <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 0.5 }}>
                        Amount: ${student.paymentAmount}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center" gap={1}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedStudent(student);
                          setViewDialogOpen(true);
                        }}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedStudent(student);
                          setEditDialogOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedStudent(student);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // View Details Dialog
  const ViewDetailsDialog = () => (
    <Dialog
      open={viewDialogOpen}
      onClose={() => setViewDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6">Student Details</Typography>
      </DialogTitle>
      <DialogContent dividers>
        {selectedStudent && (
          <Grid container spacing={3}>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Avatar
                src={selectedStudent.profileImage}
                sx={{ width: 100, height: 100 }}
              >
                <PersonIcon sx={{ fontSize: 60 }} />
              </Avatar>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Personal Information
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                <Typography variant="body2">
                  <strong>Full Name:</strong> {selectedStudent.fullName}
                </Typography>
                <Typography variant="body2">
                  <strong>Student ID:</strong> {selectedStudent.studentId}
                </Typography>
                <Typography variant="body2">
                  <strong>Father's Name:</strong> {selectedStudent.fatherName || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Date of Birth:</strong>{' '}
                  {selectedStudent.dateOfBirth ? new Date(selectedStudent.dateOfBirth).toLocaleDateString() : 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Gender:</strong> {selectedStudent.gender || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Aadhar Number:</strong> {selectedStudent.aadharNumber || 'N/A'}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Contact Information
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                <Typography variant="body2">
                  <strong>Email:</strong> {selectedStudent.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Phone:</strong> {selectedStudent.phone}
                </Typography>
                <Typography variant="body2">
                  <strong>Alternate Phone:</strong> {selectedStudent.altContactNumber || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Present Address:</strong> {selectedStudent.address}
                </Typography>
                <Typography variant="body2">
                  <strong>Permanent Address:</strong> {selectedStudent.permanentAddress || 'N/A'}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Academic Information
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                <Typography variant="body2">
                  <strong>Course Package:</strong> {selectedStudent.course}
                </Typography>
                <Typography variant="body2">
                  <strong>Package Value:</strong> {selectedStudent.packageValue || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Package Duration:</strong> {selectedStudent.packageDuration || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Registration Date:</strong>{' '}
                  {selectedStudent.registrationDate ? new Date(selectedStudent.registrationDate).toLocaleDateString() : 'N/A'}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Status Information
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                <Typography variant="body2">
                  <strong>Status:</strong>{' '}
                  <StatusChip
                    label={selectedStudent.status?.toUpperCase()}
                    status={selectedStudent.status}
                    size="small"
                  />
                </Typography>
                <Typography variant="body2">
                  <strong>Package Price:</strong> ${selectedStudent.paymentAmount}
                </Typography>
                {selectedStudent.paymentMethod && (
                  <Typography variant="body2">
                    <strong>Payment Method:</strong> {selectedStudent.paymentMethod}
                  </Typography>
                )}
                {selectedStudent.transactionId && (
                  <Typography variant="body2">
                    <strong>Transaction ID:</strong> {selectedStudent.transactionId}
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setViewDialogOpen(false)} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Edit Dialog
  const EditDialog = () => {
    const [formData, setFormData] = useState(selectedStudent || {});

    useEffect(() => {
      if (selectedStudent) {
        setFormData(selectedStudent);
      }
    }, [selectedStudent]);

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
      const updateData = {
        name: formData.fullName,
        email: formData.email,
        contactNumber: formData.phone,
        presentAddress: formData.address,
        packageDetails: formData.course,
        packagePrice: formData.paymentAmount,
        status: formData.status
      };
      handleEdit(updateData);
    };

    return (
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName || ''}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course Package"
                name="course"
                value={formData.course || ''}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Package Price"
                name="paymentAmount"
                type="number"
                value={formData.paymentAmount || ''}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status || ''}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={2}
                value={formData.address || ''}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Delete Confirmation Dialog
  const DeleteDialog = () => (
    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete student "{selectedStudent?.fullName}"?
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleDelete} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Container maxWidth="xl" className="py-4">
      <StyledPaper>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          mb={3}
        >
          <Typography variant="h5" fontWeight={600}>
            Student Management
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchStudents}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          mb={3}
        >
          <TextField
            placeholder="Search by name, email or ID..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Loading State */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Desktop Table View */}
            <DesktopTableView />

            {/* Mobile Card View */}
            <MobileCardView />

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredStudents.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </StyledPaper>

      {/* Dialogs */}
      <ViewDetailsDialog />
      <EditDialog />
      <DeleteDialog />

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

export default StudentList;