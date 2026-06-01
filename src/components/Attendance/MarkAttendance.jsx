import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Grid,
  Fade,
  Zoom,
  IconButton,
  Snackbar,
  Divider,
  Container
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CloseIcon from '@mui/icons-material/Close';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';

const MarkAttendance = ({ onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const scannerRef = useRef(null);

  const steps = ['Scan QR Code', 'Verify Details', 'Mark Attendance'];

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear scanner:", error);
        });
      }
    };
  }, []);

  const handleScan = async (scannedData) => {
    if (scannedData && !loading) {
      setScanResult(scannedData);
      if (scannerRef.current) {
        await scannerRef.current.clear();
        scannerRef.current = null;
      }
      setScanning(false);
      setActiveStep(1);
      
      try {
        const qrData = JSON.parse(scannedData);
        setAttendanceData(qrData);
      } catch (err) {
        setError('Invalid QR Code format');
        setOpenSnackbar(true);
      }
    }
  };

  const startScanning = () => {
    setScanning(true);
    setActiveStep(0);
    setError(null);
    setScanResult(null);
    
    setTimeout(() => {
      if (!scannerRef.current) {
        const scanner = new Html5QrcodeScanner(
          "qr-reader",
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true,
            rememberLastUsedCamera: true
          },
          false
        );
        
        scanner.render(
          (decodedText) => {
            handleScan(decodedText);
          },
          (errorMessage) => {
            console.log(errorMessage);
          }
        );
        
        scannerRef.current = scanner;
      }
    }, 100);
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      await scannerRef.current.clear();
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const submitAttendance = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('studentToken') || 'token';
      const userData = {
        userId: localStorage.getItem('userId') || 'user_001',
        userName: localStorage.getItem('userName') || 'Student',
        userRole: localStorage.getItem('userRole') || 'employee',
        userEmail: localStorage.getItem('userEmail') || 'student@example.com'
      };

      const attendancePayload = {
        qrData: scanResult,
        userData: userData,
        timestamp: new Date().toISOString(),
        attendanceData: attendanceData
      };

      const response = await axios.post(
        'http://localhost:5000/api/attendance/mark',
        attendancePayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess(true);
        setActiveStep(2);
        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const resetAttendance = async () => {
    await stopScanning();
    setActiveStep(0);
    setScanResult(null);
    setError(null);
    setSuccess(false);
    setAttendanceData(null);
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (success) {
    return (
      <Zoom in={true}>
        <Box textAlign="center" py={4}>
          <CheckCircleIcon sx={{ fontSize: 100, color: '#4caf50', mb: 2 }} />
          <Typography variant="h5" gutterBottom fontWeight="bold" color="#2e7d32">
            Attendance Marked Successfully!
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            {getCurrentDate()}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Time: {getCurrentTime()}
          </Typography>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              mt: 2,
              background: 'linear-gradient(90deg, #84b8e2, #84d816)',
              '&:hover': {
                background: 'linear-gradient(90deg, #73a4c9, #73c013)',
              }
            }}
          >
            Close
          </Button>
        </Box>
      </Zoom>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: '#333' }}>
          Mark Your Attendance
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Fade in={true}>
          <Box>
            {!scanning ? (
              <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardContent sx={{ textAlign: 'center', py: 5 }}>
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      margin: '0 auto',
                      background: 'linear-gradient(135deg, #84b8e2 0%, #84d816 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3
                    }}
                  >
                    <QrCodeScannerIcon sx={{ fontSize: 60, color: 'white' }} />
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: '#333' }}>
                    Ready to Scan?
                  </Typography>
                  <Typography variant="body1" color="textSecondary" sx={{ mb: 3, px: 4 }}>
                    Position the QR code within the camera frame to mark your attendance
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={startScanning}
                    startIcon={<CameraAltIcon />}
                    size="large"
                    sx={{
                      background: 'linear-gradient(90deg, #84b8e2, #84d816)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #73a4c9, #73c013)',
                      },
                      px: 4,
                      py: 1
                    }}
                  >
                    Start Scanning
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ position: 'relative', bgcolor: '#000', minHeight: 400 }}>
                    <div id="qr-reader" style={{ width: '100%' }}></div>
                  </Box>
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <CircularProgress size={30} sx={{ color: '#84d816', mr: 2 }} />
                    <Typography variant="body2" color="textSecondary">
                      Scanning QR Code...
                    </Typography>
                    <Button
                      onClick={stopScanning}
                      sx={{ mt: 2, color: '#f44336', display: 'block', mx: 'auto' }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        </Fade>
      )}

      {activeStep === 1 && attendanceData && (
        <Fade in={true}>
          <Box>
            <Card elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: '#84d816', mb: 3 }}>
                  Verify Your Attendance Details
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <EventNoteIcon sx={{ color: '#84d816' }} />
                        <Typography variant="body2" color="textSecondary">Date</Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="bold">
                        {getCurrentDate()}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <AccessTimeIcon sx={{ color: '#84d816' }} />
                        <Typography variant="body2" color="textSecondary">Time</Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="bold">
                        {getCurrentTime()}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Class Information
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color="#2e7d32" gutterBottom>
                        {attendanceData.className || 'Beauty Course Session'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Instructor: {attendanceData.instructor || 'Staff'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Class ID: {attendanceData.classId || 'N/A'}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Student Information
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {localStorage.getItem('userName') || 'Student'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Role: {localStorage.getItem('userRole') || 'Employee'}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Box display="flex" justifyContent="space-between" gap={2}>
              <Button
                variant="outlined"
                onClick={resetAttendance}
                sx={{
                  borderColor: '#f44336',
                  color: '#f44336',
                  '&:hover': {
                    borderColor: '#d32f2f',
                    backgroundColor: '#ffebee'
                  }
                }}
              >
                Scan Again
              </Button>
              <Button
                variant="contained"
                onClick={submitAttendance}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(90deg, #84b8e2, #84d816)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #73a4c9, #73c013)',
                  },
                  flex: 1
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Confirm & Mark Attendance'}
              </Button>
            </Box>
          </Box>
        </Fade>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MarkAttendance;