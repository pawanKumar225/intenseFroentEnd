// src/admin/StudentApprovals.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
    Typography,
    Chip,
    IconButton,
    Tooltip,
    Card,
    CardContent,
    Grid
} from '@mui/material';
import {
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    Visibility as ViewIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import studentApprovalService from '../../services/studentApprovalService';

const StudentApprovals = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectRemarks, setRejectRemarks] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [bulkRejectMode, setBulkRejectMode] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const [stats, setStats] = useState({
        pending: 0,
        approved: 0,
        rejected: 0
    });

    // Fetch students based on active tab
    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            let response;
            if (activeTab === 0) {
                response = await studentApprovalService.getPendingStudents();
            } else if (activeTab === 1) {
                response = await studentApprovalService.getApprovedStudents();
            } else {
                response = await studentApprovalService.getRejectedStudents();
            }
            
            if (response.success) {
                setStudents(response.data);
                setSelectedStudents([]);
            } else {
                showAlert('error', response.message || 'Failed to fetch students');
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            showAlert('error', error.message || 'Error fetching students');
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    // Fetch stats
    const fetchStats = useCallback(async () => {
        try {
            const response = await studentApprovalService.getStudentStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }, []);

    useEffect(() => {
        fetchStudents();
        fetchStats();
    }, [fetchStudents, fetchStats]);

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setSelectedStudents([]);
        setSelectedStudentId(null);
    };

    const handleSelectStudent = (studentId) => {
        setSelectedStudents(prev => 
            prev.includes(studentId) 
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSelectAll = () => {
        if (selectedStudents.length === students.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(students.map(s => s._id));
        }
    };

    const handleApproveSingle = async (studentId) => {
        setLoading(true);
        try {
            const response = await studentApprovalService.approveStudent(studentId);
            if (response.success) {
                showAlert('success', 'Student approved successfully');
                fetchStudents();
                fetchStats();
            } else {
                showAlert('error', response.message || 'Failed to approve student');
            }
        } catch (error) {
            showAlert('error', error.message || 'Error approving student');
        } finally {
            setLoading(false);
        }
    };

    const handleBulkApprove = async () => {
        if (selectedStudents.length === 0) {
            showAlert('warning', 'Please select students to approve');
            return;
        }

        setLoading(true);
        try {
            const response = await studentApprovalService.bulkApproveStudents(selectedStudents);
            if (response.success) {
                showAlert('success', response.message);
                fetchStudents();
                fetchStats();
                setSelectedStudents([]);
            } else {
                showAlert('error', response.message || 'Failed to approve students');
            }
        } catch (error) {
            showAlert('error', error.message || 'Error approving students');
        } finally {
            setLoading(false);
        }
    };

    const openRejectDialog = (studentId = null, isBulk = false) => {
        setSelectedStudentId(studentId);
        setBulkRejectMode(isBulk);
        setRejectRemarks('');
        setRejectDialogOpen(true);
    };

    const handleReject = async () => {
        if (!rejectRemarks.trim()) {
            showAlert('warning', 'Please provide remarks for rejection');
            return;
        }

        setLoading(true);
        try {
            let response;
            if (bulkRejectMode) {
                response = await studentApprovalService.bulkRejectStudents(selectedStudents, rejectRemarks);
            } else {
                response = await studentApprovalService.rejectStudent(selectedStudentId, rejectRemarks);
            }

            if (response.success) {
                showAlert('success', response.message);
                setRejectDialogOpen(false);
                fetchStudents();
                fetchStats();
                if (bulkRejectMode) {
                    setSelectedStudents([]);
                }
            } else {
                showAlert('error', response.message || 'Failed to reject student');
            }
        } catch (error) {
            showAlert('error', error.message || 'Error rejecting student');
        } finally {
            setLoading(false);
        }
    };

    const getStatusChip = (status) => {
        const statusConfig = {
            pending: { color: 'warning', label: 'Pending' },
            active: { color: 'success', label: 'Approved' },
            approved: { color: 'success', label: 'Approved' },
            rejected: { color: 'error', label: 'Rejected' }
        };
        const config = statusConfig[status] || statusConfig.pending;
        return <Chip label={config.label} color={config.color} size="small" />;
    };

    const StatCard = ({ title, value, color, tabIndex }) => (
        <Card 
            sx={{ 
                cursor: 'pointer',
                borderLeft: `4px solid ${color}`,
                '&:hover': { transform: 'translateY(-2px)', transition: '0.3s' }
            }}
            onClick={() => setActiveTab(tabIndex)}
        >
            <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h4" color={color}>
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ p: 3 }}>
            {alert.show && (
                <Alert severity={alert.type} sx={{ mb: 2 }} onClose={() => setAlert({ show: false })}>
                    {alert.message}
                </Alert>
            )}

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <StatCard 
                        title="Pending Approvals" 
                        value={stats.pending} 
                        color="#ff9800" 
                        tabIndex={0}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatCard 
                        title="Approved Students" 
                        value={stats.approved} 
                        color="#4caf50" 
                        tabIndex={1}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatCard 
                        title="Rejected Students" 
                        value={stats.rejected} 
                        color="#f44336" 
                        tabIndex={2}
                    />
                </Grid>
            </Grid>

            {/* Action Buttons */}
            {activeTab === 0 && selectedStudents.length > 0 && (
                <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<ApproveIcon />}
                        onClick={handleBulkApprove}
                        disabled={loading}
                    >
                        Approve Selected ({selectedStudents.length})
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<RejectIcon />}
                        onClick={() => openRejectDialog(null, true)}
                        disabled={loading}
                    >
                        Reject Selected ({selectedStudents.length})
                    </Button>
                </Box>
            )}

            {/* Main Content */}
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab label={`Pending (${stats.pending})`} />
                    <Tab label={`Approved (${stats.approved})`} />
                    <Tab label={`Rejected (${stats.rejected})`} />
                </Tabs>

                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Tooltip title="Refresh">
                        <IconButton onClick={fetchStudents} disabled={loading}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {activeTab === 0 && (
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={selectedStudents.length > 0 && selectedStudents.length < students.length}
                                            checked={students.length > 0 && selectedStudents.length === students.length}
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                )}
                                <TableCell>Registration ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Contact</TableCell>
                                <TableCell>Package</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={activeTab === 0 ? 8 : 7} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : students.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={activeTab === 0 ? 8 : 7} align="center">
                                        <Typography variant="body1" color="textSecondary">
                                            No {activeTab === 0 ? 'pending' : activeTab === 1 ? 'approved' : 'rejected'} students found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                students.map((student) => (
                                    <TableRow key={student._id}>
                                        {activeTab === 0 && (
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={selectedStudents.includes(student._id)}
                                                    onChange={() => handleSelectStudent(student._id)}
                                                />
                                            </TableCell>
                                        )}
                                        <TableCell>{student.registrationId}</TableCell>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>{student.email}</TableCell>
                                        <TableCell>{student.contactNumber}</TableCell>
                                        <TableCell>{student.packageDetails}</TableCell>
                                        <TableCell>{getStatusChip(student.status)}</TableCell>
                                        <TableCell>
                                            <Tooltip title="View Details">
                                                <IconButton size="small" color="info">
                                                    <ViewIcon />
                                                </IconButton>
                                            </Tooltip>
                                            {activeTab === 0 && (
                                                <>
                                                    <Tooltip title="Approve">
                                                        <IconButton 
                                                            size="small" 
                                                            color="success"
                                                            onClick={() => handleApproveSingle(student._id)}
                                                            disabled={loading}
                                                        >
                                                            <ApproveIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Reject">
                                                        <IconButton 
                                                            size="small" 
                                                            color="error"
                                                            onClick={() => openRejectDialog(student._id, false)}
                                                            disabled={loading}
                                                        >
                                                            <RejectIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Reject Dialog */}
            <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Reject Student{bulkRejectMode ? 's' : ''}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Rejection Remarks"
                        fullWidth
                        multiline
                        rows={4}
                        value={rejectRemarks}
                        onChange={(e) => setRejectRemarks(e.target.value)}
                        placeholder="Please provide reason for rejection..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleReject} variant="contained" color="error" disabled={loading}>
                        Confirm Rejection
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StudentApprovals;