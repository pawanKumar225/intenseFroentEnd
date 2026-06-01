import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Login as CheckIcon,
  History as HistoryIcon,
  Assignment as LeaveIcon,
  BarChart as ReportIcon
} from '@mui/icons-material';
import CheckInOutCard from './CheckInOutCard';
import AttendanceHistory from './AttendanceHistory';
import LeaveRequest from './LeaveRequest';
import AdminAttendanceReport from './AdminAttendanceReport';

const AttendanceModule = ({ userRole }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Determine tabs based on role
  const getTabs = () => {
    const tabs = [
      { label: 'Check In/Out', icon: <CheckIcon />, component: <CheckInOutCard onUpdate={() => setRefreshTrigger(prev => prev + 1)} /> }
    ];
    
    tabs.push({ label: 'My History', icon: <HistoryIcon />, component: <AttendanceHistory /> });
    tabs.push({ label: 'Leave Request', icon: <LeaveIcon />, component: <LeaveRequest /> });
    
    if (userRole === 'admin' || userRole === 'super_admin' || userRole === 'hr_manager') {
      tabs.push({ label: 'Admin Reports', icon: <ReportIcon />, component: <AdminAttendanceReport /> });
    }
    
    return tabs;
  };

  const tabs = getTabs();

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
        Attendance Management
      </Typography>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f5f5f5' }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
          ))}
        </Tabs>

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {tabs[tabValue]?.component}
        </Box>
      </Paper>
    </Box>
  );
};

export default AttendanceModule;