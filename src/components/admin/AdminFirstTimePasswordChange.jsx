// src/admin/FirstTimePasswordChange.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const API_BASE_URL = 'http://localhost:5000';

export default function FirstTimePasswordChange() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    }
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Check if user is authenticated and needs password change
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isFirstTime = localStorage.getItem('isFirstTimeLogin');
    
    if (!token) {
      navigate('/admin/login');
    }
    
    if (!isFirstTime) {
      // If not first time login, redirect to dashboard
      const role = localStorage.getItem('userRole');
      if (role === 'hr_manager') {
        navigate('/hr/dashboard');
      } else if (role === 'employee') {
        navigate('/employee/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    }
  }, [navigate]);

  // Check password strength
  const checkPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@$!%*?&#]/.test(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    
    let message = '';
    if (score <= 2) message = 'Weak';
    else if (score <= 4) message = 'Medium';
    else message = 'Strong';
    
    return { score, message, checks };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    
    if (name === 'newPassword') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const { newPassword, confirmPassword } = formData;
    
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    } else if (passwordStrength.score < 4) {
      newErrors.newPassword = 'Please meet all password requirements below';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_BASE_URL}/admin/first-time-password`,
        {
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Password change response:", response.data);
      
      if (response.data.success) {
        // Clear first time login flag
        localStorage.removeItem('isFirstTimeLogin');
        
        // Update token if provided
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        
        // Update user data if provided
        if (response.data.data) {
          localStorage.setItem('userData', JSON.stringify(response.data.data));
          localStorage.setItem('userName', response.data.data.name);
          localStorage.setItem('userRole', response.data.data.role);
        }
        
        setSnackbar({
          open: true,
          message: response.data.message || '✅ Password changed successfully! Redirecting to dashboard...',
          severity: 'success'
        });
        
        // Redirect after 2 seconds
        setTimeout(() => {
          const role = localStorage.getItem('userRole');
          if (role === 'hr_manager') {
            navigate('/hr/dashboard');
          } else if (role === 'employee') {
            navigate('/employee/dashboard');
          } else {
            navigate('/admin/dashboard');
          }
        }, 2000);
      } else {
        setSnackbar({
          open: true,
          message: response.data.message || 'Failed to change password',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Password change error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Error changing password. Please try again.';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
      
      // Handle expired token
      if (error.response?.status === 401) {
        localStorage.clear();
        setTimeout(() => {
          navigate('/admin/login');
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Container maxWidth="md">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <IconButton 
              sx={{ 
                bgcolor: "#e91e63", 
                color: "white", 
                mb: 2, 
                "&:hover": { bgcolor: "#c2185b" } 
              }}
            >
              <LockResetIcon fontSize="large" />
            </IconButton>
            <Typography variant="h4" fontWeight="bold" color="primary">
              First Time Login
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Please change your default password to continue
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            <Step completed={activeStep > 0}>
              <StepLabel>Create New Password</StepLabel>
            </Step>
          </Stepper>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              margin="normal"
              value={formData.newPassword}
              onChange={handleInputChange}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
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

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <Box sx={{ mt: 1, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="caption" fontWeight="bold">
                    Password Strength:
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: passwordStrength.score <= 2 ? '#f44336' : 
                             passwordStrength.score <= 4 ? '#ff9800' : '#4caf50',
                      fontWeight: 'bold'
                    }}
                  >
                    {passwordStrength.message}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(passwordStrength.score / 5) * 100}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: passwordStrength.score <= 2 ? '#f44336' : 
                               passwordStrength.score <= 4 ? '#ff9800' : '#4caf50'
                    }
                  }}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                  {Object.entries(passwordStrength.checks).map(([key, isValid]) => (
                    <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {isValid ? 
                        <CheckCircleIcon sx={{ fontSize: 14, color: '#4caf50' }} /> : 
                        <ErrorIcon sx={{ fontSize: 14, color: '#f44336' }} />
                      }
                      <Typography variant="caption" color={isValid ? 'success.main' : 'error.main'}>
                        {key === 'length' ? 'Min 8 chars' :
                         key === 'uppercase' ? 'Uppercase' :
                         key === 'lowercase' ? 'Lowercase' :
                         key === 'number' ? 'Number' : 'Special char (@$!%*?&#)'}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              margin="normal"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                mt: 4, 
                py: 1.5, 
                borderRadius: 2,
                background: "linear-gradient(45deg, #e91e63, #ff6f91)",
                fontWeight: "bold",
                "&:hover": { background: "linear-gradient(45deg, #c2185b, #e91e63)" }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Change Password & Continue"}
            </Button>
          </form>

          <Box sx={{ mt: 3, p: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
            <Typography variant="caption" color="textSecondary" display="block" align="center">
              <strong>⚠️ Security Tips:</strong>
              <br />
              • Use a strong password that you haven't used before
              <br />
              • Never share your password with anyone
              <br />
              • Forgot password? Contact system administrator
            </Typography>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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