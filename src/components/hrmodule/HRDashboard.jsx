// src/hr/HRDashboard.jsx
import React from 'react';
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
  Divider
} from '@mui/material';
import {
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Warning as WarningIcon,
  EventAvailable as EventIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HRDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const stats = [
    { title: 'Total Employees', value: '156', icon: <PeopleIcon />, color: '#e91e63', change: '+12%', path: '/hr/module' },
    { title: 'Active Employees', value: '142', icon: <CheckCircleIcon />, color: '#4caf50', change: '+8%', path: '/hr/module' },
    { title: 'On Leave', value: '8', icon: <PendingIcon />, color: '#ff9800', change: '-2%', path: '/hr/module' },
    { title: 'Departments', value: '6', icon: <WorkIcon />, color: '#2196f3', change: '+1', path: '/hr/module' }
  ];

  const recentHires = [
    { id: 1, name: 'Alice Johnson', position: 'HR Specialist', date: '2024-01-15', status: 'active', avatar: 'A' },
    { id: 2, name: 'Bob Smith', position: 'Recruitment Manager', date: '2024-01-10', status: 'active', avatar: 'B' },
    { id: 3, name: 'Carol Davis', position: 'Training Coordinator', date: '2024-01-05', status: 'active', avatar: 'C' },
    { id: 4, name: 'David Wilson', position: 'Benefits Specialist', date: '2024-01-20', status: 'pending', avatar: 'D' }
  ];

  const attendanceData = [
    { day: 'Mon', present: 142, total: 156 },
    { day: 'Tue', present: 145, total: 156 },
    { day: 'Wed', present: 148, total: 156 },
    { day: 'Thu', present: 143, total: 156 },
    { day: 'Fri', present: 140, total: 156 }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Team Meeting', date: '2024-02-20', time: '10:00 AM', type: 'meeting' },
    { id: 2, title: 'Performance Review', date: '2024-02-22', time: '2:00 PM', type: 'review' },
    { id: 3, title: 'Training Session', date: '2024-02-25', time: '11:00 AM', type: 'training' }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 2, px: { xs: 1, sm: 2, md: 3 } }}>
      {/* Welcome Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: { xs: 2, sm: 3 }, 
          background: 'linear-gradient(135deg, #e91e63 0%, #ff6f91 100%)',
          color: 'white',
          borderRadius: 3
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          HR Dashboard 👋
        </Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          Welcome to HR Management Portal - Track employees, attendance, and HR operations
        </Typography>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
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
                  <Avatar sx={{ bgcolor: alpha(stat.color, 0.1), color: stat.color, width: { xs: 45, sm: 55 }, height: { xs: 45, sm: 55 } }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts and Activity Section */}
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
        {/* Attendance Overview */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Attendance Overview (This Week)
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
                    value={(data.present / data.total) * 100} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': { 
                        bgcolor: (data.present / data.total) * 100 > 90 ? '#4caf50' : '#ff9800',
                        borderRadius: 4
                      }
                    }} 
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Upcoming Events
            </Typography>
            <List>
              {upcomingEvents.map((event, index) => (
                <React.Fragment key={event.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: alpha('#e91e63', 0.1), color: '#e91e63' }}>
                        <EventIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={500}>
                          {event.title}
                        </Typography>
                      }
                      secondary={`${event.date} • ${event.time}`}
                    />
                  </ListItem>
                  {index < upcomingEvents.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

    

     
      </Grid>
    </Container>
  );
};

// Add Chip import
import Chip from '@mui/material/Chip';

export default HRDashboard;