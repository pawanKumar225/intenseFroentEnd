// App.tsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Paper,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import {
  People as PeopleIcon,
  Payment as PaymentIcon,
  BusinessCenter as BusinessCenterIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { ListItemButton } from '@mui/material';

const drawerWidth = 185;

// Mock Data
const initialStudents = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', batch: 'Batch A', status: 'Active', paymentStatus: 'Paid' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', batch: 'Batch B', status: 'Active', paymentStatus: 'Pending' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', batch: 'Batch A', status: 'Inactive', paymentStatus: 'Overdue' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', batch: 'Batch C', status: 'Active', paymentStatus: 'Paid' },
  { id: 5, name: 'Ethan Hunt', email: 'ethan@example.com', batch: 'Batch B', status: 'Active', paymentStatus: 'Pending' },
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', batch: 'Batch A', status: 'Active', paymentStatus: 'Paid' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', batch: 'Batch B', status: 'Active', paymentStatus: 'Pending' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', batch: 'Batch A', status: 'Inactive', paymentStatus: 'Overdue' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', batch: 'Batch C', status: 'Active', paymentStatus: 'Paid' },
  { id: 5, name: 'Ethan Hunt', email: 'ethan@example.com', batch: 'Batch B', status: 'Active', paymentStatus: 'Pending' },
];

const initialPayments = [
  { id: 1, student: 'Alice Johnson', amount: 500, date: '2025-01-15', status: 'Completed' },
  { id: 2, student: 'Bob Smith', amount: 500, date: '2025-01-10', status: 'Pending' },
  { id: 3, student: 'Charlie Brown', amount: 500, date: '2025-01-05', status: 'Failed' },
  { id: 4, student: 'Diana Prince', amount: 500, date: '2025-01-20', status: 'Completed' },
  { id: 5, student: 'Ethan Hunt', amount: 500, date: '2025-02-01', status: 'Pending' },
];

const initialHRData = [
  { id: 1, name: 'John Manager', role: 'HR Manager', email: 'john@hr.com', status: 'Active' },
  { id: 2, name: 'Sarah Recruiter', role: 'Talent Acquisition', email: 'sarah@hr.com', status: 'Active' },
  { id: 3, name: 'Mike Coordinator', role: 'HR Coordinator', email: 'mike@hr.com', status: 'Inactive' },
];

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
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
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1e293b',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
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
          '&:hover': {
            backgroundColor: '#1e293b',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          borderRadius: 16,
        },
      },
    },
  },
});

const AdminDashboard = () => {
  const [selectedItem, setSelectedItem] = useState('Student List');
  const [students] = useState(initialStudents);
  const [payments] = useState(initialPayments);
  const [hrList, setHrList] = useState(initialHRData);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: '' });

  const menuItems = [
    { text: 'Student List', icon: <PeopleIcon /> },
    { text: 'Payment History', icon: <PaymentIcon /> },
    { text: 'HR Module', icon: <BusinessCenterIcon /> },
    { text: 'Create Admin', icon: <AdminPanelSettingsIcon /> },
  ];

  const handleCreateAdmin = () => {
    if (newAdmin.name && newAdmin.email) {
      const newId = hrList.length + 1;
      setHrList([...hrList, { id: newId, name: newAdmin.name, email: newAdmin.email, role: newAdmin.role || 'Admin', status: 'Active' }]);
      setNewAdmin({ name: '', email: '', role: '' });
      alert('Admin created successfully!');
    } else {
      alert('Please fill required fields');
    }
  };

  const drawer = (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ px: 3, py: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700, letterSpacing: '-0.5px' }}>
          Admin Panel
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748b' }}>
          Manage everything
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                setSelectedItem(item.text);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                backgroundColor: selectedItem === item.text ? '#1e293b' : 'transparent',
                '&:hover': {
                  backgroundColor: '#1e293b',
                },
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
    </Box>
  );

  const renderContent = () => {
    switch (selectedItem) {
      case 'Student List':
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
              Student Management
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Total Students
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2' }}>
                      {students.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Active Students
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#10b981' }}>
                      {students.filter(s => s.status === 'Active').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Previous Students
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                      {students.filter(s => s.status === 'Inactive').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <TableContainer component={Paper} sx={{ borderRadius: 3, overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Batch</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Payment</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.batch}</TableCell>
                      <TableCell>
                        <Chip 
                          label={student.status} 
                          color={student.status === 'Active' ? 'success' : 'default'} 
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={student.paymentStatus} 
                          color={student.paymentStatus === 'Paid' ? 'success' : student.paymentStatus === 'Pending' ? 'warning' : 'error'} 
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      case 'Payment History':
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
              Payment History
            </Typography>
             <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Pending Payments
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                      {students.filter(s => s.paymentStatus === 'Pending').length}
                    </Typography>
                  </CardContent>
                </Card>
            <TableContainer component={Paper} sx={{ borderRadius: 3, overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell><strong>Student Name</strong></TableCell>
                    <TableCell><strong>Amount</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{payment.student}</TableCell>
                      <TableCell>${payment.amount}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>
                        <Chip 
                          label={payment.status} 
                          color={payment.status === 'Completed' ? 'success' : payment.status === 'Pending' ? 'warning' : 'error'} 
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      case 'HR Module':
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
              HR Team Management
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 3, overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Role</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hrList.map((member) => (
                    <TableRow key={member.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Chip label={member.status} color={member.status === 'Active' ? 'success' : 'default'} size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      case 'Create Admin':
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
              Create New Administrator
            </Typography>
            <Card sx={{ p: 4, maxWidth: 600 }}>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                margin="normal"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                variant="outlined"
                margin="normal"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Role"
                variant="outlined"
                margin="normal"
                value={newAdmin.role}
                onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                placeholder="e.g., Super Admin, HR Manager"
                sx={{ mb: 3 }}
              />
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleCreateAdmin}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 4 }}
              >
                Create Admin Account
              </Button>
            </Card>
          </Box>
        );
      default:
        return <Typography>Select an option</Typography>;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* App Bar */}
        {/* <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2, display: { xs: 'block', md: 'none' }, color: '#1e293b' }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700, color: '#1e293b' }}>
              Admin Dashboard
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ color: '#64748b', display: { xs: 'none', sm: 'block' } }}>
                Welcome, Admin
              </Typography>
              <Avatar sx={{ bgcolor: '#1976d2', width: 40, height: 40 }}>AD</Avatar>
            </Box>
          </Toolbar>
        </AppBar> */}

        {/* Sidebar for Desktop */}
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

        {/* Sidebar for Mobile */}
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
            {renderContent()}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard