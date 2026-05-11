// src/components/student/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Divider,
  IconButton,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
  CheckCircle as CheckCircleIcon,
  Timeline as TimelineIcon,
  EmojiEvents as EmojiEventsIcon,
  DateRange as DateRangeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = 'http://localhost:5000';

const StudentDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [courseProgress, setCourseProgress] = useState({
    completed: 35,
    totalModules: 12,
    completedModules: 4,
    currentModule: "Introduction to Beauty & Cosmetology",
    nextModule: "Skin Care Fundamentals",
    assignments: 3,
    completedAssignments: 1
  });

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
    // Check if user is logged in
    const token = localStorage.getItem('studentToken');
    if (!token) {
      navigate('/student/login');
    }
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      if (!token) {
        navigate('/student/login');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/student/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUserData(response.data.data);
      } else {
        setError('Failed to fetch user data');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentData');
    navigate('/student/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/student/dashboard' },
    { text: 'My Profile', icon: <PersonIcon />, path: '/student/profile' },
    { text: 'My Courses', icon: <SchoolIcon />, path: '/student/courses' },
    { text: 'Assignments', icon: <AssignmentIcon />, path: '/student/assignments' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/student/settings' },
  ];

  const drawer = (
    <Box>
      <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 2,
            bgcolor: '#ff6b6b',
            fontSize: 32
          }}
        >
          {userData?.name?.charAt(0) || 'S'}
        </Avatar>
        <Typography variant="h6" noWrap>
          {userData?.name || 'Student'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Registration ID: {userData?.registrationId || 'N/A'}
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              '&:hover': {
                bgcolor: '#ff6b6b20'
              }
            }}
          >
            <ListItemIcon sx={{ color: '#ff6b6b' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem button onClick={handleLogout}>
          <ListItemIcon sx={{ color: '#f44336' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/student/login')}
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* App Bar for Mobile */}
      <AppBar
        position="fixed"
        sx={{
          display: { xs: 'block', md: 'none' },
          background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Student Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: 280,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 280,
            boxSizing: 'border-box',
            bgcolor: '#ffffff'
          }
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          mt: { xs: 7, md: 0 },
          overflow: 'auto'
        }}
      >
        {/* Welcome Section */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            background: 'linear-gradient(135deg, #ff6b6b20, #ff8e8e20)',
            borderRadius: 3
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#ff6b6b' }}>
            Welcome back, {userData?.name?.split(' ')[0]}! 👋
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Track your learning progress and manage your courses from here.
          </Typography>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="caption">
                      Course Progress
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff6b6b' }}>
                      {courseProgress.completed}%
                    </Typography>
                  </Box>
                  <SchoolIcon sx={{ fontSize: 40, color: '#ff6b6b', opacity: 0.7 }} />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={courseProgress.completed}
                  sx={{ mt: 2, height: 8, borderRadius: 4, bgcolor: '#ffe0e0', '& .MuiLinearProgress-bar': { bgcolor: '#ff6b6b' } }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="caption">
                      Completed Modules
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                      {courseProgress.completedModules}/{courseProgress.totalModules}
                    </Typography>
                  </Box>
                  <CheckCircleIcon sx={{ fontSize: 40, color: '#4caf50', opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="caption">
                      Assignments
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                      {courseProgress.completedAssignments}/{courseProgress.assignments}
                    </Typography>
                  </Box>
                  <AssignmentIcon sx={{ fontSize: 40, color: '#ff9800', opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="caption">
                      Achievement Points
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                      1,250
                    </Typography>
                  </Box>
                  <EmojiEventsIcon sx={{ fontSize: 40, color: '#9c27b0', opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Student Information Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#ff6b6b', mb: 2 }}>
                  <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <PersonIcon color="primary" />
                      <Box>
                        <Typography variant="caption" color="textSecondary">Full Name</Typography>
                        <Typography variant="body1" fontWeight="bold">{userData?.name || 'N/A'}</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <EmailIcon color="primary" />
                      <Box>
                        <Typography variant="caption" color="textSecondary">Email Address</Typography>
                        <Typography variant="body1">{userData?.email || 'N/A'}</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <PhoneIcon color="primary" />
                      <Box>
                        <Typography variant="caption" color="textSecondary">Contact Number</Typography>
                        <Typography variant="body1">{userData?.contactNumber || 'N/A'}</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <DateRangeIcon color="primary" />
                      <Box>
                        <Typography variant="caption" color="textSecondary">Date of Birth</Typography>
                        <Typography variant="body1">
                          {userData?.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <LocationIcon color="primary" />
                      <Box>
                        <Typography variant="caption" color="textSecondary">Address</Typography>
                        <Typography variant="body1">{userData?.presentAddress || 'N/A'}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Course & Package Information */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#ff6b6b', mb: 2 }}>
                  <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Course Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ bgcolor: '#fff3cd', p: 2, borderRadius: 2 }}>
                      <Typography variant="caption" color="textSecondary">Package Details</Typography>
                      <Typography variant="h6" fontWeight="bold" color="#ff6b6b">
                        {userData?.packageDetails || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box>
                      <Typography variant="caption" color="textSecondary">Package Value</Typography>
                      <Typography variant="body1" fontWeight="bold">{userData?.packageValue || 'N/A'}</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box>
                      <Typography variant="caption" color="textSecondary">Package Price</Typography>
                      <Typography variant="body1" fontWeight="bold" color="#4caf50">
                        {userData?.packagePrice || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box>
                      <Typography variant="caption" color="textSecondary">Duration</Typography>
                      <Typography variant="body1">{userData?.packageDuration || 'N/A'}</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box>
                      <Typography variant="caption" color="textSecondary">Date of Joining</Typography>
                      <Typography variant="body1">
                        {userData?.dateOfJoin ? new Date(userData.dateOfJoin).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Course Progress Section */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#ff6b6b', mb: 2 }}>
                  <TimelineIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Course Progress Tracker
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ mb: 3 }}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" fontWeight="bold">Overall Progress</Typography>
                        <Typography variant="body2" color="#ff6b6b" fontWeight="bold">{courseProgress.completed}%</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={courseProgress.completed}
                        sx={{ height: 10, borderRadius: 5, bgcolor: '#ffe0e0', '& .MuiLinearProgress-bar': { bgcolor: '#ff6b6b' } }}
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" fontWeight="bold" gutterBottom>Current Module</Typography>
                      <Chip
                        label={courseProgress.currentModule}
                        color="primary"
                        sx={{ bgcolor: '#ff6b6b20', color: '#ff6b6b', fontWeight: 'bold' }}
                      />
                    </Box>

                    <Box>
                      <Typography variant="body2" fontWeight="bold" gutterBottom>Next Module</Typography>
                      <Chip
                        label={courseProgress.nextModule}
                        variant="outlined"
                        sx={{ borderColor: '#ff6b6b', color: '#ff6b6b' }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
                      <Typography variant="body2" fontWeight="bold" gutterBottom>Quick Stats</Typography>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="caption">Modules Completed:</Typography>
                        <Typography variant="caption" fontWeight="bold">{courseProgress.completedModules}/{courseProgress.totalModules}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="caption">Assignments Done:</Typography>
                        <Typography variant="caption" fontWeight="bold">{courseProgress.completedAssignments}/{courseProgress.assignments}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="caption">Certificate Status:</Typography>
                        <Typography variant="caption" fontWeight="bold" color="#4caf50">In Progress</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#ff6b6b', mb: 2 }}>
                  Recent Activity
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { activity: 'Completed Module 1: Introduction to Beauty', date: '2024-01-15', type: 'module' },
                    { activity: 'Submitted Assignment: Skin Care Basics', date: '2024-01-12', type: 'assignment' },
                    { activity: 'Started Module 2: Skin Care Fundamentals', date: '2024-01-10', type: 'module' },
                    { activity: 'Changed password successfully', date: '2024-01-08', type: 'security' }
                  ].map((activity, index) => (
                    <Box key={index} display="flex" justifyContent="space-between" alignItems="center" p={1} sx={{ '&:hover': { bgcolor: '#f5f5f5', borderRadius: 1 } }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        {activity.type === 'module' && <SchoolIcon sx={{ color: '#ff6b6b' }} />}
                        {activity.type === 'assignment' && <AssignmentIcon sx={{ color: '#ff9800' }} />}
                        {activity.type === 'security' && <CheckCircleIcon sx={{ color: '#4caf50' }} />}
                        <Typography variant="body2">{activity.activity}</Typography>
                      </Box>
                      <Typography variant="caption" color="textSecondary">{activity.date}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default StudentDashboard;