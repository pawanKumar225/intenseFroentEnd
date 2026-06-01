import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  Pagination
} from '@mui/material';
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import attendanceService from '../../../services';

const AdminAttendanceReport = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    employeeId: '',
    status: ''
  });
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalRecords: 0 });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchAttendance();
  }, [filters, pagination.currentPage]);

  const fetchAttendance = async () => {
    setLoading(true);
    const response = await attendanceService.getAllAttendance({
      ...filters,
      page: pagination.currentPage,
      limit: 50
    });
    if (response.success) {
      setAttendance(response.data.attendance);
      setEmployees(response.data.employees);
      setPagination(response.data.pagination);
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPagination({ ...pagination, currentPage: 1 });
  };

  const formatWorkingHours = (hours) => {
    if (!hours && hours !== 0) return '0:00';
    // If hours is already in decimal format (e.g., 7.5)
    if (typeof hours === 'number') {
      const hrs = Math.floor(hours);
      const mins = Math.round((hours - hrs) * 60);
      return `${hrs}:${mins.toString().padStart(2, '0')}`;
    }
    // If hours is in HH:MM format
    if (typeof hours === 'string' && hours.includes(':')) {
      return hours;
    }
    return '0:00';
  };

  const getDayStatus = (record) => {
    if (record.status === 'half_day') {
      return 'Half Day';
    } else if (record.status === 'present' || record.status === 'late') {
      return 'Full Day';
    } else if (record.status === 'absent') {
      return 'Absent';
    }
    return '-';
  };

  const exportToExcel = () => {
    if (!attendance.length) {
      setSnackbar({ open: true, message: 'No data to export', severity: 'warning' });
      return;
    }

    // Prepare data for Excel with requested headers
    const exportData = attendance.map(record => ({
      'Employee ID': record.employeeId || '-',
      'Emp Name': record.employeeName || '-',
      'Role': record.employeeRole || record.role || '-',
      'Date': record.date ? new Date(record.date).toLocaleDateString() : '-',
      'Check In': record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
      'Check Out': record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
      'Full Day/Half Day Status': getDayStatus(record),
      'Working/Login Hours:Min': formatWorkingHours(record.totalWorkingHours),
      'Location': record.checkInLocation?.address || record.location || '-'
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Set column widths for better readability
    const colWidths = [
      { wch: 15 }, // Employee ID
      { wch: 25 }, // Emp Name
      { wch: 20 }, // Role
      { wch: 15 }, // Date
      { wch: 12 }, // Check In
      { wch: 12 }, // Check Out
      { wch: 22 }, // Full Day/Half Day Status
      { wch: 22 }, // Working/Login Hours:Min
      { wch: 45 }  // Location
    ];
    ws['!cols'] = colWidths;

    // Style the header row
    const headerRange = XLSX.utils.decode_range(ws['!ref'] || 'A1:I1');
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = {
        font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4472C4" }, patternType: "solid" },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');

    // Generate filename with date range
    const fileName = `Attendance_Report_${filters.startDate}_to_${filters.endDate}.xlsx`;
    
    // Export file
    XLSX.writeFile(wb, fileName);
    
    setSnackbar({ open: true, message: 'Excel report exported successfully', severity: 'success' });
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'present':
        return 'Present';
      case 'late':
        return 'Late';
      case 'half_day':
        return 'Half Day';
      case 'absent':
        return 'Absent';
      default:
        return status;
    }
  };

  const getStatusChip = (status) => {
    switch(status) {
      case 'present':
        return <Chip label="Present" color="success" size="small" />;
      case 'late':
        return <Chip label="Late" color="warning" size="small" />;
      case 'half_day':
        return <Chip label="Half Day" color="info" size="small" />;
      case 'absent':
        return <Chip label="Absent" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Attendance Reports
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              size="small"
              label="Start Date"
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              size="small"
              label="End Date"
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Employee</InputLabel>
              <Select
                name="employeeId"
                value={filters.employeeId}
                onChange={handleFilterChange}
                label="Employee"
              >
                <MenuItem value="">All Employees</MenuItem>
                {employees.map(emp => (
                  <MenuItem key={emp.employeeId} value={emp.employeeId}>
                    {emp.name} ({emp.employeeId})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                label="Status"
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="present">Present</MenuItem>
                <MenuItem value="late">Late</MenuItem>
                <MenuItem value="half_day">Half Day</MenuItem>
                <MenuItem value="absent">Absent</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchAttendance} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export to Excel">
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={exportToExcel}
              sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#45a049' } }}
            >
              Export Excel
            </Button>
          </Tooltip>
        </Box>
      </Paper>

      {/* Attendance Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Employee ID</TableCell>
              <TableCell>Emp Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Check In</TableCell>
              <TableCell>Check Out</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Working Hours</TableCell>
              <TableCell>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : attendance.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">No attendance records found</TableCell>
              </TableRow>
            ) : (
              attendance.map((record) => (
                <TableRow key={record._id}>
                  <TableCell>{record.employeeId || '-'}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="body2" fontWeight={500}>{record.employeeName || '-'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{record.employeeRole || record.role || '-'}</TableCell>
                  <TableCell>{record.date ? new Date(record.date).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>
                    {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                  </TableCell>
                  <TableCell>
                    {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                  </TableCell>
                  <TableCell>{getStatusChip(record.status)}</TableCell>
                  <TableCell>{formatWorkingHours(record.totalWorkingHours)}</TableCell>
                  <TableCell>
                    <Tooltip title={record.checkInLocation?.address || record.location || 'Not captured'}>
                      <Typography variant="caption" noWrap sx={{ maxWidth: 150 }}>
                        {record.checkInLocation?.address?.substring(0, 30) || record.location?.substring(0, 30) || '-'}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminAttendanceReport;