import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import DownloadIcon from '@mui/icons-material/Download';
import QRCode from 'qrcode';

const GenerateQRCode = () => {
  const [classData, setClassData] = useState({
    className: '',
    instructor: '',
    duration: '2 hours',
    date: new Date().toISOString().split('T')[0]
  });
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const generateQR = async () => {
    setLoading(true);
    try {
      const qrData = {
        classId: `CLASS_${Date.now()}`,
        className: classData.className,
        instructor: classData.instructor,
        date: classData.date,
        timestamp: new Date().toISOString()
      };
      
      const qrString = JSON.stringify(qrData);
      const qrUrl = await QRCode.toDataURL(qrString);
      setQrCodeUrl(qrUrl);
    } catch (err) {
      console.error('QR Generation Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.download = `attendance-qr-${classData.className}.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: '#84d816' }}>
        Generate Attendance QR Code
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <TextField
                fullWidth
                label="Class Name"
                value={classData.className}
                onChange={(e) => setClassData({...classData, className: e.target.value})}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Instructor Name"
                value={classData.instructor}
                onChange={(e) => setClassData({...classData, instructor: e.target.value})}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={classData.date}
                onChange={(e) => setClassData({...classData, date: e.target.value})}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={generateQR}
                disabled={!classData.className || !classData.instructor || loading}
                sx={{
                  mt: 3,
                  background: 'linear-gradient(90deg, #84b8e2, #84d816)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #73a4c9, #73c013)',
                  }
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Generate QR Code'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          {qrCodeUrl && (
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  QR Code for {classData.className}
                </Typography>
                <Box sx={{ p: 2 }}>
                  <img src={qrCodeUrl} alt="Attendance QR Code" style={{ width: '200px', height: '200px' }} />
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={downloadQR}
                  sx={{ mt: 2 }}
                >
                  Download QR Code
                </Button>
                <Alert severity="info" sx={{ mt: 2 }}>
                  Students can scan this QR code to mark their attendance
                </Alert>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default GenerateQRCode;