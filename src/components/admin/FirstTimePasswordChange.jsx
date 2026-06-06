// src/components/student/FirstTimePasswordChange.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Card,
  CardContent
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  VpnKey,
  Lock,
  CheckCircle,
  Security
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000';

const StudentFirstTimePasswordChange = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  // Get student info from localStorage
  const admin = JSON.parse(localStorage.getItem('adminData') || '{}');
  const AdminName = admin.name || 'Student';
console.log("Admin...............login.............first...........")
  // Check if user is logged in
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

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 6) errors.push('At least 6 characters');
    if (!/(?=.*[a-z])/.test(password)) errors.push('One lowercase letter');
    if (!/(?=.*[A-Z])/.test(password)) errors.push('One uppercase letter');
    if (!/(?=.*\d)/.test(password)) errors.push('One number');
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    
    // Clear specific error
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
    setError('');
    
    try {
      const token = localStorage.getItem('adminToken');
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
      
      if (response.data.success) {
        setSuccess(true);
        setActiveStep(1);
        
        // Clear stored credentials
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminToken');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/admin/login');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Set New Password', 'Confirmation'];

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center',
      py: 4
    }}>
      <Fade in={true} timeout={800}>
        <Paper elevation={10} sx={{ 
          borderRadius: 4, 
          overflow: 'hidden',
          width: '100%'
        }}>
          {/* Header */}
          <Box sx={{ 
            background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
            color: 'white',
            p: 4,
            textAlign: 'center'
          }}>
            <Security sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              First Time Login
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Welcome, {AdminName}! Please set your new password
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === 0 ? (
              <form onSubmit={handleSubmit}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

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
                        <VpnKey color="primary" />
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

                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <Box sx={{ mt: 1, mb: 2 }}>
                    <Typography variant="caption" color="textSecondary">
                      Password requirements:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                      {[
                        { text: '6+ characters', check: formData.newPassword.length >= 6 },
                        { text: 'Uppercase', check: /[A-Z]/.test(formData.newPassword) },
                        { text: 'Lowercase', check: /[a-z]/.test(formData.newPassword) },
                        { text: 'Number', check: /\d/.test(formData.newPassword) }
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
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                        <><CheckCircle fontSize="small" /> Passwords match</>
                      ) : (
                        <>⚠️ Passwords do not match</>
                      )}
                    </Typography>
                  </Box>
                )}

                <Alert severity="info" sx={{ mt: 2, mb: 3, borderRadius: 2 }}>
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
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #ff5252, #ff6b6b)'
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
                </Button>
              </form>
            ) : (
              <Fade in={true}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircle sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
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
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default StudentFirstTimePasswordChange;