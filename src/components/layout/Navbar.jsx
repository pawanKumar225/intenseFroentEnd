// // src/layout/Navbar.jsx
// import { Link } from "react-router-dom";

// export default function Navbar() {
//   return (
//   <nav className="navbar navbar-expand-lg  custom-navbar" style={{
//   background: "linear-gradient(90deg, #84b8e2, #84d816)"
// }}>
//       <div className="container">
//         <img src='../../public/logo.png' style={{
//             width: "200px",
//             borderRadius: "100px",
//             border: "3px solid #fff",
//             padding: "5px",
//             boxShadow: "0 4px 15px rgba(57, 199, 22, 0.2)",
//   }} alt='Beauty Academy' />
        

//         <div className="collapse navbar-collapse">
//           <ul className="navbar-nav ms-auto">
//             <li><Link className="nav-link" to="/">Home</Link></li>
//             <li><Link className="nav-link" to="/about">About</Link></li>
//             <li><Link className="nav-link" to="/services">Services</Link></li>
//             <li><Link className="nav-link" to="/contact">Contact</Link></li>
//             <li><Link className="nav-link" to="/admin/login">Admin</Link></li>
//             <li><Link className="nav-link" to="/user">User</Link></li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }


// src/layout/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
  Badge
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import BuildIcon from "@mui/icons-material/Build";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import SchoolIcon from "@mui/icons-material/School";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    checkAuthStatus();
    // Listen for storage changes (login/logout in other tabs)
    window.addEventListener('storage', checkAuthStatus);
    return () => window.removeEventListener('storage', checkAuthStatus);
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    
    setIsLoggedIn(!!token);
    setUserRole(role);
    setUserName(name || (role === 'admin' ? 'Admin' : 'User'));
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    handleMenuClose();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (mobileOpen) {
      setMobileOpen(false);
    }
    handleMenuClose();
  };

  // Navigation items
  const navItems = [
    { path: "/", label: "Home", icon: <HomeIcon /> },
    { path: "/about", label: "About", icon: <InfoIcon /> },
    { path: "/services", label: "Services", icon: <BuildIcon /> },
    { path: "/contact", label: "Contact", icon: <ContactMailIcon /> },
  ];

  // Get dashboard path based on role
  const getDashboardPath = () => {
    switch(userRole) {
      case 'super_admin':
      case 'admin':
        return '/admin/dashboard';
      case 'hr_manager':
        return '/hr/dashboard';
      case 'employee':
        return '/employee/dashboard';
      default:
        return '/admin/dashboard';
    }
  };

  // Mobile Drawer Content
  const drawer = (
    <Box sx={{ width: 280, height: '100%', bgcolor: '#fff' }}>
      {/* Drawer Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid #e0e0e0',
        background: 'linear-gradient(90deg, #84b8e2, #84d816)'
      }}>
        <img 
          src='/logo.png' 
          alt='Beauty Academy' 
          style={{ 
            width: '150px', 
            borderRadius: '50px',
            border: '2px solid #fff',
            padding: '5px'
          }} 
        />
        <IconButton onClick={handleDrawerToggle} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* User Info if logged in */}
      {isLoggedIn && (
        <Box sx={{ p: 2, textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>
          <Avatar sx={{ 
            width: 60, 
            height: 60, 
            margin: '0 auto 10px',
            bgcolor: '#84d816',
            color: '#fff'
          }}>
            {userName?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="subtitle1" fontWeight="bold">
            {userName}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Role: {userRole?.replace('_', ' ').toUpperCase()}
          </Typography>
        </Box>
      )}

      <List sx={{ pt: 2 }}>
        {navItems.map((item) => (
          <ListItem 
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            sx={{ 
              '&:hover': { bgcolor: '#f5f5f5' },
              cursor: 'pointer'
            }}
          >
            <Box sx={{ mr: 2, color: '#84d816' }}>{item.icon}</Box>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}

        <Divider sx={{ my: 1 }} />

        {/* Admin Section */}
        <ListItem 
          onClick={() => handleNavigation('/admin/login')}
          sx={{ 
            '&:hover': { bgcolor: '#f5f5f5' },
            cursor: 'pointer'
          }}
        >
          <Box sx={{ mr: 2, color: '#84d816' }}><AdminPanelSettingsIcon /></Box>
          <ListItemText primary="Admin Login" />
        </ListItem>

        {/* User Section */}
        <ListItem 
          onClick={() => handleNavigation('/user/login')}
          sx={{ 
            '&:hover': { bgcolor: '#f5f5f5' },
            cursor: 'pointer'
          }}
        >
          <Box sx={{ mr: 2, color: '#84d816' }}><PersonIcon /></Box>
          <ListItemText primary="Student Login" />
        </ListItem>

        {isLoggedIn && (
          <>
            <Divider sx={{ my: 1 }} />
            <ListItem 
              onClick={() => handleNavigation(getDashboardPath())}
              sx={{ 
                '&:hover': { bgcolor: '#f5f5f5' },
                cursor: 'pointer'
              }}
            >
              <Box sx={{ mr: 2, color: '#84d816' }}><DashboardIcon /></Box>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem 
              onClick={handleLogout}
              sx={{ 
                '&:hover': { bgcolor: '#ffebee' },
                cursor: 'pointer',
                color: '#f44336'
              }}
            >
              <Box sx={{ mr: 2, color: '#f44336' }}><LogoutIcon /></Box>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
      </List>

      {/* Footer */}
      <Box sx={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        p: 2, 
        textAlign: 'center',
        borderTop: '1px solid #e0e0e0',
        bgcolor: '#f9f9f9'
      }}>
        <Typography variant="caption" color="textSecondary">
          © 2024 Intense Beauty Academy
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={2}
        sx={{
          background: "linear-gradient(90deg, #84b8e2, #84d816)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
            {/* Logo */}
            <Box 
              component={Link} 
              to="/" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              <img 
                src='/logo.png' 
                alt='Intense Beauty Academy' 
                style={{
                  width: isMobile ? "150px" : "180px",
                  borderRadius: "50px",
                  border: "2px solid #fff",
                  padding: "5px",
                  boxShadow: "0 4px 15px rgba(57, 199, 22, 0.2)",
                  transition: 'all 0.3s ease'
                }} 
              />
            </Box>

            {/* Desktop Menu */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    color="inherit"
                    sx={{
                      color: '#fff',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease',
                      mx: 0.5
                    }}
                  >
                    {item.label}
                  </Button>
                ))}

                {/* Admin Button */}
                <Button
                  component={Link}
                  to="/admin/login"
                  color="inherit"
                  sx={{
                    color: '#fff',
                    fontWeight: 500,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      transform: 'translateY(-2px)'
                    },
                    mx: 0.5,
                    px: 2
                  }}
                >
                  <AdminPanelSettingsIcon sx={{ mr: 0.5, fontSize: 20 }} />
                  Admin
                </Button>

                {/* Student Button */}
                <Button
                  component={Link}
                  to="/user/login"
                  color="inherit"
                  sx={{
                    color: '#fff',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)'
                    },
                    mx: 0.5
                  }}
                >
                  <SchoolIcon sx={{ mr: 0.5, fontSize: 20 }} />
                  Student
                </Button>

                {/* User Menu if logged in */}
                {isLoggedIn && (
                  <>
                    <Button
                      onClick={handleMenuOpen}
                      sx={{
                        color: '#fff',
                        ml: 1,
                        textTransform: 'none',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                      }}
                    >
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#fff', color: '#84d816' }}>
                        {userName?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
                        {userName}
                      </Typography>
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      PaperProps={{
                        sx: {
                          mt: 1,
                          minWidth: 200,
                          borderRadius: 2
                        }
                      }}
                    >
                      <MenuItem onClick={() => handleNavigation(getDashboardPath())}>
                        <DashboardIcon sx={{ mr: 1, fontSize: 20 }} />
                        Dashboard
                      </MenuItem>
                      <MenuItem onClick={() => handleNavigation('/change-password')}>
                        <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                        Change Password
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout} sx={{ color: '#f44336' }}>
                        <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                )}
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ color: '#fff' }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            width: 280,
            boxSizing: 'border-box',
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20
          }
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}