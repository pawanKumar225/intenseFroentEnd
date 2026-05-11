// src/components/admin/FirstTimePasswordChange.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Container,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Divider,
  Fade,
  Grow
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useNavigate } from 'react-router-dom';
import adminAPI from '../../services/api';

const FirstTimePasswordChange = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [success, setSuccess] = useState(false);

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('adminData') || localStorage.getItem('userData') || '{}');
  const userName = user.name || 'User';

  // Check if user is logged in and needs password change
  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    const isFirstTime = localStorage.getItem('isFirstTimeLogin');
    
    if (!token) {
      // No token, redirect to login
      navigate('/admin/login');
    } else if (!isFirstTime) {
      // Not first time login, redirect to dashboard
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'super_admin' || userRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'hr_manager') {
        navigate('/hr/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    }
  }, [navigate]);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('At least 8 characters');
    if (!/(?=.*[a-z])/.test(password)) errors.push('One lowercase letter');
    if (!/(?=.*[A-Z])/.test(password)) errors.push('One uppercase letter');
    if (!/(?=.*\d)/.test(password)) errors.push('One number');
    if (!/(?=.*[@$!%*?&])/.test(password)) errors.push('One special character (@$!%*?&)');
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Real-time validation for new password
    if (name === 'newPassword') {
      const validationErrors = validatePassword(value);
      if (validationErrors.length > 0) {
        setErrors(prev => ({ ...prev, passwordStrength: validationErrors }));
      } else {
        setErrors(prev => ({ ...prev, passwordStrength: [] }));
      }
    }
    
    // Real-time match validation
    if (name === 'confirmPassword' || (name === 'newPassword' && formData.confirmPassword)) {
      const confirmValue = name === 'confirmPassword' ? value : formData.confirmPassword;
      const newPassValue = name === 'newPassword' ? value : formData.newPassword;
      
      if (confirmValue && newPassValue !== confirmValue) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const validate = () => {
    let tempErrors = {};
    
    if (!formData.newPassword) {
      tempErrors.newPassword = 'New password is required';
    } else {
      const validationErrors = validatePassword(formData.newPassword);
      if (validationErrors.length > 0) {
        tempErrors.newPassword = `Password must contain: ${validationErrors.join(', ')}`;
      }
    }
    
    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      const response = await adminAPI.firstTimePasswordChange(
        formData.newPassword,
        formData.confirmPassword
      );
      
      if (response.success) {
        setSuccess(true);
        setSnackbar({
          open: true,
          message: 'Password changed successfully! Redirecting to login...',
          severity: 'success'
        });
        
        // Clear stored credentials and first time flag
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        localStorage.removeItem('userData');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('isFirstTimeLogin');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/admin/login');
        }, 3000);
      } else {
        setSnackbar({
          open: true,
          message: response.message || 'Failed to change password',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Password change error:', error);
      setSnackbar({
        open: true,
        message: 'Network error. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center',
      py: 4,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Grow in={true} timeout={800}>
        <Card sx={{ 
          borderRadius: 4, 
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <Box sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 4,
            textAlign: 'center'
          }}>
            <SecurityIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              First Time Login
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Welcome, {userName}! Please set your new password
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {!success ? (
              <form onSubmit={handleSubmit}>
                {/* New Password Field */}
                <TextField
                  fullWidth
                  name="newPassword"
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={handleChange}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <Box sx={{ mt: 1, mb: 2 }}>
                    <Typography variant="caption" color="textSecondary">
                      Password requirements:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                      {[
                        { text: '8+ characters', check: formData.newPassword.length >= 8 },
                        { text: 'Uppercase', check: /[A-Z]/.test(formData.newPassword) },
                        { text: 'Lowercase', check: /[a-z]/.test(formData.newPassword) },
                        { text: 'Number', check: /\d/.test(formData.newPassword) },
                        { text: 'Special char', check: /[@$!%*?&]/.test(formData.newPassword) }
                      ].map((req, idx) => (
                        <Typography
                          key={idx}
                          variant="caption"
                          sx={{
                            color: req.check ? '#4caf50' : '#999',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            mr: 1
                          }}
                        >
                          {req.check ? '✓' : '○'} {req.text}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Confirm Password Field */}
                <TextField
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                {/* Password Match Indicator */}
                {formData.confirmPassword && formData.newPassword && (
                  <Box sx={{ mt: 1, mb: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: formData.newPassword === formData.confirmPassword ? '#4caf50' : '#f44336',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      {formData.newPassword === formData.confirmPassword ? (
                        <><CheckCircleIcon fontSize="small" /> Passwords match</>
                      ) : (
                        <>⚠️ Passwords do not match</>
                      )}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />

                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    This is your first time logging in. Please set a new password.
                    After changing your password, you'll receive a confirmation email.
                  </Typography>
                </Alert>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%)'
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
                </Button>
              </form>
            ) : (
              <Fade in={true}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircleIcon sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Password Changed Successfully!
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                    A confirmation email has been sent to your registered email address.
                    Redirecting you to login page...
                  </Typography>
                  <CircularProgress size={32} />
                </Box>
              </Fade>
            )}
          </CardContent>
        </Card>
      </Grow>

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

export default FirstTimePasswordChange;