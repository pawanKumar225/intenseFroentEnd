// src/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  People as PeopleIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Pending as PendingIcon
} from '@mui/icons-material';
import studentApprovalService from '../../services/studentApprovalService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentStudents, setRecentStudents] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsResponse = await studentApprovalService.getStudentStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      const allStudentsResponse = await studentApprovalService.getAllStudents();
      if (allStudentsResponse.success) {
        setRecentStudents(allStudentsResponse.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}20, ${color}10)`, borderLeft: `4px solid ${color}` }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="textSecondary" variant="subtitle2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
          </Box>
          <Box sx={{ color: color }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Admin Dashboard
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
        Welcome back to your admin panel
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Students" 
            value={stats.total} 
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Pending Approvals" 
            value={stats.pending} 
            icon={<PendingIcon sx={{ fontSize: 40 }} />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Approved Students" 
            value={stats.approved} 
            icon={<ApprovedIcon sx={{ fontSize: 40 }} />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Rejected Students" 
            value={stats.rejected} 
            icon={<RejectedIcon sx={{ fontSize: 40 }} />}
            color="#f44336"
          />
        </Grid>
      </Grid>

      {/* Recent Registrations */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Recent Student Registrations
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Registration ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Package</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentStudents.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.registrationId}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.packageDetails}</TableCell>
                  <TableCell>
                    <Chip 
                      label={student.status.toUpperCase()} 
                      color={
                        student.status === 'active' ? 'success' : 
                        student.status === 'rejected' ? 'error' : 'warning'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(student.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;