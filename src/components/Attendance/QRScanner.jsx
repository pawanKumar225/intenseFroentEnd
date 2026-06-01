import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { 
  Button, Dialog, DialogTitle, DialogContent, 
  Box, Alert, CircularProgress, Paper, Typography 
} from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const QRScanner = ({ employeeId, onSuccess, type }) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  // Fetch fresh QR code from backend
  const fetchQRCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/attendance/qr/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) {
        setQrCode(data.qrDataURL);
        // Auto-expire after 60 seconds
        setTimeout(() => {
          setQrCode(null);
          setError('QR code expired. Please generate a new one.');
        }, 60000);
      } else {
        setError('Failed to generate QR code');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  // Initialize scanner when dialog opens
  useEffect(() => {
    if (open && !qrCode && scannerRef.current && !html5QrCodeRef.current) {
      html5QrCodeRef.current = new Html5QrcodeScanner(
        "qr-reader-container",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          hideDeviceChangeButton: false,
        },
        false
      );

      html5QrCodeRef.current.render(onScanSuccess, onScanFailure);
    }

    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
      }
    };
  }, [open, qrCode]);

  const onScanSuccess = async (decodedText, decodedResult) => {
    if (scanning) return;
    setScanning(true);
    
    try {
      const response = await fetch('/api/attendance/qr/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          qrData: decodedText, 
          employeeId, 
          type 
        })
      });
      const data = await response.json();
      
      if (data.success) {
        onSuccess?.(data.attendance);
        setOpen(false);
        // Show success message
        alert(`${type === 'checkin' ? 'Check-in' : 'Check-out'} successful!`);
      } else {
        setError(data.error || 'Scan failed. Please try again.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
    
    setScanning(false);
    
    // Clear scanner after successful scan
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.clear();
      html5QrCodeRef.current = null;
    }
  };

  const onScanFailure = (error) => {
    // Don't show errors for normal scanning failures (like no QR found)
    if (!error.includes('No MultiFormat Readers')) {
      console.warn(`QR scan error: ${error}`);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
    setQrCode(null);
    setScanning(false);
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.clear();
      html5QrCodeRef.current = null;
    }
  };

  return (
    <>
      <Button 
        variant="contained" 
        startIcon={<QrCodeIcon />}
        onClick={() => {
          fetchQRCode();
          setOpen(true);
        }}
        sx={{ 
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          '&:hover': { background: 'linear-gradient(45deg, #FE6B8B 50%, #FF8E53 100%)' }
        }}
      >
        {type === 'checkin' ? 'Check In' : 'Check Out'} with QR
      </Button>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { minHeight: '500px' }
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {type === 'checkin' ? 'Scan QR Code to Check In' : 'Scan QR Code to Check Out'}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            {loading && <CircularProgress />}
            
            {qrCode && !loading && (
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6" gutterBottom>
                  Step 1: Show this QR code to scanner
                </Typography>
                <img src={qrCode} alt="QR Code" style={{ width: 200, height: 200, margin: 'auto' }} />
                <Alert severity="info" sx={{ mt: 2 }}>
                  This QR code expires in 60 seconds. Show it to the camera to scan.
                </Alert>
              </Paper>
            )}
            
            {!qrCode && !loading && (
              <Paper sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6" gutterBottom>
                  Step 2: Scan the QR code
                </Typography>
                <div id="qr-reader-container" ref={scannerRef} style={{ width: '100%' }}></div>
                <Alert severity="info" sx={{ mt: 2 }}>
                  Point your camera at the QR code displayed on the other device.
                </Alert>
              </Paper>
            )}
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QRScanner;