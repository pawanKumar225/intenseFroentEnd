// src/admin/AdminLogin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminAPI from "../../services/api";
import {
  Typography,
  Container,
  Paper,
  Box,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function AdminLogin() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [connectionError, setConnectionError] = useState(false);

  // Check if already logged in
  useEffect(() => {
   
    localStorage.clear();
  }, []);
   // Check if already logged in
    React.useEffect(() => {
     const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    if (token && userRole) {
      redirectBasedOnRole(userRole);
    }
    }, [navigate]);

  const redirectBasedOnRole = (role) => {
    switch(role) {
      case 'super_admin':
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'hr_manager':
      case 'HR':
        navigate('/hr/dashboard');
        break;
      case 'employee':
      case 'Employee':
        navigate('/employee/dashboard');
        break;
      default:
        navigate('/admin/dashboard');
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      const response = await adminAPI.login(formData.email, formData.password);
      console.log("Login response:", response);
      
      if (response.success) {
        // Store user data in localStorage
        localStorage.setItem('token', response.data?.token);
        localStorage.setItem('userEmail', formData.email);
        
        // Get user role from response
        const userRole = response.data?.admin?.role || response.role || 'admin';
        const userName = response.data?.admin?.name || response.name || formData.email.split('@')[0];
        
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userName', userName);
        localStorage.setItem('userData', JSON.stringify(response.data?.admin || response.user || {}));
        
        // Check if password needs to be changed
        if (response.data?.requiresPasswordChange === true) {
          // Store a flag that this is first time login
          localStorage.setItem('isFirstTimeLogin', 'true');
          
          setSnackbar({
            open: true,
            message: '🔐 First time login! Please change your password.',
            severity: 'info'
          });
          
          // Navigate to first-time password change page
          setTimeout(() => {
            navigate('/admin/first-time-password');
          }, 1500);
        } else {
          setSnackbar({
            open: true,
            message: `✅ Login successful! Redirecting to ${userRole} dashboard...`,
            severity: 'success'
          });
          
          // Redirect based on role
          setTimeout(() => {
            redirectBasedOnRole(userRole);
          }, 1500);
        }
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
        message: error.response?.data?.message || 'Network error. Please check if backend server is running.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (connectionError) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#ffebee' }}>
          <Typography variant="h5" color="error" gutterBottom>
            ⚠️ Backend Connection Error
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Cannot connect to backend server
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Please make sure:
            <br />✓ Backend server is running
            <br />✓ MongoDB is connected
            <br />✓ Port 5000 is not in use
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Retry Connection
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <div className="container-fluid login-page-bg" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="row min-vh-100 align-items-center justify-content-center p-3" style={{ width: '100%' }}>
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          <Paper 
            elevation={6} 
            sx={{ 
              p: 4, 
              borderRadius: 4, 
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.95)" 
            }}
          >
            <Box sx={{ mb: 3 }}>
              <IconButton 
                sx={{ 
                  bgcolor: "#e91e63", 
                  color: "white", 
                  mb: 2, 
                  "&:hover": { bgcolor: "#c2185b" } 
                }}
              >
                <LockPersonIcon fontSize="large" />
              </IconButton>
              <Typography variant="h4" fontWeight="bold" color="primary">
                Login
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Intense Beauty Academy Management
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={!!errors.email}
                helperText={errors.email}
                disabled={loading}
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
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={() => setShowPassword(!showPassword)} 
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
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
                  "&:hover": { background: "linear-gradient(45deg, #c2185b, #e91e63)" }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "SIGN IN"}
              </Button>
            </form>
          </Paper>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}