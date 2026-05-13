// src/hrmodule/HRDashboard.jsx
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
  CircularProgress,
  Avatar,
  AvatarGroup
} from '@mui/material';
import {
  People as PeopleIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Pending as PendingIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import studentApprovalService from '../../services/studentApprovalService';

const HRDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

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

      const pendingResponse = await studentApprovalService.getPendingStudents();
      if (pendingResponse.success) {
        setPendingStudents(pendingResponse.data.slice(0, 5));
      }

      // Mock recent activities (you can replace with actual API call)
      setRecentActivities([
        { id: 1, activity: 'New student registration', time: '2 minutes ago', type: 'registration' },
        { id: 2, activity: 'Student approved', time: '1 hour ago', type: 'approval' },
        { id: 3, activity: 'Bulk approval completed', time: '3 hours ago', type: 'bulk' },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ 
      height: '100%', 
      background: `linear-gradient(135deg, ${color}20, ${color}05)`, 
      borderLeft: `4px solid ${color}`,
      transition: 'transform 0.3s ease',
      '&:hover': { transform: 'translateY(-4px)' }
    }}>
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
        HR Dashboard
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
        Welcome back to HR management portal
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Students" 
            value={stats.total} 
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            color="#e91e63"
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
            title="Rejection Rate" 
            value={`${stats.total ? Math.round((stats.rejected / stats.total) * 100) : 0}%`} 
            icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
            color="#f44336"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Pending Approvals Table */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Pending Approvals
              </Typography>
              <Chip label={`${pendingStudents.length} pending`} color="warning" size="small" />
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Registration ID</TableCell>
                    <TableCell>Package</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingStudents.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.registrationId}</TableCell>
                      <TableCell>{student.packageDetails}</TableCell>
                      <TableCell>{new Date(student.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                  {pendingStudents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No pending approvals
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Recent Activities
            </Typography>
            <Box>
              {recentActivities.map((activity) => (
                <Box key={activity.id} sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <AssignmentIcon sx={{ mr: 2, color: '#e91e63' }} />
                  <Box flex={1}>
                    <Typography variant="body2">{activity.activity}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {activity.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HRDashboard;