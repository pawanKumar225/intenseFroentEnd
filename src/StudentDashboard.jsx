// StudentDashboard.jsx - Complete Student Dashboard
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  IconButton,
  Badge,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Snackbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Tabs,
  Tab,
  Tooltip,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Today as TodayIcon,
  AccessTime as TimeIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  CalendarToday as CalendarIcon,
  EmojiEvents as TrophyIcon,
  TrendingUp as TrendingUpIcon,
  FiberManualRecord as ActiveIcon,
  CheckBox as CheckInIcon,
  CheckBoxOutlineBlank as CheckOutIcon,
  History as HistoryIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  PlayArrow as PlayIcon,
  LockOpen as LockOpenIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format, differenceInDays, differenceInHours } from 'date-fns';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Course Progress Data
const courseModules = [
  {
    id: 1,
    title: "Introduction to Makeup Artistry",
    topics: [
      { id: 1, name: "History of Makeup", completed: true, duration: "30 mins" },
      { id: 2, name: "Makeup Tools & Brushes", completed: true, duration: "45 mins" },
      { id: 3, name: "Skin Types & Preparation", completed: true, duration: "60 mins" },
      { id: 4, name: "Hygiene & Safety Protocols", completed: false, duration: "30 mins" }
    ]
  },
  {
    id: 2,
    title: "Basic Makeup Techniques",
    topics: [
      { id: 5, name: "Foundation Application", completed: true, duration: "45 mins" },
      { id: 6, name: "Concealer & Color Correction", completed: true, duration: "60 mins" },
      { id: 7, name: "Eye Makeup Basics", completed: false, duration: "90 mins" },
      { id: 8, name: "Lip Liner & Lipstick Application", completed: false, duration: "45 mins" }
    ]
  },
  {
    id: 3,
    title: "Advanced Techniques",
    topics: [
      { id: 9, name: "Contouring & Highlighting", completed: false, duration: "60 mins" },
      { id: 10, name: "Smokey Eye Techniques", completed: false, duration: "90 mins" },
      { id: 11, name: "Bridal Makeup", completed: false, duration: "120 mins" },
      { id: 12, name: "Airbrush Makeup", completed: false, duration: "90 mins" }
    ]
  }
];

// Check-in/Check-out History
const attendanceHistory = [
  { id: 1, date: "2024-01-10", checkIn: "09:30 AM", checkOut: "05:30 PM", status: "present", hours: 8 },
  { id: 2, date: "2024-01-11", checkIn: "09:45 AM", checkOut: "05:15 PM", status: "present", hours: 7.5 },
  { id: 3, date: "2024-01-12", checkIn: "10:00 AM", checkOut: "04:00 PM", status: "half-day", hours: 6 },
  { id: 4, date: "2024-01-13", checkIn: "--:--", checkOut: "--:--", status: "absent", hours: 0 },
  { id: 5, date: "2024-01-14", checkIn: "09:15 AM", checkOut: "05:45 PM", status: "present", hours: 8.5 }
];

const StudentDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  // State Management
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Course Progress Calculation
  const totalTopics = courseModules.reduce((acc, module) => acc + module.topics.length, 0);
  const completedTopics = courseModules.reduce((acc, module) => 
    acc + module.topics.filter(topic => topic.completed).length, 0);
  const overallProgress = (completedTopics / totalTopics) * 100;
  
  // Attendance Statistics
  const totalDays = attendanceHistory.length;
  const presentDays = attendanceHistory.filter(day => day.status === 'present').length;
  const halfDays = attendanceHistory.filter(day => day.status === 'half-day').length;
  const attendancePercentage = (presentDays + (halfDays * 0.5)) / totalDays * 100;
  
  // Calculate total hours studied
  const totalStudyHours = attendanceHistory.reduce((acc, day) => acc + day.hours, 0);

  useEffect(() => {
    // Fetch student data from localStorage or API
    const userData = localStorage.getItem('user');
    if (userData) {
      setStudent(JSON.parse(userData));
    }
    
    // Check if already checked in today
    const savedCheckIn = localStorage.getItem('checkInTime');
    if (savedCheckIn) {
      const checkInDate = new Date(parseInt(savedCheckIn));
      const today = new Date();
      if (checkInDate.toDateString() === today.toDateString()) {
        setCheckedIn(true);
        setCheckInTime(checkInDate);
      } else {
        localStorage.removeItem('checkInTime');
      }
    }
    
    setLoading(false);
    
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/student/login');
  };

  const handleCheckIn = () => {
    const now = new Date();
    setCheckedIn(true);
    setCheckInTime(now);
    localStorage.setItem('checkInTime', now.getTime().toString());
    
    // Record check-in to backend
    const record = {
      date: now.toISOString().split('T')[0],
      checkIn: format(now, 'hh:mm:ss a'),
      status: 'checked-in'
    };
    
    // Save to localStorage for demo
    const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
    existingRecords.push(record);
    localStorage.setItem('attendanceRecords', JSON.stringify(existingRecords));
    
    setSnackbar({
      open: true,
      message: `Checked in successfully at ${format(now, 'hh:mm:ss a')}`,
      severity: 'success'
    });
  };

  const handleCheckOut = () => {
    const now = new Date();
    setCheckedIn(false);
    setCheckOutTime(now);
    localStorage.removeItem('checkInTime');
    
    const checkInDateTime = new Date(checkInTime);
    const hoursWorked = differenceInHours(now, checkInDateTime);
    
    setSnackbar({
      open: true,
      message: `Checked out successfully at ${format(now, 'hh:mm:ss a')}. Total hours: ${hoursWorked.toFixed(1)} hrs`,
      severity: 'info'
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Drawer Content
  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
          Intense Beauty
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {['Dashboard', 'My Courses', 'Attendance', 'Progress', 'Settings'].map((text, index) => (
          <ListItem button key={text} onClick={() => setSelectedTab(index)}>
            <ListItemIcon>
              {index === 0 && <DashboardIcon />}
              {index === 1 && <SchoolIcon />}
              {index === 2 && <TodayIcon />}
              {index === 3 && <TrendingUpIcon />}
              {index === 4 && <SettingsIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: `240px` },
          background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Student Dashboard
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {format(currentTime, 'hh:mm:ss a')}
              </Typography>
              <IconButton onClick={handleMenuOpen} size="small">
                <Avatar sx={{ bgcolor: '#fff', color: '#ff6b6b', width: 32, height: 32 }}>
                  {student?.name?.[0] || 'S'}
                </Avatar>
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Menu Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { mt: 1, width: 200 } }}
      >
        <MenuItem onClick={() => { handleMenuClose(); setSelectedTab(4); }}>
          <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
          Profile Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      
      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: 240 } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' } }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          mt: '64px'
        }}
      >
        <Container maxWidth="xl">
          {/* Welcome Banner */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '20px'
            }}
          >
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom>
                  Welcome back, {student?.name || 'Student'}! 🎓
                </Typography>
                <Typography variant="body1">
                  {format(new Date(), 'EEEE, MMMM do, yyyy')} • {format(currentTime, 'hh:mm:ss a')}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                  Registration ID: {student?.registrationId || 'IBA-STU-2024-0001'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: '#fff',
                    color: '#667eea',
                    fontSize: 40,
                    margin: '0 auto'
                  }}
                >
                  {student?.name?.[0] || 'S'}
                </Avatar>
                <Button
                  variant="contained"
                  size="small"
                  onClick={checkedIn ? handleCheckOut : handleCheckIn}
                  sx={{
                    mt: 2,
                    bgcolor: checkedIn ? '#ff4444' : '#4caf50',
                    '&:hover': { bgcolor: checkedIn ? '#cc0000' : '#45a049' }
                  }}
                >
                  {checkedIn ? <CheckOutIcon sx={{ mr: 1 }} /> : <CheckInIcon sx={{ mr: 1 }} />}
                  {checkedIn ? 'Check Out' : 'Check In'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Check-in/Check-out Status Card */}
          {checkedIn && (
            <Alert
              severity="success"
              sx={{ mb: 3, borderRadius: '10px' }}
              icon={<ActiveIcon />}
            >
              You are currently checked in since {format(new Date(checkInTime), 'hh:mm:ss a')}
            </Alert>
          )}
          
          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="body2">
                        Overall Progress
                      </Typography>
                      <Typography variant="h4" component="h2">
                        {Math.round(overallProgress)}%
                      </Typography>
                    </Box>
                    <CircularProgress
                      variant="determinate"
                      value={overallProgress}
                      size={60}
                      thickness={5}
                      sx={{ color: '#ff6b6b' }}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={overallProgress}
                    sx={{ mt: 2, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    {completedTopics}/{totalTopics} topics completed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '15px' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="body2">
                        Attendance
                      </Typography>
                      <Typography variant="h4" component="h2">
                        {Math.round(attendancePercentage)}%
                      </Typography>
                    </Box>
                    <TrophyIcon sx={{ fontSize: 50, color: '#ffc107' }} />
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {presentDays} Present / {halfDays} Half / {totalDays - presentDays - halfDays} Absent
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '15px' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Study Hours
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {totalStudyHours}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Hours completed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '15px' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Course Duration
                  </Typography>
                  <Typography variant="h4" component="h2">
                    3
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Months remaining
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Tabs Section */}
          <Paper sx={{ borderRadius: '15px', overflow: 'hidden' }}>
            <Tabs value={selectedTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
              <Tab label="Course Progress" icon={<TrendingUpIcon />} iconPosition="start" />
              <Tab label="Attendance History" icon={<HistoryIcon />} iconPosition="start" />
              <Tab label="My Profile" icon={<PersonIcon />} iconPosition="start" />
            </Tabs>
            
            {/* Course Progress Tab */}
            {selectedTab === 0 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Your Learning Journey
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Track your progress through the course modules
                </Typography>
                
                <Stepper activeStep={activeStep} orientation="vertical">
                  {courseModules.map((module, index) => (
                    <Step key={module.id}>
                      <StepLabel
                        StepIconComponent={({ active, completed }) => {
                          const moduleCompleted = module.topics.every(t => t.completed);
                          return moduleCompleted ? <CheckCircleIcon sx={{ color: '#4caf50' }} /> : <UncheckedIcon />;
                        }}
                      >
                        <Box>
                          <Typography variant="h6">{module.title}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {module.topics.filter(t => t.completed).length}/{module.topics.length} topics completed
                          </Typography>
                        </Box>
                      </StepLabel>
                      <StepContent>
                        <Grid container spacing={2}>
                          {module.topics.map((topic) => (
                            <Grid item xs={12} key={topic.id}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  p: 1,
                                  bgcolor: topic.completed ? '#e8f5e9' : '#fff',
                                  borderRadius: 1,
                                  border: '1px solid #e0e0e0'
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {topic.completed ? (
                                    <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                                  ) : (
                                    <PlayIcon sx={{ color: '#ff6b6b', fontSize: 20 }} />
                                  )}
                                  <Typography>{topic.name}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Typography variant="caption" color="textSecondary">
                                    <TimeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                    {topic.duration}
                                  </Typography>
                                  {!topic.completed && (
                                    <Button size="small" variant="outlined" sx={{ borderRadius: '20px' }}>
                                      Start
                                    </Button>
                                  )}
                                </Box>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                        <Box sx={{ mb: 2, mt: 2 }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => setActiveStep(index + 1)}
                            sx={{ mr: 1 }}
                          >
                            Continue
                          </Button>
                        </Box>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            )}
            
            {/* Attendance History Tab */}
            {selectedTab === 1 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Attendance History
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Your check-in/check-out records
                </Typography>
                
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Check In</TableCell>
                        <TableCell>Check Out</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Hours</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {attendanceHistory.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{record.checkIn}</TableCell>
                          <TableCell>{record.checkOut}</TableCell>
                          <TableCell>
                            <Chip
                              label={record.status}
                              size="small"
                              color={
                                record.status === 'present' ? 'success' :
                                record.status === 'half-day' ? 'warning' : 'error'
                              }
                            />
                          </TableCell>
                          <TableCell>{record.hours} hrs</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
            
            {/* My Profile Tab */}
            {selectedTab === 2 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  My Profile
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: '15px' }}>
                      <Avatar
                        sx={{
                          width: 120,
                          height: 120,
                          bgcolor: '#ff6b6b',
                          margin: '0 auto 20px',
                          fontSize: 48
                        }}
                      >
                        {student?.name?.[0] || 'S'}
                      </Avatar>
                      <Typography variant="h6">{student?.name || 'Student Name'}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {student?.email || 'student@example.com'}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Box textAlign="left">
                        <Typography variant="body2" paragraph>
                          <strong>Registration ID:</strong> {student?.registrationId || 'IBA-STU-2024-0001'}
                        </Typography>
                        <Typography variant="body2" paragraph>
                          <strong>Course Package:</strong> {student?.packageDetails || 'Professional Makeup Course'}
                        </Typography>
                        <Typography variant="body2" paragraph>
                          <strong>Date of Joining:</strong> {student?.dateOfJoin?.split('T')[0] || '2024-01-15'}
                        </Typography>
                        <Typography variant="body2" paragraph>
                          <strong>Contact:</strong> {student?.contactNumber || '+91 98765 43210'}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate('/student/change-password')}
                        sx={{ borderRadius: '30px', mt: 2 }}
                      >
                        Change Password
                      </Button>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, borderRadius: '15px' }}>
                      <Typography variant="h6" gutterBottom>
                        Quick Stats
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box textAlign="center" p={2} bgcolor="#f5f5f5" borderRadius={2}>
                            <Typography variant="h3" color="#ff6b6b">
                              {Math.round(overallProgress)}%
                            </Typography>
                            <Typography variant="body2">Course Completion</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box textAlign="center" p={2} bgcolor="#f5f5f5" borderRadius={2}>
                            <Typography variant="h3" color="#ff6b6b">
                              {Math.round(attendancePercentage)}%
                            </Typography>
                            <Typography variant="body2">Attendance Rate</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box textAlign="center" p={2} bgcolor="#f5f5f5" borderRadius={2}>
                            <Typography variant="h3" color="#ff6b6b">
                              {totalStudyHours}
                            </Typography>
                            <Typography variant="body2">Hours Studied</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box textAlign="center" p={2} bgcolor="#f5f5f5" borderRadius={2}>
                            <Typography variant="h3" color="#ff6b6b">
                              {presentDays}
                            </Typography>
                            <Typography variant="body2">Days Present</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentDashboard;