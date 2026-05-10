// src/employee/EmployeeDashboard.jsx
import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  LinearProgress,
  Container,
  useMediaQuery,
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Chip,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  EventAvailable as EventIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Warning as WarningIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  EmojiEvents as TrophyIcon,
  LocalHotel as BreakIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { EventBusy as LeaveIcon } from '@mui/icons-material';
const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const attendanceData = [
    { day: 'Mon', present: 1, total: 1 },
    { day: 'Tue', present: 1, total: 1 },
    { day: 'Wed', present: 1, total: 1 },
    { day: 'Thu', present: 1, total: 1 },
    { day: 'Fri', present: 1, total: 1 }
  ];

  const stats = [
    { title: 'Total Present Days', value: '22', icon: <CheckCircleIcon />, color: '#4caf50', change: '+5%', bgColor: alpha('#4caf50', 0.1) },
    { title: 'Leave Taken', value: '3', icon: <PendingIcon />, color: '#ff9800', change: '-2%', bgColor: alpha('#ff9800', 0.1) },
    { title: 'Remaining Leave', value: '9', icon: <EventIcon />, color: '#2196f3', change: '', bgColor: alpha('#2196f3', 0.1) },
    { title: 'Performance Score', value: '92%', icon: <TrophyIcon />, color: '#e91e63', change: '+8%', bgColor: alpha('#e91e63', 0.1) }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Team Meeting', date: '2024-02-20', time: '10:00 AM', type: 'meeting', icon: <WorkIcon /> },
    { id: 2, title: 'Project Deadline', date: '2024-02-22', time: '5:00 PM', type: 'deadline', icon: <WarningIcon /> },
    { id: 3, title: 'Training Session', date: '2024-02-25', time: '11:00 AM', type: 'training', icon: <EventIcon /> }
  ];

  const performanceData = [
    { month: 'Jan', performance: 85 },
    { month: 'Feb', performance: 88 },
    { month: 'Mar', performance: 90 },
    { month: 'Apr', performance: 87 },
    { month: 'May', performance: 92 },
    { month: 'Jun', performance: 94 }
  ];

  const leaveHistory = [
    { id: 1, type: 'Sick Leave', date: '2024-02-10', status: 'Approved', days: 2 },
    { id: 2, type: 'Casual Leave', date: '2024-01-25', status: 'Approved', days: 1 },
    { id: 3, type: 'Emergency Leave', date: '2024-02-01', status: 'Pending', days: 1 }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2, px: { xs: 1, sm: 2, md: 3 } }}>
      {/* Welcome Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: { xs: 2, sm: 3 }, 
          background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
          color: 'white',
          borderRadius: 3
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Welcome Back, Rama! 👋
        </Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          Here's your daily work summary and performance updates
        </Typography>
      </Paper>

     
      {/* Charts Section */}
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
        {/* Attendance Overview */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Attendance Overview
            </Typography>
            <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
              Your attendance for this week
            </Typography>
            <Box sx={{ mt: 2 }}>
              {attendanceData.map((data, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography variant="body2" fontWeight={500}>{data.day}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {data.present} / {data.total} Present
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={100} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': { bgcolor: '#4caf50', borderRadius: 4 }
                    }} 
                  />
                </Box>
              ))}
            </Box>
            <Button 
              variant="outlined" 
              fullWidth 
              sx={{ mt: 2 }}
              onClick={() => navigate('/employee/attendance')}
            >
              View Full Attendance
            </Button>
          </Paper>
        </Grid>

        {/* Performance Trend */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Performance Trend
            </Typography>
            <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
              Your performance score over the last 6 months
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="performance" stroke="#2196f3" strokeWidth={2} dot={{ fill: '#2196f3', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Activities Section */}
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Upcoming Events
            </Typography>
            <List>
              {upcomingEvents.map((event, index) => (
                <React.Fragment key={event.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: alpha('#2196f3', 0.1), color: '#2196f3' }}>
                        {event.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="body2" fontWeight={500}>{event.title}</Typography>}
                      secondary={`${event.date} • ${event.time}`}
                    />
                    <Chip 
                      label={event.type} 
                      size="small" 
                      color={event.type === 'meeting' ? 'primary' : event.type === 'deadline' ? 'error' : 'warning'}
                    />
                  </ListItem>
                  {index < upcomingEvents.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Leave History */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Recent Leave History
            </Typography>
            <List>
              {leaveHistory.map((leave, index) => (
                <React.Fragment key={leave.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: alpha('#ff9800', 0.1), color: '#ff9800' }}>
                        <EventIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" fontWeight={500}>{leave.type}</Typography>
                          <Chip label={leave.status} color={getStatusColor(leave.status)} size="small" />
                        </Box>
                      }
                      secondary={`${leave.date} • ${leave.days} day(s)`}
                    />
                  </ListItem>
                  {index < leaveHistory.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
            <Button 
              variant="outlined" 
              fullWidth 
              sx={{ mt: 2 }}
              onClick={() => navigate('/employee/apply-leave')}
            >
              Apply for Leave
            </Button>
          </Paper>
        </Grid>

 
      </Grid>
    </Container>
  );
};

export default EmployeeDashboard;