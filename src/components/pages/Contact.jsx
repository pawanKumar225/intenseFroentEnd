import React, { useState } from 'react';
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Snackbar,
  Alert,
  Card,
  CardContent,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MapIcon from '@mui/icons-material/Map';
import DirectionsIcon from '@mui/icons-material/Directions';

export default function Contact() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  // Validation
  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Full Name is required";
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Valid email is required";
    }
    if (!formData.phone) {
      tempErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      tempErrors.phone = "Valid 10-digit phone number is required";
    }
    if (!formData.message.trim()) tempErrors.message = "Message cannot be empty";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setTouched({
      name: true,
      email: true,
      phone: true,
      message: true
    });
    
    if (validate()) {
      setIsSubmitting(true);
      
      setTimeout(() => {
        console.log("Contact Form Data:", formData);
        setShowSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTouched({});
        setIsSubmitting(false);
      }, 1000);
    }
  };

  const showError = (field) => {
    return touched[field] && errors[field] ? errors[field] : '';
  };

  const contactInfo = [
    {
      icon: <LocationOnIcon sx={{ fontSize: 40, color: '#ff6b6b' }} />,
      title: "Our Location",
      details: "Plot No. 126C, Addagutta, JNTU, KPHB, Hyderabad, 500072",
      action: "Open in Maps",
      link: "https://maps.google.com/?q=Plot+No.+126C,+Addagutta,+JNTU,+KPHB,+Hyderabad"
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40, color: '#ff6b6b' }} />,
      title: "Call Us",
      details: "+91 9000161922",
      action: "Call Now",
      link: "tel:+919000161922"
    },
    {
      icon: <EmailIcon sx={{ fontSize: 40, color: '#ff6b6b' }} />,
      title: "Email Us",
      details: "intensebeautyacademy9@gmail.com",
      action: "Send Email",
      link: "mailto:intensebeautyacademy9@gmail.com"
    }
  ];

  return (
    <>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 6,
          mb: 4
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' }
            }}
          >
            Contact Us
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ opacity: 0.9, maxWidth: '600px', mx: 'auto' }}
          >
            Have questions? We'd love to hear from you. Get in touch with us and we'll respond as soon as possible.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4, mb: 6 }}>
        {/* Row 1: Location, Phone, Email in same row */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {contactInfo.map((info, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                  },
                  borderRadius: '15px'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 2 }}>{info.icon}</Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {info.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {info.details}
                  </Typography>
                  <Button
                    size="small"
                    href={info.link}
                    target="_blank"
                    sx={{
                      color: '#ff6b6b',
                      '&:hover': {
                        background: 'rgba(255, 107, 107, 0.1)'
                      }
                    }}
                  >
                    {info.action} →
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Row 2: Full Width Map */}
        <Box sx={{ width: '100%', mb: 5 }}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: '20px',
              overflow: 'hidden',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.01)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
              },
              width: '100%'
            }}
          >
            <Box sx={{ 
              position: 'relative', 
              width: '100%', 
              height: { xs: '300px', sm: '400px', md: '450px' } 
            }}>
              <iframe
                title="Intense Beauty Academy Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15225.242584460574!2d78.380158!3d17.487494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb8e6e8e8e8e8e%3A0x4e8e8e8e8e8e8e8e!2sKPHB%20Colony%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1699000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              
              {/* Map Overlay Buttons */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  right: 20,
                  background: 'white',
                  padding: { xs: '6px 12px', sm: '8px 16px' },
                  borderRadius: '30px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  display: 'flex',
                  gap: { xs: 1, sm: 2 },
                  backdropFilter: 'blur(0px)',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <Button
                  size={isMobile ? "small" : "medium"}
                  href="https://maps.google.com/?q=KPHB+Colony,+Hyderabad,+Telangana"
                  target="_blank"
                  startIcon={<MapIcon />}
                  sx={{
                    fontSize: { xs: '11px', sm: '13px' },
                    textTransform: 'none',
                    fontWeight: 'bold',
                    color: '#ff6b6b',
                    '&:hover': {
                      background: 'rgba(255, 107, 107, 0.1)'
                    }
                  }}
                >
                  Open in Maps
                </Button>
                <Button
                  size={isMobile ? "small" : "medium"}
                  href="https://www.google.com/maps/dir//KPHB+Colony,+Hyderabad,+Telangana"
                  target="_blank"
                  startIcon={<DirectionsIcon />}
                  sx={{
                    fontSize: { xs: '11px', sm: '13px' },
                    textTransform: 'none',
                    fontWeight: 'bold',
                    color: '#ff6b6b',
                    '&:hover': {
                      background: 'rgba(255, 107, 107, 0.1)'
                    }
                  }}
                >
                  Get Directions
                </Button>
              </Box>

              {/* Address Overlay on Desktop */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  background: 'rgba(255, 255, 255, 0.95)',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  display: { xs: 'none', sm: 'block' },
                  maxWidth: '250px'
                }}
              >
                <Box sx={{ fontSize: '12px', fontWeight: 'bold', color: '#333' }}>
                  📍 Intense Beauty Academy
                </Box>
                <Box sx={{ fontSize: '10px', color: '#666' }}>
                  Plot No. 126C, Addagutta, JNTU, KPHB, Hyderabad
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Row 3: Contact Form */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: '20px',
                p: { xs: 3, sm: 4, md: 5 },
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                align="center"
                sx={{
                  fontWeight: 'bold',
                  color: '#333',
                  mb: 3
                }}
              >
                Send Us a Message
              </Typography>
              <Typography
                variant="body1"
                align="center"
                color="textSecondary"
                sx={{ mb: 4 }}
              >
                Fill out the form below and we'll get back to you within 24 hours.
              </Typography>

              <form onSubmit={handleSubmit} noValidate>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Name *"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!showError('name')}
                      helperText={showError('name')}
                      placeholder="Enter your full name"
                      disabled={isSubmitting}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px'
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address *"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!showError('email')}
                      helperText={showError('email')}
                      placeholder="yourname@example.com"
                      disabled={isSubmitting}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px'
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number *"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!showError('phone')}
                      helperText={showError('phone')}
                      placeholder="9876543210"
                      inputProps={{ maxLength: 10 }}
                      disabled={isSubmitting}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px'
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      disabled={isSubmitting}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px'
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      label="Message *"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!showError('message')}
                      helperText={showError('message')}
                      placeholder="Please describe your query or message here..."
                      disabled={isSubmitting}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px'
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      type="submit"
                      size="large"
                      disabled={isSubmitting}
                      endIcon={!isSubmitting && <SendIcon />}
                      sx={{
                        py: 1.5,
                        fontWeight: 'bold',
                        fontSize: '16px',
                        background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
                        borderRadius: '10px',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #ff5252, #ff6b6b)'
                        },
                        '&.Mui-disabled': {
                          background: '#ccc'
                        }
                      }}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </form>

              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  <AccessTimeIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                  Business Hours: Monday - Saturday, 9:00 AM - 7:00 PM
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <IconButton
                    href="https://wa.me/919000161922"
                    target="_blank"
                    sx={{ color: '#25D366' }}
                  >
                    <WhatsAppIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Snackbar
          open={showSuccess}
          autoHideDuration={6000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setShowSuccess(false)}
            severity="success"
            sx={{
              width: '100%',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            ✅ Thank you! Your message has been sent successfully. We'll get back to you soon!
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}