
// src/user/userLogin.jsx
import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff, School as SchoolIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const UserLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/user/login`, {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        const { token, user, requiresPasswordChange } = response.data.data;
        
        // Clear any existing data
        localStorage.clear();
        
        // Store student-specific data
        localStorage.setItem('studentToken', token);
        localStorage.setItem('userRole', 'student');
        localStorage.setItem('studentData', JSON.stringify(user));
        localStorage.setItem('isFirstTimeLogin', requiresPasswordChange || false);
        
        console.log('Login successful, redirecting...');
        
        // Use window.location for hard redirect to ensure clean state
        if (requiresPasswordChange) {
          window.location.href = '/user/first-time-password';
        } else {
          window.location.href = '/user/dashboard';
        }
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: '#f5f5f5' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
        <Box textAlign="center" mb={3}>
          <SchoolIcon sx={{ fontSize: 60, color: '#ff6b6b' }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#ff6b6b' }}>Student Login</Typography>
          <Typography variant="body2" color="textSecondary">Welcome back! Please login to your account</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} margin="normal" required sx={{ mb: 2 }} />
          <TextField fullWidth label="Password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} margin="normal" required
            InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }}
          />
          <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, mb: 2, bgcolor: '#ff6b6b', '&:hover': { bgcolor: '#ff5252' }, py: 1.5 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
          <Box textAlign="center">
            <Typography variant="body2" color="textSecondary">
              Don't have an account?{' '}
              <Button color="primary" onClick={() => navigate('/user/register')} sx={{ textTransform: 'none', color: '#ff6b6b' }}>Register here</Button>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default UserLogin;