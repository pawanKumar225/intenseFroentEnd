// src/admin/AdminProfile.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Card,
  CardContent,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  Stack
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const AdminProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [adminData, setAdminData] = useState({
    _id: '',
    employeeId: '',
    name: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    salary: '',
    isActive: true,
    createdAt: '',
    lastLogin: ''
  });
  const [formData, setFormData] = useState({});

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('adminToken');
  };

  // Fetch admin profile
  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/admin/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAdminData(response.data.data);
        setFormData(response.data.data);
      } else {
        showAlert('error', response.data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/admin/login');
      } else {
        showAlert('error', error.response?.data?.message || 'Error fetching profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Cancel edit - reset form data
      setFormData(adminData);
    }
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = getAuthToken();
      const response = await axios.put(`${API_BASE_URL}/admin/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAdminData(response.data.data);
        setFormData(response.data.data);
        setEditMode(false);
        showAlert('success', 'Profile updated successfully');
        
        // Update stored admin data
        const storedAdmin = localStorage.getItem('adminData');
        if (storedAdmin) {
          const parsed = JSON.parse(storedAdmin);
          localStorage.setItem('adminData', JSON.stringify({ ...parsed, ...response.data.data }));
        }
      } else {
        showAlert('error', response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showAlert('error', error.response?.data?.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'super_admin': return '#f44336';
      case 'hr_manager': return '#4caf50';
      case 'admin': return '#2196f3';
      default: return '#ff9800';
    }
  };

  const getRoleLabel = (role) => {
    switch(role) {
      case 'super_admin': return 'Super Administrator';
      case 'hr_manager': return 'HR Manager';
      case 'admin': return 'Admin';
      default: return 'Employee';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 2 }} onClose={() => setAlert({ show: false })}>
          {alert.message}
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            My Profile
          </Typography>
          <Typography variant="body2" color="textSecondary">
            View and manage your profile information
          </Typography>
        </Box>
        <Box>
          {!editMode ? (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEditToggle}
              sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
            >
              Edit Profile
            </Button>
          ) : (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleEditToggle}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saving}
                sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#45a049' } }}
              >
                {saving ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </Stack>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Profile Image & Basic Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: getRoleColor(adminData.role),
                  fontSize: 48,
                  margin: '0 auto',
                  mb: 2
                }}
              >
                {adminData.name?.charAt(0)?.toUpperCase() || 'A'}
              </Avatar>
              {editMode && (
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    bgcolor: 'white',
                    '&:hover': { bgcolor: '#f5f5f5' }
                  }}
                  size="small"
                >
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {adminData.name}
            </Typography>
            <Chip
              label={getRoleLabel(adminData.role)}
              sx={{
                bgcolor: getRoleColor(adminData.role),
                color: 'white',
                fontWeight: 'bold',
                mb: 2
              }}
            />
            <Divider sx={{ my: 2 }} />
            <Box textAlign="left">
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Employee ID
              </Typography>
              <Typography variant="body1" fontWeight="medium" sx={{ mb: 2 }}>
                {adminData.employeeId || 'N/A'}
              </Typography>

              <Typography variant="body2" color="textSecondary" gutterBottom>
                Status
              </Typography>
              <Chip
                label={adminData.isActive ? 'Active' : 'Inactive'}
                color={adminData.isActive ? 'success' : 'error'}
                size="small"
                sx={{ mb: 2 }}
              />

              <Typography variant="body2" color="textSecondary" gutterBottom>
                Member Since
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatDate(adminData.createdAt)}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Profile Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
              Personal Information
            </Typography>
            
            <Grid container spacing={3}>
              {/* Full Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={editMode ? formData.name : adminData.name}
                  onChange={handleInputChange}
                  disabled={!editMode || saving}
                  variant={editMode ? "outlined" : "filled"}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>

              {/* Email Address */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={editMode ? formData.email : adminData.email}
                  onChange={handleInputChange}
                  disabled={!editMode || saving}
                  variant={editMode ? "outlined" : "filled"}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>

              {/* Phone Number */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={editMode ? formData.phone : adminData.phone}
                  onChange={handleInputChange}
                  disabled={!editMode || saving}
                  variant={editMode ? "outlined" : "filled"}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>

              {/* Department */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Department"
                  name="department"
                  value={editMode ? formData.department : adminData.department}
                  onChange={handleInputChange}
                  disabled={!editMode || saving}
                  variant={editMode ? "outlined" : "filled"}
                  InputProps={{
                    startAdornment: <BusinessIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>

              {/* Role (Read-only) */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Role"
                  value={getRoleLabel(adminData.role)}
                  disabled={true}
                  variant="filled"
                  InputProps={{
                    startAdornment: <BadgeIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>

              {/* Salary (if applicable) */}
              {adminData.salary && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Salary"
                    name="salary"
                    value={editMode ? formData.salary : adminData.salary}
                    onChange={handleInputChange}
                    disabled={!editMode || saving}
                    variant={editMode ? "outlined" : "filled"}
                  />
                </Grid>
              )}
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Account Information */}
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
              Account Information
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <BadgeIcon sx={{ mr: 1, color: '#1976d2' }} />
                      <Typography variant="body2" color="textSecondary">
                        Last Login
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDate(adminData.lastLogin)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <LockIcon sx={{ mr: 1, color: '#ff9800' }} />
                      <Typography variant="body2" color="textSecondary">
                        Security
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      variant="outlined"
                      color="warning"
                      onClick={() => navigate('/admin/change-password')}
                    >
                      Change Password
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Edit Mode Note */}
            {editMode && (
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>Note:</strong> Changes to email or role may require re-authentication. 
                  Some fields may be restricted based on your permissions.
                </Typography>
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminProfile;