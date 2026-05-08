
// src/components/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  IconButton,
  useMediaQuery,
  Avatar,
  Paper,
  Stack,
  Chip
} from '@mui/material';
import {
  People as PeopleIcon,
  Payment as PaymentIcon,
  BusinessCenter as BusinessCenterIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import StudentList from './StudentList';
import PaymentHistory from './PaymentHistory';
import HRModule from './HumanResource';
import CreateAdmin from './CreateAdmin';
import { getLoggedInUser } from '../../utils/auth';
import adminAPI from '../../services/api';

const drawerWidth = 198;

// Theme configuration
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f7fa' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0f172a',
          color: '#e2e8f0',
          borderRight: 'none',
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#94a3b8',
          minWidth: 42,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '4px 12px',
          padding: '10px 16px',
          '&:hover': { backgroundColor: '#1e293b' },
        },
      },
    },
  },
});

const menuItems = [
  { text: 'Student List', icon: <PeopleIcon />, path: '/admin/students' },
  { text: 'Payment History', icon: <PaymentIcon />, path: '/admin/payments' },
  { text: 'HR Module', icon: <BusinessCenterIcon />, path: '/admin/hr' },
  { text: 'Create Admin', icon: <AdminPanelSettingsIcon />, path: '/admin/create-user' },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginUser = getLoggedInUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getSelectedItem = () => {
    const path = location.pathname;
    if (path.includes('/students')) return 'Student List';
    if (path.includes('/payments')) return 'Payment History';
    if (path.includes('/hr')) return 'HR Module';
    if (path.includes('/createuser')) return 'Create Admin';
    return 'Student List';
  };

  const [selectedItem, setSelectedItem] = useState(getSelectedItem());

  const handleNavigation = (text, path) => {
    setSelectedItem(text);
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const handleLogout = () => {
    adminAPI.logout();
    navigate('/login');
  };

  // Get current date and time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const drawer = (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 3, py: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700, letterSpacing: '-0.5px' }}>
          Admin Panel
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748b' }}>Manage everything</Typography>
      </Box>

      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.text, item.path)}
              sx={{
                backgroundColor: selectedItem === item.text ? '#1e293b' : 'transparent',
                '&:hover': { backgroundColor: '#1e293b' },
              }}
            >
              <ListItemIcon sx={{ color: selectedItem === item.text ? '#60a5fa' : '#94a3b8' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiTypography-root': {
                    color: selectedItem === item.text ? '#ffffff' : '#cbd5e1',
                    fontWeight: selectedItem === item.text ? 600 : 400,
                    fontSize: '0.9rem',
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2, mb: 2 }}>
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
          <ListItemIcon sx={{ color: '#94a3b8' }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" sx={{ '& .MuiTypography-root': { color: '#cbd5e1' } }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  // Welcome Banner Component
  const WelcomeBanner = () => (
    <Paper
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.8, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon sx={{ fontSize: 14 }} />
              {currentDate}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, mb: 0.5 }}>
              {getGreeting()}, {loginUser || 'Admin'}!
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Welcome back to Intense Beauty Academy Management System
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Chip 
                label="Today's Attendance: 85%" 
                size="small" 
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip 
                label="New Students: +12" 
                size="small" 
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            </Stack>
          </Box>
          <Box sx={{ mt: { xs: 2, sm: 0 }, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.5)'
              }}
            >
              <PersonIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.8 }}>
              {loginUser?.role || 'Administrator'}
            </Typography>
          </Box>
        </Stack>
      </Box>
      {/* Decorative circles */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.1)',
          zIndex: 1
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 250,
          height: 250,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.08)',
          zIndex: 1
        }}
      />
    </Paper>
  );

  // Quick Stats Cards
  const QuickStats = () => (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 4 }}>
      <Paper
        sx={{
          p: 2,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderRadius: 3,
          bgcolor: 'white'
        }}
      >
        <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}>
          <SchoolIcon />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
            1,234
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Total Students
          </Typography>
        </Box>
      </Paper>
      <Paper
        sx={{
          p: 2,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderRadius: 3,
          bgcolor: 'white'
        }}
      >
        <Avatar sx={{ bgcolor: '#e8f5e9', color: '#4caf50' }}>
          <DashboardIcon />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
            24
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Active Courses
          </Typography>
        </Box>
      </Paper>
      <Paper
        sx={{
          p: 2,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderRadius: 3,
          bgcolor: 'white'
        }}
      >
        <Avatar sx={{ bgcolor: '#fff3e0', color: '#ff9800' }}>
          <NotificationsIcon />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
            8
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Pending Tasks
          </Typography>
        </Box>
      </Paper>
    </Stack>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Mobile Menu Button */}
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            position: 'fixed',
            top: 10,
            left: 10,
            zIndex: 1200,
            display: { xs: 'flex', md: 'none' },
            bgcolor: 'white',
            boxShadow: 1,
            '&:hover': { bgcolor: '#f5f5f5' }
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Desktop Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            display: { xs: 'none', md: 'block' },
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', borderRight: 'none' },
          }}
          open
        >
          <Toolbar />
          {drawer}
        </Drawer>

        {/* Mobile Sidebar */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            display: { xs: 'block', md: 'none' },
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          {drawer}
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            width: { md: `calc(100% - ${drawerWidth}px)` },
            minHeight: '100vh',
            backgroundColor: '#f5f7fa',
          }}
        >
          <Toolbar />
          <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 1 } }}>
            {/* Welcome Banner - Now in Content Area */}
            <WelcomeBanner />
            
            {/* Quick Stats */}
            <QuickStats />
            
            {/* Main Content Routes */}
            <Routes>
              <Route path="/students" element={<StudentList />} />
              <Route path="/payments" element={<PaymentHistory />} />
              <Route path="/hr" element={<HRModule />} />
              <Route path="/createuser" element={<CreateAdmin />} />
              <Route path="/" element={<AdminLayout />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminLayout;