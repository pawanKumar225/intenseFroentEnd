// src/admin/CreateUser.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Grid,
  Stack,
  InputAdornment,
  Divider,
  Chip,
  Avatar,
  Container,
  useMediaQuery,
  useTheme,
  alpha
} from '@mui/material';
import {
  PersonAdd,
  Email,
  VpnKey,
  Business,
  CheckCircle,
  Security as SecurityIcon,
  Send as SendIcon
} from '@mui/icons-material';
import adminAPI from '../../services/api';
import { getLoggedInUser } from '../../utils/auth';

const roleOptions = [
  { value: '', label: 'Select Role', color: '#9e9e9e', disabled: true, icon: '🔘' },
  { value: 'super_admin', label: 'Super Admin', color: '#e91e63', description: 'Full system access', icon: '👑' },
  { value: 'hr_manager', label: 'HR Manager', color: '#2196f3', description: 'Manage employees and HR operations', icon: '👥' },
  { value: 'admin', label: 'Admin', color: '#4caf50', description: 'Manage courses and content', icon: '⚙️' },
  { value: 'employee', label: 'Employee', color: '#ff9800', description: 'Basic access to assigned tasks', icon: '👤' }
];

const CreateUser = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    department: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [createdUser, setCreatedUser] = useState(null);

  const validate = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.name) {
      tempErrors.name = 'Full name is required';
    } else if (formData.name.length < 2) {
      tempErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      tempErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.role) {
      tempErrors.role = 'Please select a role';
    } else if (formData.role === '') {
      tempErrors.role = 'Please select a valid role';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // const handleCreateUser = async () => {
  //   if (!validate()) return;
    
  //   setLoading(true);
  //   setCreatedUser(null);
    
  //   // Simulate API call

    
  //   setTimeout(() => {
  //     setCreatedUser({
  //       name: formData.name,
  //       email: formData.email,
  //       role: formData.role
  //     });
  //     setSnackbar({
  //       open: true,
  //       message: `✅ ${formData.name} created successfully! Credentials sent to ${formData.email}`,
  //       severity: 'success'
  //     });
  //     setFormData({
  //       name: '',
  //       email: '',
  //       role: '',
  //       phone: '',
  //       department: ''
  //     });
  //     setErrors({});
  //     setLoading(false);
  //   }, 1500);
  // };



  const handleCreateUser = async () => {
    if (!validate()) return;
    
    setLoading(true);
    setCreatedUser(null);
    
    try {
      const token = adminAPI.getToken();
      const response = await fetch('http://localhost:5000/api/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCreatedUser(data.data);
        setSnackbar({
          open: true,
          message: `✅ ${formData.name} created successfully! Credentials sent to ${formData.email}`,
          severity: 'success'
        });
        setFormData({
          name: '',
          email: '',
          role: '',
          phone: '',
          department: ''
        });
        setErrors({});
      } else {
        setSnackbar({
          open: true,
          message: data.message || 'Failed to create user',
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
  const getRoleColor = (roleValue) => {
    const option = roleOptions.find(opt => opt.value === roleValue);
    return option ? option.color : '#666';
  };

  const getRoleIcon = (roleValue) => {
    const option = roleOptions.find(opt => opt.value === roleValue);
    return option ? option.icon : '👤';
  };

  return (
    <Container maxWidth="md" sx={{ py: 3, px: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: '#1e293b',
            fontSize: { xs: '1.5rem', sm: '2rem' },
            mb: 0.5
          }}
        >
          Create New User
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Add new administrators, HR managers, or employees to the system
        </Typography>
      </Box>

      {/* Form Card */}
      <Card sx={{ borderRadius: 4, mb: 4 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Fill in the details below to create a new user. Credentials will be sent automatically to their email.
          </Typography>

          {/* Full Name */}
          <TextField
            fullWidth
            label="Full Name"
            variant="outlined"
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Business sx={{ color: '#666' }} /></InputAdornment>
            }}
          />

          {/* Email */}
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            variant="outlined"
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Email sx={{ color: '#666' }} /></InputAdornment>
            }}
          />

          {/* Role Dropdown */}
          <TextField
            fullWidth
            select
            label="Role"
            variant="outlined"
            margin="normal"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            error={!!errors.role}
            helperText={errors.role}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><VpnKey sx={{ color: '#666' }} /></InputAdornment>
            }}
          >
            {roleOptions.map((option) => (
              <MenuItem 
                key={option.value} 
                value={option.value}
                disabled={option.disabled || false}
                sx={{ 
                  color: option.color,
                  fontWeight: formData.role === option.value ? 'bold' : 'normal',
                  opacity: option.disabled ? 0.6 : 1,
                  '&:hover': { backgroundColor: alpha(option.color, 0.1) }
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography component="span" sx={{ fontSize: '1.2rem' }}>{option.icon}</Typography>
                  <Typography component="span">{option.label}</Typography>
                  {option.description && (
                    <Typography component="span" variant="caption" sx={{ ml: 1, color: '#64748b' }}>
                      - {option.description}
                    </Typography>
                  )}
                </Box>
              </MenuItem>
            ))}
          </TextField>

          {/* Create User Button */}
          <Button
            variant="contained"
            size="large"
            onClick={handleCreateUser}
            disabled={loading}
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              py: 1.5,
              mt: 2,
              background: "linear-gradient(45deg, #e91e63, #ff6f91)",
              '&:hover': {
                background: "linear-gradient(45deg, #c2185b, #e91e63)"
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              <><SendIcon sx={{ mr: 1 }} /> Create User</>
            )}
          </Button>

          {/* What happens next? Section */}
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 3, 
              mt: 4, 
              bgcolor: '#f0f4ff',
              borderRadius: 3
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon color="primary" /> What happens next?
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: alpha('#1976d2', 0.1), color: '#1976d2', width: 32, height: 32 }}>1</Avatar>
                <Typography variant="body2">User receives welcome email with credentials</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: alpha('#1976d2', 0.1), color: '#1976d2', width: 32, height: 32 }}>2</Avatar>
                <Typography variant="body2">Auto-generated secure password is sent to their email</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: alpha('#1976d2', 0.1), color: '#1976d2', width: 32, height: 32 }}>3</Avatar>
                <Typography variant="body2">User must change password on first login</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: alpha('#1976d2', 0.1), color: '#1976d2', width: 32, height: 32 }}>4</Avatar>
                <Typography variant="body2">User can access system based on role permissions</Typography>
              </Box>
            </Stack>
          </Paper>
        </CardContent>
      </Card>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateUser;