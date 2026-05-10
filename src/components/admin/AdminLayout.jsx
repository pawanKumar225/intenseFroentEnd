
// src/admin/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton, Avatar, 
  List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  useMediaQuery, ThemeProvider, createTheme, CssBaseline
} from '@mui/material';
import {
  Menu as MenuIcon, People as PeopleIcon, Payment as PaymentIcon,
  BusinessCenter as BusinessCenterIcon, AdminPanelSettings as AdminPanelSettingsIcon,
  Logout as LogoutIcon, ChevronLeft as ChevronLeftIcon, 
  Password as PasswordIcon, Dashboard as DashboardIcon
} from '@mui/icons-material';
import { getLoggedInUser } from '../../utils/auth';

const drawerWidth = 188;
const collapsedDrawerWidth = 70;

const theme = createTheme({
  palette: { primary: { main: '#1976d2' }, background: { default: '#f5f7fa' } },
  shape: { borderRadius: 12 },
  components: {
    MuiDrawer: { styleOverrides: { paper: { backgroundColor: '#0f172a', color: '#e2e8f0', borderRight: 'none' } } },
    MuiListItemIcon: { styleOverrides: { root: { color: '#94a3b8', minWidth: 42 } } },
    MuiListItemButton: { styleOverrides: { root: { borderRadius: 10, margin: '4px 12px', '&:hover': { backgroundColor: '#1e293b' } } } }
  }
});

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: 'Student List', icon: <PeopleIcon />, path: '/admin/students' },
  { text: 'Payment History', icon: <PaymentIcon />, path: '/admin/payments' },
  { text: 'HR Module', icon: <BusinessCenterIcon />, path: '/admin/hr' },
  { text: 'Create User', icon: <AdminPanelSettingsIcon />, path: '/admin/createuser' },
  { text: 'Change Password', icon: <PasswordIcon />, path: '/admin/change-password' }
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginUser = getLoggedInUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState('Dashboard');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Set selected item based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(item => currentPath === item.path);
    if (currentItem) {
      setSelectedItem(currentItem.text);
    } else if (currentPath === '/admin') {
      setSelectedItem('Dashboard');
    }
  }, [location.pathname]);

  const handleNavigation = (text, path) => {
    setSelectedItem(text);
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const handleLogout = () => {
    console.log("Logout..........")
    localStorage.clear();
    navigate('/admin/login');
  };

  const toggleDrawer = () => setCollapsed(!collapsed);

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
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
      <Box sx={{ px: collapsed ? 1 : 2.5, py: 2.5, textAlign: collapsed ? 'center' : 'left', borderBottom: '1px solid #1e293b' }}>
        {!collapsed && (
          <>
            <Typography variant="caption" sx={{ color: '#64748b' }}>Welcome to</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#28dd18' }}>{loginUser || 'Admin'}</Typography>
          </>
        )}
        {collapsed && (
          <Avatar sx={{ width: 40, height: 40, bgcolor: '#28dd18', margin: '0 auto' }}>
            {loginUser?.charAt(0) || 'A'}
          </Avatar>
        )}
        <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 700 }}>
          {!collapsed ? 'Intense Beauty' : 'IB'}
        </Typography>
        {!collapsed && (
          <Typography variant="caption" sx={{ color: '#64748b' }}>Admin Panel</Typography>
        )}
      </Box>
      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              onClick={() => handleNavigation(item.text, item.path)} 
              sx={{ 
                backgroundColor: selectedItem === item.text ? '#1e293b' : 'transparent',
                justifyContent: collapsed ? 'center' : 'flex-start',
                '&:hover': { backgroundColor: '#1e293b' }
              }}
            >
              <ListItemIcon sx={{ 
                color: selectedItem === item.text ? '#60a5fa' : '#94a3b8', 
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
                      color: selectedItem === item.text ? '#ffffff' : '#cbd5e1', 
                      fontSize: '0.85rem',
                      fontWeight: selectedItem === item.text ? 600 : 400
                    } 
                  }} 
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: collapsed ? 1 : 2, borderTop: '1px solid #1e293b' }}>
        <ListItemButton 
          onClick={handleLogout} 
          sx={{ 
            justifyContent: collapsed ? 'center' : 'flex-start',
            '&:hover': { backgroundColor: '#1e293b' }
          }}
        >
          <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : 42, justifyContent: 'center' }}>
            <LogoutIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Logout" sx={{ '& .MuiTypography-root': { color: '#cbd5e1' } }} />}
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
 
        
        <Drawer 
          variant="permanent" 
          sx={{ 
            width: collapsed ? collapsedDrawerWidth : drawerWidth, 
            display: { xs: 'none', md: 'block' }, 
            '& .MuiDrawer-paper': { 
              width: collapsed ? collapsedDrawerWidth : drawerWidth, 
              transition: 'width 0.3s ease', 
              position: 'relative',
              overflowX: 'hidden'
            } 
          }} 
          open
        >
          <Toolbar />
          {drawer}
        </Drawer>
        
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
        
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            width: { md: `calc(100% - ${collapsed ? collapsedDrawerWidth : drawerWidth}px)` }, 
            mt: 8, 
            backgroundColor: '#f5f7fa',
            transition: 'width 0.3s ease'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminLayout;