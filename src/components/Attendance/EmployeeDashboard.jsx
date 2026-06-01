import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Avatar,
  Chip,
  Dialog,
  IconButton
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MarkAttendance from '../Attendance/MarkAttendance';

export default function EmployeeDashboard() {
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const userName = localStorage.getItem('userName') || 'Student';
  const userRole = localStorage.getItem('userRole') || 'Student';
console.log("username", userName, "Role.......", userRole)
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          background: 'linear-gradient(135deg, #84b8e2 0%, #84d816 100%)',
          color: 'white',
          borderRadius: 3
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Welcome back, {userName}! 👋
            </Typography>
            <Typography variant="subtitle1">
              Role: {userRole?.toUpperCase()}
            </Typography>
          </Box>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'white', color: '#84d816' }}>
            {userName?.charAt(0).toUpperCase()}
          </Avatar>
        </Box>
      </Paper>

      {/* Quick Actions Section */}
      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
      
      <Grid container spacing={3}>
        {/* Mark Attendance Card */}
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
              },
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
            onClick={() => setAttendanceDialogOpen(true)}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <QrCodeScannerIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Mark Attendance
              </Typography>
              <Typography variant="body2">
                Scan QR code to mark your daily attendance
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  bgcolor: 'white',
                  color: '#667eea',
                  '&:hover': {
                    bgcolor: '#f5f5f5'
                  }
                }}
                startIcon={<QrCodeScannerIcon />}
              >
                Scan Now
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Status Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: '#84d816' }}>
                Today's Status
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mt={2}>
                <EventNoteIcon sx={{ color: '#84d816' }} />
                <Typography>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2} mt={2}>
                <AccessTimeIcon sx={{ color: '#84d816' }} />
                <Typography>
                  Current Time: {new Date().toLocaleTimeString()}
                </Typography>
              </Box>
              <Chip 
                label="Not Marked Yet" 
                color="warning" 
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Attendance Section */}
      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4, mb: 3 }}>
        Recent Attendance
      </Typography>
      
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography color="textSecondary" textAlign="center">
          No attendance records found. Mark your attendance today!
        </Typography>
      </Paper>

      {/* Attendance Dialog */}
      <Dialog
        open={attendanceDialogOpen}
        onClose={() => setAttendanceDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <MarkAttendance onClose={() => setAttendanceDialogOpen(false)} />
      </Dialog>
    </Container>
  );
}