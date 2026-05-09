// src/employee/EmployeeLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Divider,
  Badge,
  Menu,
  MenuItem,
  alpha,
  Paper 
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  EventNote as AttendanceIcon,
  Assignment as LeaveIcon,
  LockReset as LockResetIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const drawerWidth = 188;
const collapsedDrawerWidth = 80;

const theme = createTheme({
  palette: {
    primary: { main: '#2196f3' },
    secondary: { main: '#4caf50' },
    background: { default: '#f5f7fa' },
    text: { primary: '#1e293b', secondary: '#64748b' }
  },
  shape: { borderRadius: 12 },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0f172a',
          color: '#e2e8f0',
          borderRight: 'none',
          backgroundImage: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 12px',
          padding: '10px 16px',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#1e293b',
            transform: 'translateX(4px)'
          }
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#94a3b8',
          minWidth: 42
        }
      }
    }
  }
});

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/employee/dashboard' },
  { text: 'Attendance', icon: <AttendanceIcon />, path: '/employee/attendance' },
  { text: 'Apply Leave', icon: <LeaveIcon />, path: '/employee/apply-leave' },
  { text: 'Change Password', icon: <LockResetIcon />, path: '/employee/change-password' }
];

const EmployeeLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Get employee info from localStorage
  const employeeInfo = JSON.parse(localStorage.getItem('employeeInfo') || '{}');
  const employeeName = employeeInfo.name || 'Rama';
  const employeeRole = employeeInfo.role || 'Software Developer';
  const employeeAvatar = employeeName.charAt(0);

  const getSelectedItem = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/attendance')) return 'Attendance';
    if (path.includes('/apply-leave')) return 'Apply Leave';
    if (path.includes('/change-password')) return 'Change Password';
    return 'Dashboard';
  };

  const [selectedItem, setSelectedItem] = useState(getSelectedItem());

  React.useEffect(() => {
    setSelectedItem(getSelectedItem());
  }, [location.pathname]);

  const handleNavigation = (text, path) => {
    setSelectedItem(text);
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('employeeInfo');
    navigate('/admin/login');
  };

  const toggleDrawer = () => setCollapsed(!collapsed);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
   

      {/* Logo Section */}
      <Box sx={{ 
        px: collapsed ? 1 : 2.5, 
        py: 3, 
        textAlign: collapsed ? 'center' : 'left',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        {!collapsed && (
          <>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1 }}>
              Welcome to
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#2196f3', mb: 0.5 }}>
              Employee Portal
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              {employeeName}
            </Typography>
          </>
        )}
        {collapsed && (
          <Avatar sx={{ width: 45, height: 45, bgcolor: '#a11154', margin: '0 auto', fontSize: '1.2rem' }}>
            {employeeAvatar}
          </Avatar>
        )}
      </Box>

      {/* Menu Items */}
      <List sx={{ flex: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.text, item.path)}
              sx={{
                backgroundColor: selectedItem === item.text ? '#2196f3' : 'transparent',
                justifyContent: collapsed ? 'center' : 'flex-start',
                mx: collapsed ? 1 : 1.5,
                '&:hover': {
                  backgroundColor: selectedItem === item.text ? '#2196f3' : '#1e293b'
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: selectedItem === item.text ? 'white' : '#94a3b8',
                minWidth: collapsed ? 'auto' : 42,
                justifyContent: 'center'
              }}>
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.text}
                  sx={{
                    '& .MuiTypography-root': {
                      color: selectedItem === item.text ? 'white' : '#cbd5e1',
                      fontWeight: selectedItem === item.text ? 600 : 400,
                      fontSize: '0.9rem'
                    }
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

      {/* Employee Info Section */}
      {!collapsed && (
        <Box sx={{ p: 2, pb: 2 }}>
        <Paper
  sx={{
    p: 2,
    background: 'linear-gradient(135deg, #8e2de2 0%, #ff6a88 100%)',
    borderRadius: 3,
    color: '#fff',
    boxShadow: '0 8px 24px rgba(233, 30, 99, 0.25)'
  }}
>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Avatar sx={{ bgcolor: '#2196f3', width: 40, height: 40 }}>
                {employeeAvatar}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={600} color='#4726db'>
                  {employeeName}
                </Typography>
                <Typography variant="caption" color='#94a3b8'>
                  {employeeRole}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Logout Button */}
      <Box sx={{ p: collapsed ? 1 : 2, pb: 3 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            justifyContent: collapsed ? 'center' : 'flex-start',
            backgroundColor: alpha('#f44336', 0.1),
            '&:hover': { backgroundColor: alpha('#f44336', 0.2) }
          }}
        >
          <ListItemIcon sx={{ 
            color: '#f44336', 
            minWidth: collapsed ? 'auto' : 42,
            justifyContent: 'center'
          }}>
            <LogoutIcon />
          </ListItemIcon>
          {!collapsed && (
            <ListItemText 
              primary="Logout" 
              sx={{ '& .MuiTypography-root': { color: '#f44336', fontWeight: 600 } }}
            />
          )}
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Desktop Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: collapsed ? collapsedDrawerWidth : drawerWidth,
            flexShrink: 0,
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: collapsed ? collapsedDrawerWidth : drawerWidth,
              transition: 'width 0.3s ease',
              overflowX: 'hidden',
              position: 'relative',
            }
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
            '& .MuiDrawer-paper': { width: drawerWidth }
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
            width: { md: `calc(100% - ${collapsed ? collapsedDrawerWidth : drawerWidth}px)` },
            mt: 8,
            backgroundColor: '#f5f7fa',
            transition: 'width 0.3s ease',
            minHeight: '100vh'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default EmployeeLayout;