// src/components/admin/AdminLogin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Snackbar,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LockPerson,
  Email as EmailIcon,
  VpnKey as PasswordIcon
} from '@mui/icons-material';
import adminAPI from '../../services/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Redirect if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is already logged in
        if (adminAPI.isLoggedIn()) {
          navigate('/admindashboard');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const validate = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.email) {
      tempErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      tempErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    
    try {
      const response = await adminAPI.login(formData.email, formData.password);
      
      if (response.success) {
        setSnackbar({
          open: true,
          message: '✅ Login successful! Redirecting to dashboard...',
          severity: 'success'
        });
        
        setTimeout(() => {
          navigate('/admindashboard');
        }, 1500);
      } else {
        setSnackbar({
          open: true,
          message: response.message || '❌ Login failed. Please check your credentials.',
          severity: 'error'
        });
        setFormData(prev => ({ ...prev, password: "" }));
      }
    } catch (error) {
      console.error('Login error:', error);
      setSnackbar({
        open: true,
        message: 'Network error. Please check if backend server is running.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center',
      py: 4,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Paper elevation={10} sx={{ 
        p: 4, 
        borderRadius: 4,
        width: '100%',
        background: 'white'
      }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <IconButton 
            sx={{ 
              bgcolor: '#e91e63', 
              color: 'white', 
              mb: 2,
              width: 70,
              height: 70,
              '&:hover': { bgcolor: '#c2185b' }
            }}
          >
            <LockPerson sx={{ fontSize: 40 }} />
          </IconButton>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Admin Login
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Intense Beauty Academy Management System
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
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
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={!!errors.password}
            helperText={errors.password}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PasswordIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ 
              mt: 3, 
              py: 1.5, 
              borderRadius: 2,
              background: "linear-gradient(45deg, #e91e63, #ff6f91)",
              fontWeight: "bold",
              fontSize: "1rem",
              '&:hover': { background: "linear-gradient(45deg, #c2185b, #e91e63)" }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "SIGN IN"}
          </Button>
        </form>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Secure Admin Access Only
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Demo: admin@beautyacademy.com / admin123
          </Typography>
        </Box>
      </Paper>

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

export default AdminLogin;