// src/hrmodule/HRLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
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
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LockReset as LockResetIcon,
   EventNote as AttendanceIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { getLoggedInUser } from '../../utils/auth';

const drawerWidth = 188;
const collapsedDrawerWidth = 80;

const theme = createTheme({
  palette: {
    primary: { main: '#e91e63' },
    secondary: { main: '#2196f3' },
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

const HRLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginUser = getLoggedInUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Get user role from localStorage
  const userRole = localStorage.getItem('userRole') || 'hr_manager';

  // Check if user has access to approvals
  const hasApprovalsAccess = ['super_admin', 'hr_manager', 'admin'].includes(userRole);

  // Menu items for HR
const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/hr/dashboard',
      roles: ['hr_manager', 'super_admin', 'admin']
    },
    { 
      text: 'HR Module', 
      icon: <PeopleIcon />, 
      path: '/hr/module',
      roles: ['hr_manager', 'super_admin', 'admin']
    },
    { 
      text: 'Approvals', 
      icon: <AssignmentIcon />, 
      path: '/hr/approvals',
      roles: ['hr_manager', 'super_admin', 'admin']
    },
    { 
      text: 'Attendance', 
      icon: <AttendanceIcon />, 
      path: '/hr/attendance',
      roles: ['hr_manager', 'super_admin', 'admin']
    },
    { 
      text: 'Change Password', 
      icon: <LockIcon />, 
      path: '/hr/change-password',
      roles: ['hr_manager', 'super_admin', 'admin']
    }
  ];
  
  // Add Approvals item if user has access (renders within HR layout)
  if (hasApprovalsAccess) {
    menuItems.push({ text: 'Approvals', icon: <FactCheckIcon />, path: '/hr/approvals' });
  }
  
  menuItems.push({ text: 'Change Password', icon: <LockResetIcon />, path: '/hr/change-password' });

  const getSelectedItem = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/module')) return 'HR Module';
    if (path.includes('/approvals')) return 'Approvals';
    if (path.includes('/change-password')) return 'Change Password';
    return 'Dashboard';
  };

  const [selectedItem, setSelectedItem] = useState(getSelectedItem());

  useEffect(() => {
    setSelectedItem(getSelectedItem());
  }, [location.pathname]);

  const handleNavigation = (text, path) => {
    setSelectedItem(text);
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  const toggleDrawer = () => setCollapsed(!collapsed);

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Collapse Toggle Button */}
      {!isMobile && (
        <IconButton 
          onClick={toggleDrawer} 
          sx={{ 
            position: 'absolute', 
            right: -12, 
            top: 20, 
            zIndex: 1300, 
            bgcolor: '#1e293b', 
            width: 24, 
            height: 24,
            '&:hover': { bgcolor: '#334155' }
          }}
        >
          <ChevronLeftIcon sx={{ fontSize: 16, transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
        </IconButton>
      )}
      
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
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#e91e63', mb: 0.5 }}>
              HR Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              {loginUser || 'HR Manager'}
            </Typography>
          </>
        )}
        {collapsed && (
          <Avatar sx={{ width: 45, height: 45, bgcolor: '#e91e63', margin: '0 auto', fontSize: '1.2rem' }}>
            HR
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
                backgroundColor: selectedItem === item.text ? '#e91e63' : 'transparent',
                justifyContent: collapsed ? 'center' : 'flex-start',
                mx: collapsed ? 1 : 1.5,
                '&:hover': {
                  backgroundColor: selectedItem === item.text ? '#e91e63' : '#1e293b'
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

      {/* Logout Button */}
      <Box sx={{ p: collapsed ? 1 : 2, pb: 3 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            justifyContent: collapsed ? 'center' : 'flex-start',
            backgroundColor: 'rgba(233, 30, 99, 0.1)',
            '&:hover': { backgroundColor: 'rgba(233, 30, 99, 0.2)' }
          }}
        >
          <ListItemIcon sx={{ 
            color: '#e91e63', 
            minWidth: collapsed ? 'auto' : 42,
            justifyContent: 'center'
          }}>
            <LogoutIcon />
          </ListItemIcon>
          {!collapsed && (
            <ListItemText 
              primary="Logout" 
              sx={{ '& .MuiTypography-root': { color: '#e91e63', fontWeight: 600 } }}
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

export default HRLayout;