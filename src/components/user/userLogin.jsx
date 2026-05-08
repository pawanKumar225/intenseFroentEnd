import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Alert,
  Stack,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon,
  Login as LoginIcon,
  Cancel as CancelIcon,
  HowToReg as RegisterIcon
} from '@mui/icons-material';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link } from 'react-router-dom';
const UserLoginForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Demo credentials for testing
  const validCredentials = {
    username: 'demo@intensebeauty.com',
    password: 'demo123'
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        if (!value.trim()) return 'Username is required';
        if (value.trim().length < 3) return 'Username must be at least 3 characters';
        if (!/^[a-zA-Z0-9@._-]+$/.test(value.trim())) return 'Username contains invalid characters';
        return '';

      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    // Clear login error when user starts typing
    if (loginError) {
      setLoginError('');
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validateForm = () => {
    const newErrors = {};
    const usernameError = validateField('username', formData.username);
    const passwordError = validateField('password', formData.password);
    
    if (usernameError) newErrors.username = usernameError;
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      username: true,
      password: true
    });
    
    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        // Check credentials
        if (formData.username === validCredentials.username && 
            formData.password === validCredentials.password) {
          setLoginSuccess(true);
          setLoginError('');
          
          // Store user data in localStorage
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('user', JSON.stringify({
            username: formData.username,
            loginTime: new Date().toISOString()
          }));
          
          // Redirect or show success
          setTimeout(() => {
            alert('Login Successful! Redirecting to dashboard...');
            resetForm();
            setLoginSuccess(false);
            // window.location.href = '/dashboard'; // Uncomment for redirect
          }, 1500);
        } else {
          setLoginError('Invalid username or password. Please try again.');
          setLoginSuccess(false);
        }
        setIsLoading(false);
      }, 1000);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: ''
    });
    setErrors({});
    setTouched({});
    setLoginError('');
    setLoginSuccess(false);
    setShowPassword(false);
  };

  const handleRegisterClick = () => {
    // Redirect to registration page or open registration modal
    alert('Redirecting to Registration Page...');
    window.location.href = '/user/register'; // Uncomment for redirect
  };

  const showError = (field) => {
    return touched[field] && errors[field] ? errors[field] : '';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            borderRadius: '20px',
            overflow: 'hidden',
            background: 'white',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)'
            }
          }}
        >
          {/* Header Section with Logo */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
              padding: '30px 20px',
              textAlign: 'center',
              color: 'white'
            }}
          >
            <img
              src="/logo.png"
              alt="Intense Beauty Academy Logo"
              style={{
                maxWidth: '100px',
                height: 'auto',
                marginBottom: '15px',
                borderRadius: '10px'
              }}
            />
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{
                fontWeight: 'bold',
                letterSpacing: '1px'
              }}
            >
              INTENSE BEAUTY ACADEMY
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                opacity: 0.9,
                marginTop: '5px'
              }}
            >
              Welcome Back! Please login to your account
            </Typography>
          </Box>

          {/* Login Form Section */}
          <Box sx={{ padding: { xs: '20px', sm: '40px' } }}>
            {loginSuccess && (
              <Alert
                severity="success"
                sx={{
                  borderRadius: '10px',
                  marginBottom: '20px',
                  animation: 'slideIn 0.5s ease-in-out'
                }}
              >
                ✅ Login successful! Redirecting...
              </Alert>
            )}

            {loginError && (
              <Alert
                severity="error"
                sx={{
                  borderRadius: '10px',
                  marginBottom: '20px'
                }}
              >
                ❌ {loginError}
              </Alert>
            )}

            <form onSubmit={handleLogin} noValidate>
              {/* Username Field */}
              <TextField
                fullWidth
                label="Username / Email"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!showError('username')}
                helperText={showError('username')}
                required
                placeholder="Enter your username or email"
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color={showError('username') ? 'error' : 'primary'} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  }
                }}
              />

              {/* Password Field */}
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!showError('password')}
                helperText={showError('password')}
                required
                placeholder="Enter your password"
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color={showError('password') ? 'error' : 'primary'} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  }
                }}
              />

              {/* Forgot Password Link */}
              <Box sx={{ textAlign: 'right', mt: 1, mb: 3 }}>
                <Button
                  href="#"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    color: '#ff6b6b',
                    '&:hover': {
                      background: 'transparent',
                      textDecoration: 'underline'
                    }
                  }}
                  onClick={() => alert('Password reset link will be sent to your email')}
                >
                  Forgot Password?
                </Button>
              </Box>

              {/* Buttons Section */}
              <Stack
                direction={isMobile ? "column" : "row"}
                spacing={2}
                sx={{ mt: 2 }}
              >
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  size="large"
                  onClick={resetForm}
                  startIcon={<CancelIcon />}
                  disabled={isLoading}
                  sx={{
                    borderRadius: '10px',
                    padding: '12px',
                    fontWeight: 'bold',
                    borderWidth: '2px',
                    '&:hover': {
                      borderWidth: '2px'
                    }
                  }}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  startIcon={<LoginIcon />}
                  disabled={isLoading}
                  sx={{
                    borderRadius: '10px',
                    padding: '12px',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #ff5252, #ff6b6b)'
                    }
                  }}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </Stack>

              {/* Divider */}
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="textSecondary">
                  OR
                </Typography>
              </Divider>

              {/* Register Link */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  New to Intense Beauty Academy?{' '}
                  {/* <Button
                    onClick={handleRegisterClick}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      color: '#ff6b6b',
                      '&:hover': {
                        background: 'transparent',
                        textDecoration: 'underline'
                      }
                    }}
                    startIcon={<RegisterIcon />}
                  >
                    Register Here
                  </Button> */}
                  <Link to="/user/register" style={{ color: '#e91e63', fontWeight: 'bold', textDecoration: 'none' }}>
              Register Here
            </Link>
                </Typography>
              </Box>

              {/* Demo Credentials Info */}
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  background: '#f8f9fa',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}
              >
                <Typography variant="caption" color="textSecondary" display="block">
                  Demo Credentials:
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block">
                  Username: demo@intensebeauty.com
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block">
                  Password: demo123
                </Typography>
              </Box>
            </form>
          </Box>
        </Paper>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" sx={{ color: 'white', opacity: 0.8 }}>
            © 2024 Intense Beauty Academy. All rights reserved.
          </Typography>
        </Box>
      </Container>

      {/* Add animation styles */}
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateY(-20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default UserLoginForm;