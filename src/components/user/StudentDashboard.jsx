// src/components/student/StudentDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
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
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Button,
  Snackbar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
  CheckCircle as CheckCircleIcon,
  Timeline as TimelineIcon,
  EmojiEvents as EmojiEventsIcon,
  DateRange as DateRangeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Refresh as RefreshIcon,
  SpaceDashboard as SpaceDashboardIcon,
  Book as BookIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const StudentDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  
  // Refs for scrolling to sections
  const dashboardRef = useRef(null);
  const personalInfoRef = useRef(null);
  const courseInfoRef = useRef(null);
  const courseProgressRef = useRef(null);
  const recentActivityRef = useRef(null);
  
  const [userData, setUserData] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // Course progress state
  const [courseProgress, setCourseProgress] = useState({
    completed: 0,
    totalModules: 0,
    completedModules: 0,
    currentModule: "",
    nextModule: "",
    assignments: 0,
    completedAssignments: 0
  });

  // Fetch dashboard data function
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('studentToken');
      
      if (!token) {
        console.log('No token found in fetchDashboardData');
        navigate('/user/login', { replace: true });
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      console.log('Fetching dashboard data...');
      
      const [profileResponse, statsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/student/profile`, config),
        axios.get(`${API_BASE_URL}/api/student/dashboard-stats`, config)
      ]);
      console.log("profileResponse........",profileResponse)

      if (profileResponse.data.success) {
        setUserData(profileResponse.data.data);
      } else {
        setError('Failed to fetch user data');
      }

      if (statsResponse.data.success) {
        setDashboardStats(statsResponse.data.data);
        setCourseProgress(statsResponse.data.data.courseProgress);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentData');
        navigate('/user/login', { replace: true });
      } else {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  // Main useEffect for authentication and data fetching
  useEffect(() => {
    const token = localStorage.getItem('studentToken');
    console.log('Dashboard mounted, checking token:', !!token);
    
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/user/login', { replace: true });
      return;
    }
    
    fetchDashboardData();
    
    if (location.hash) {
      setTimeout(() => {
        scrollToSection(location.hash.substring(1));
      }, 500);
    }
  }, [navigate]);

  // Smooth scroll to section
  const scrollToSection = (sectionName) => {
    setActiveSection(sectionName);
    
    let sectionRef;
    switch(sectionName) {
      case 'dashboard':
        sectionRef = dashboardRef;
        break;
      case 'profile':
        sectionRef = personalInfoRef;
        break;
      case 'courses':
        sectionRef = courseInfoRef;
        break;
      case 'progress':
        sectionRef = courseProgressRef;
        break;
      case 'activity':
        sectionRef = recentActivityRef;
        break;
      default:
        sectionRef = dashboardRef;
    }
    
    if (sectionRef && sectionRef.current) {
      const yOffset = -80;
      const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    
    window.history.pushState(null, '', `#${sectionName}`);
    
    if (isMobile && mobileOpen) {
      setMobileOpen(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
    setSnackbar({ open: true, message: 'Data refreshed successfully!', severity: 'success' });
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/user/login', { replace: true });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Enhanced menu items with better icons
  const menuItems = [
    { text: 'Dashboard', icon: <SpaceDashboardIcon />, section: 'dashboard' },
    { text: 'My Profile', icon: <PersonIcon />, section: 'profile' },
    { text: 'My Courses', icon: <BookIcon />, section: 'courses' },
    { text: 'Course Progress', icon: <TimelineIcon />, section: 'progress' },
    { text: 'Recent Activity', icon: <HistoryIcon />, section: 'activity' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Profile Section with increased padding */}
      <Box sx={{ 
        p: 4, 
        textAlign: 'center', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        mb: 2
      }}>
        <Avatar
          sx={{
            width: 90,
            height: 90,
            mx: 'auto',
            mb: 2,
            bgcolor: '#ff6b6b',
            fontSize: 36,
            border: '3px solid white'
          }}
        >
          {userData?.name?.charAt(0) || 'S'}
        </Avatar>
        <Typography variant="h6" noWrap sx={{ color: 'white', fontWeight: 'bold' }}>
          {userData?.name || 'Student'}
        </Typography>
        <Typography
  variant="body2"
  sx={{
    color: 'rgba(255,255,255,0.9)',
    mt: 0.5,
    fontSize: '10px',
  }}
>
          {userData?.email || 'student@example.com'}
        </Typography>
         <Typography
  variant="body2"
  sx={{
    color: 'rgba(0,0,0)',
    mt: 0.5,
    fontSize: '15px',
  }}
>
          {userData?.registrationId || ' '}
        </Typography>
        <Chip 
          label={userData?.status || 'Active'} 
          size="small" 
          sx={{ 
            mt: 1.5, 
            bgcolor: 'rgba(255,255,255,0.2)', 
            color: 'white',
            fontWeight: 'bold'
          }}
        />
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {/* Menu Items with increased height and padding */}
      <List sx={{ flex: 1, px: 1 }}>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text} 
            disablePadding
            sx={{ mb: 1 }}
          >
            <ListItemButton
              onClick={() => scrollToSection(item.section)}
              sx={{
                py: 2, // Increased vertical padding
                px: 3.5,   // Increased horizontal padding
                borderRadius: 2,
                backgroundColor: activeSection === item.section ? '#ff6b6b15' : 'transparent',
                '&:hover': {
                  backgroundColor: '#ff6b6b10',
                },
                borderLeft: activeSection === item.section ? '4px solid #ff6b6b' : '4px solid transparent',
                transition: 'all 0.3s ease'
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: activeSection === item.section ? '#ff6b6b' : '#666',
                  minWidth: 45,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontSize: '1rem',
                  fontWeight: activeSection === item.section ? 'bold' : 'medium',
                  color: activeSection === item.section ? '#ff6b6b' : '#333',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Logout Button with increased padding */}
      <List sx={{ px: 1, mb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              py: 2,
              px: 3.6,
              borderRadius: 2,
              backgroundColor: '#f4433610',
              '&:hover': {
                backgroundColor: '#f4433620',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#f44336', minWidth: 45 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{
                fontSize: '1rem',
                fontWeight: 'bold',
                color: '#f44336',
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'dashboard', ref: dashboardRef },
        { id: 'profile', ref: personalInfoRef },
        { id: 'courses', ref: courseInfoRef },
        { id: 'progress', ref: courseProgressRef },
        { id: 'activity', ref: recentActivityRef }
      ];
      
      for (const section of sections) {
        if (section.ref && section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            if (activeSection !== section.id) {
              setActiveSection(section.id);
              window.history.pushState(null, '', `#${section.id}`);
            }
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

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
        <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/user/login', { replace: true })}
          sx={{ bgcolor: '#ff6b6b', '&:hover': { bgcolor: '#ff5252' } }}
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
          background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
          zIndex: 1200
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Student Dashboard
          </Typography>
          <IconButton color="inherit" onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer - Increased width */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: 280,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: 'border-box',
            bgcolor: '#ffffff',
            position: isMobile ? 'fixed' : 'relative',
            borderRight: '1px solid #e0e0e0',
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
          overflow: 'auto',
          width: { xs: '100%', md: `calc(100% - 280px)` }
        }}
      >
        {/* Header with Refresh Button for Desktop */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="outlined"
            onClick={handleRefresh}
            startIcon={<RefreshIcon />}
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              borderColor: '#ff6b6b',
              color: '#ff6b6b',
              px: 3,
              py: 1,
              '&:hover': { borderColor: '#ff5252', bgcolor: '#ff6b6b10' }
            }}
          >
            Refresh Data
          </Button>
        </Box>

        {/* Welcome Section */}
        <div ref={dashboardRef}>
          <Paper
            sx={{
              p: 4,
              mb: 4,
              background: 'linear-gradient(135deg, #ff6b6b20, #ff8e8e20)',
              borderRadius: 3
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#ff6b6b' }}>
              Welcome back, {userData?.name?.split(' ')[0] || 'Student'}! 👋
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Track your learning progress and manage your courses from here.
            </Typography>
          </Paper>
        </div>

        {/* Stats Cards - Rest of your existing code remains the same */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          

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
                      {dashboardStats?.achievementPoints || 0}
                    </Typography>
                  </Box>
                  <EmojiEventsIcon sx={{ fontSize: 40, color: '#9c27b0', opacity: 0.7 }} />
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
                      Payment Due
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff6b6b' }}>
                      {userData?.dueAmount || 0}
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
         
        </Grid>

        {/* Rest of your existing Grid sections remain exactly the same */}
        <Grid container spacing={3}>
          {/* Student Information Section */}
          <Grid item xs={12} md={6}>
            <div ref={personalInfoRef}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%', scrollMarginTop: '80px' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#ff6b6b', mb: 2 }}>
                    <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <PersonIcon sx={{ color: '#ff6b6b' }} />
                        <Box>
                          <Typography variant="caption" color="textSecondary">Full Name</Typography>
                          <Typography variant="body1" fontWeight="bold">{userData?.name || 'N/A'}</Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <PersonIcon sx={{ color: '#ff6b6b' }} />
                        <Box>
                          <Typography variant="caption" color="textSecondary">Father's Name</Typography>
                          <Typography variant="body1">{userData?.fatherName || 'N/A'}</Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <EmailIcon sx={{ color: '#ff6b6b' }} />
                        <Box>
                          <Typography variant="caption" color="textSecondary">Email Address</Typography>
                          <Typography variant="body1">{userData?.email || 'N/A'}</Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <PhoneIcon sx={{ color: '#ff6b6b' }} />
                        <Box>
                          <Typography variant="caption" color="textSecondary">Contact Number</Typography>
                          <Typography variant="body1">{userData?.contactNumber || 'N/A'}</Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <PhoneIcon sx={{ color: '#ff6b6b' }} />
                        <Box>
                          <Typography variant="caption" color="textSecondary">Alternative Number</Typography>
                          <Typography variant="body1">{userData?.altContactNumber || 'N/A'}</Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <DateRangeIcon sx={{ color: '#ff6b6b' }} />
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
                        <LocationIcon sx={{ color: '#ff6b6b' }} />
                        <Box>
                          <Typography variant="caption" color="textSecondary">Present Address</Typography>
                          <Typography variant="body1">{userData?.presentAddress || 'N/A'}</Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <LocationIcon sx={{ color: '#ff6b6b' }} />
                        <Box>
                          <Typography variant="caption" color="textSecondary">Permanent Address</Typography>
                          <Typography variant="body1">{userData?.permanentAddress || 'N/A'}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </div>
          </Grid>

          {/* Course & Package Information */}
          <Grid item xs={12} md={6}>
            <div ref={courseInfoRef}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%', scrollMarginTop: '80px' }}>
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
                        <Typography variant="caption" color="textSecondary">Aadhar Number</Typography>
                        <Typography variant="body1">******{userData?.aadharNumber?.slice(-4) || 'N/A'}</Typography>
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

                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="caption" color="textSecondary">Registration ID</Typography>
                        <Typography variant="body1" fontWeight="bold">{userData?.registrationId || 'N/A'}</Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="caption" color="textSecondary">Account Status</Typography>
                        <Chip 
                          label={userData?.status || 'Pending'} 
                          size="small"
                          sx={{ 
                            bgcolor: userData?.status === 'active' ? '#4caf50' : '#ff9800',
                            color: 'white'
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </div>
          </Grid>

          {/* Course Progress Section */}
          <Grid item xs={12}>
            <div ref={courseProgressRef}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, scrollMarginTop: '80px' }}>
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
                          label={courseProgress.currentModule || "Loading..."}
                          sx={{ bgcolor: '#ff6b6b20', color: '#ff6b6b', fontWeight: 'bold' }}
                        />
                      </Box>

                      <Box>
                        <Typography variant="body2" fontWeight="bold" gutterBottom>Next Module</Typography>
                        <Chip
                          label={courseProgress.nextModule || "Loading..."}
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
                          <Typography variant="caption" fontWeight="bold" color="#4caf50">{dashboardStats?.certificateStatus || 'In Progress'}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </div>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12}>
            <div ref={recentActivityRef}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, scrollMarginTop: '80px' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#ff6b6b', mb: 2 }}>
                    Recent Activity
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {dashboardStats?.recentActivities?.map((activity, index) => (
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
            </div>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentDashboard;