import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Pagination
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  CheckCircle as PresentIcon,
  Warning as LateIcon,
  RemoveCircle as AbsentIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import attendanceService from '../../../services';

const AttendanceHistory = () => {
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalRecords: 0 });

  useEffect(() => {
    fetchAttendanceHistory();
  }, [selectedMonth, selectedYear, pagination.currentPage]);

  const fetchAttendanceHistory = async () => {
    setLoading(true);
    const response = await attendanceService.getMyAttendance(
      selectedMonth, 
      selectedYear, 
      pagination.currentPage
    );
    if (response.success) {
      setAttendance(response.data.attendance);
      setSummary(response.data.summary);
      setPagination(response.data.pagination);
    }
    setLoading(false);
  };

  const getStatusChip = (status) => {
    switch(status) {
      case 'present':
        return <Chip icon={<PresentIcon />} label="Present" color="success" size="small" />;
      case 'late':
        return <Chip icon={<LateIcon />} label="Late" color="warning" size="small" />;
      case 'half_day':
        return <Chip icon={<TimeIcon />} label="Half Day" color="info" size="small" />;
      case 'absent':
        return <Chip icon={<AbsentIcon />} label="Absent" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const SummaryCard = ({ title, value, icon, color }) => (
    <Card sx={{ bgcolor: color, color: 'white' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="caption">{title}</Typography>
            <Typography variant="h5" fontWeight="bold">{value}</Typography>
          </Box>
          {icon}
        </Box>
      </CardContent>
    </Card>
  );

  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
    { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
    { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' }
  ];

  const years = [2024, 2025, 2026];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Attendance History
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <SummaryCard 
            title="Present Days" 
            value={summary.presentDays || 0} 
            icon={<PresentIcon />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <SummaryCard 
            title="Late Days" 
            value={summary.lateDays || 0} 
            icon={<LateIcon />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <SummaryCard 
            title="Half Days" 
            value={summary.halfDays || 0} 
            icon={<TimeIcon />}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <SummaryCard 
            title="Absent Days" 
            value={summary.absentDays || 0} 
            icon={<AbsentIcon />}
            color="#f44336"
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Month</InputLabel>
              <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} label="Month">
                {months.map(month => (
                  <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Year</InputLabel>
              <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} label="Year">
                {years.map(year => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="textSecondary">
              Total Working Hours: {summary.totalWorkingHours || 0} hrs
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Attendance Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Date</TableCell>
              <TableCell>Check In</TableCell>
              <TableCell>Check Out</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Late Minutes</TableCell>
              <TableCell>Working Hours</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendance.map((record) => (
              <TableRow key={record._id}>
                <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}
                </TableCell>
                <TableCell>
                  {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}
                </TableCell>
                <TableCell>{getStatusChip(record.status)}</TableCell>
                <TableCell>{record.lateMinutes || 0}</TableCell>
                <TableCell>{record.totalWorkingHours || 0}</TableCell>
              </TableRow>
            ))}
            {attendance.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No attendance records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination 
            count={pagination.totalPages} 
            page={pagination.currentPage} 
            onChange={(e, page) => setPagination({ ...pagination, currentPage: page })}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default AttendanceHistory;