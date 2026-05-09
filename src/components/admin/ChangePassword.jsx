// src/admin/ChangePassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Grid,
  Stack,
  InputAdornment,
  Divider,
  IconButton,
  LinearProgress,
  Container,
  useMediaQuery,
  useTheme,
  alpha
} from '@mui/material';
import {
  LockReset,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
  Security,
  VpnKey,
  Password as PasswordIcon
} from '@mui/icons-material';
import adminAPI from '../../services/api';
const ChangePassword = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  // Password strength checker
  const checkPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    setPasswordChecks(checks);
    
    const strength = Object.values(checks).filter(Boolean).length;
    setPasswordStrength(strength);
    return strength >= 4;
  };

  const validate = () => {
    let tempErrors = {};
    
    if (!formData.oldPassword) {
      tempErrors.oldPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      tempErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      tempErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!checkPasswordStrength(formData.newPassword)) {
      tempErrors.newPassword = 'Password is too weak';
    }
    
    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return '#f44336';
    if (passwordStrength === 3) return '#ff9800';
    return '#4caf50';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength === 3) return 'Medium';
    return 'Strong';
  };

  const handleNewPasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, newPassword });
    if (newPassword) {
      checkPasswordStrength(newPassword);
    } else {
      setPasswordStrength(0);
      setPasswordChecks({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      });
    }
  };

 
 const handleSubmit = async () => {
    if (!validate()) return;
    
    setLoading(true);
    
    try {
     
      const response = await adminAPI.changePassword(formData.oldPassword, formData.newPassword);
      const data = await response.json();
      console.log("password change successfully.........", data)
      if (data.success) {
        setSnackbar({
          open: true,
          message: '✅ Password changed successfully! Please login again.',
          severity: 'success'
        });
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordStrength(0);
        
        setTimeout(() => {
          adminAPI.logout();
          window.location.href = '/admin/login';
        }, 2000);
      } else {
        setSnackbar({
          open: true,
          message: data.message || 'Failed to change password',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Change password error:', error);
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
          Change Password
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Update your password to keep your account secure
        </Typography>
      </Box>

      {/* Password Change Form */}
      <Card sx={{ borderRadius: 4 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box display="flex" alignItems="center" gap={1} sx={{ mb: 3 }}>
            <Security sx={{ color: '#e91e63', fontSize: 28 }} />
            <Typography variant="h6" fontWeight={600}>Security Settings</Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />

          {/* Old Password */}
          <TextField
            fullWidth
            label="Current Password"
            type={showOldPassword ? "text" : "password"}
            variant="outlined"
            margin="normal"
            value={formData.oldPassword}
            onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
            error={!!errors.oldPassword}
            helperText={errors.oldPassword}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><VpnKey sx={{ color: '#666' }} /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* New Password */}
          <TextField
            fullWidth
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            variant="outlined"
            margin="normal"
            value={formData.newPassword}
            onChange={handleNewPasswordChange}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><PasswordIcon sx={{ color: '#666' }} /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Password Strength Indicator */}
          {formData.newPassword && (
            <Box sx={{ mb: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="caption" color="textSecondary">Password Strength:</Typography>
                <Typography variant="caption" fontWeight={600} sx={{ color: getPasswordStrengthColor() }}>
                  {getPasswordStrengthText()}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(passwordStrength / 5) * 100} 
                sx={{ 
                  height: 6, 
                  borderRadius: 3,
                  bgcolor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': { bgcolor: getPasswordStrengthColor() }
                }} 
              />
              <Grid container spacing={1} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    {passwordChecks.length ? 
                      <CheckCircle sx={{ fontSize: 14, color: '#4caf50' }} /> : 
                      <Cancel sx={{ fontSize: 14, color: '#ccc' }} />}
                    <Typography variant="caption">Min 8 characters</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    {passwordChecks.uppercase ? 
                      <CheckCircle sx={{ fontSize: 14, color: '#4caf50' }} /> : 
                      <Cancel sx={{ fontSize: 14, color: '#ccc' }} />}
                    <Typography variant="caption">Uppercase letter</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    {passwordChecks.lowercase ? 
                      <CheckCircle sx={{ fontSize: 14, color: '#4caf50' }} /> : 
                      <Cancel sx={{ fontSize: 14, color: '#ccc' }} />}
                    <Typography variant="caption">Lowercase letter</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    {passwordChecks.number ? 
                      <CheckCircle sx={{ fontSize: 14, color: '#4caf50' }} /> : 
                      <Cancel sx={{ fontSize: 14, color: '#ccc' }} />}
                    <Typography variant="caption">Number</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    {passwordChecks.special ? 
                      <CheckCircle sx={{ fontSize: 14, color: '#4caf50' }} /> : 
                      <Cancel sx={{ fontSize: 14, color: '#ccc' }} />}
                    <Typography variant="caption">Special character</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Confirm Password */}
          <TextField
            fullWidth
            label="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            variant="outlined"
            margin="normal"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><PasswordIcon sx={{ color: '#666' }} /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Security Tips */}
          <Paper 
            sx={{ 
              p: { xs: 2, sm: 2.5 }, 
              mb: 3, 
              bgcolor: alpha('#ff9800', 0.1), 
              borderRadius: 2,
              borderLeft: `4px solid #ff9800`
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Security sx={{ fontSize: 18, color: '#ff9800' }} /> 
              Password Security Tips
            </Typography>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="textSecondary" component="div">
                • Use at least 8 characters
              </Typography>
              <Typography variant="caption" color="textSecondary" component="div">
                • Include uppercase and lowercase letters
              </Typography>
              <Typography variant="caption" color="textSecondary" component="div">
                • Add numbers and special characters
              </Typography>
              <Typography variant="caption" color="textSecondary" component="div">
                • Avoid using common words or personal information
              </Typography>
            </Stack>
          </Paper>

          {/* Submit Button */}
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              py: 1.5,
              background: "linear-gradient(45deg, #e91e63, #ff6f91)",
              '&:hover': {
                background: "linear-gradient(45deg, #c2185b, #e91e63)"
              }
            }}
          >
            {loading ? 
              <CircularProgress size={24} sx={{ color: 'white' }} /> : 
              <><LockReset sx={{ mr: 1 }} /> Update Password</>
            }
          </Button>
        </CardContent>
      </Card>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ChangePassword;