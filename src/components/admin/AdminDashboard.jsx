// src/admin/AdminDashboard.jsx
import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Container
} from '@mui/material';
import {
  People as PeopleIcon,
  Payment as PaymentIcon,
  BusinessCenter as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getLoggedInUser } from '../../utils/auth';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const loginUser = getLoggedInUser();

  const stats = [
    { title: 'Total Students', value: '156', icon: <PeopleIcon />, color: '#e91e63', change: '+12%', path: '/admin/students' },
    { title: 'Total Revenue', value: '₹45,200', icon: <MoneyIcon />, color: '#4caf50', change: '+8%', path: '/admin/payments' },
    { title: 'Active Courses', value: '8', icon: <SchoolIcon />, color: '#2196f3', change: '+2', path: '/admin/courses' },
    { title: 'HR Staff', value: '24', icon: <BusinessIcon />, color: '#ff9800', change: '+3', path: '/admin/hr' },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3, md: 4 } }}>
      {/* Welcome Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: { xs: 3, sm: 4 }, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
          Welcome back, {loginUser || 'Admin'}! 👋
        </Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          Here's what's happening with your academy today.
        </Typography>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
              onClick={() => navigate(stat.path)}
            >
              <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
                      {stat.value}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <TrendingUpIcon sx={{ fontSize: 14, color: 'green', mr: 0.5 }} />
                      <Typography variant="caption" color="green">
                        {stat.change}
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar sx={{ bgcolor: stat.color, width: { xs: 40, sm: 50 }, height: { xs: 40, sm: 50 } }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Student Enrollment Overview
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Monthly enrollment statistics
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" color="textSecondary">
                  This Month's Progress
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  78%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={78} 
                sx={{ height: 8, borderRadius: 4, mb: 2 }}
              />
              <Typography variant="caption" color="textSecondary">
                +24 new students this month (12% increase)
              </Typography>
            </Box>
          </Paper>
        </Grid>

      </Grid>
    </Container>
  );
};

export default AdminDashboard;