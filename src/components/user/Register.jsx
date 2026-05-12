import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link as MuiLink,
  Alert,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import {
  Close as CloseIcon,
  Phone as PhoneIcon,
  AssignmentInd as AadharIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  FamilyRestroom as FamilyIcon,
  Email as EmailIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  ContactPhone as ContactIcon,
  Work as WorkIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const API_BASE_URL = 'http://localhost:5000';

const BeautyAcademyRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    dateOfBirth: null,
    aadharNumber: '',
    presentAddress: '',
    permanentAddress: '',
    dateOfJoin: null,
    packageDetails: '',
    contactNumber: '',
    altContactNumber: '',
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const packageOptions = [
    { value: 'basic_makeup', label: 'Basic Makeup Course - 1 Month (₹15,000)', duration: '1 Month', price: '₹15,000' },
    { value: 'pro_makeup', label: 'Professional Makeup Course - 3 Months (₹35,000)', duration: '3 Months', price: '₹35,000' },
    { value: 'advanced_makeup', label: 'Advanced Makeup & Hair - 6 Months (₹60,000)', duration: '6 Months', price: '₹60,000' },
    { value: 'master_program', label: 'Master Program - 12 Months (₹1,00,000)', duration: '12 Months', price: '₹1,00,000' },
    { value: 'bridal_makeup', label: 'Bridal Makeup Specialist - 2 Months (₹25,000)', duration: '2 Months', price: '₹25,000' },
    { value: 'airbrush_course', label: 'Airbrush Makeup Course - 1.5 Months (₹20,000)', duration: '1.5 Months', price: '₹20,000' }
  ];

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value?.trim()) return 'Full name is required';
        if (value.trim().length < 3) return 'Name must be at least 3 characters';
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'Name should only contain letters and spaces';
        return '';

      case 'fatherName':
        if (!value?.trim()) return "Father's/Husband's name is required";
        if (value.trim().length < 3) return 'Name must be at least 3 characters';
        return '';

      case 'dateOfBirth':
        if (!value) return 'Date of birth is required';
        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 16) return 'You must be at least 16 years old';
        if (age > 100) return 'Please enter a valid date of birth';
        return '';

      case 'aadharNumber':
        if (!value) return 'Aadhar number is required';
        if (!/^\d{12}$/.test(value)) return 'Aadhar number must be exactly 12 digits';
        return '';

      case 'presentAddress':
        if (!value?.trim()) return 'Present address is required';
        if (value.trim().length < 10) return 'Please enter complete address (minimum 10 characters)';
        return '';

      case 'permanentAddress':
        if (!value?.trim()) return 'Permanent address is required';
        if (value.trim().length < 10) return 'Please enter complete address (minimum 10 characters)';
        return '';

      case 'dateOfJoin':
        if (!value) return 'Date of joining is required';
        const joinDate = new Date(value);
        const currentDate = new Date();
        if (joinDate > currentDate) return 'Date of joining cannot be in the future';
        return '';

      case 'packageDetails':
        if (!value) return 'Please select a package';
        return '';

      case 'contactNumber':
        if (!value) return 'Contact number is required';
        if (!/^\d{10}$/.test(value)) return 'Contact number must be exactly 10 digits';
        return '';

      case 'altContactNumber':
        if (value && !/^\d{10}$/.test(value)) return 'Alternative number must be exactly 10 digits';
        return '';

      case 'email':
        if (!value) return 'Email address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleDateChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleDateBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const validateForm = () => {
    const newErrors = {};
    const allFields = ['name', 'fatherName', 'dateOfBirth', 'aadharNumber', 'presentAddress', 
                       'permanentAddress', 'dateOfJoin', 'packageDetails', 'contactNumber', 'email'];
    
    allFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    
    if (formData.altContactNumber) {
      const altError = validateField('altContactNumber', formData.altContactNumber);
      if (altError) newErrors.altContactNumber = altError;
    }
    
    if (!isTermsChecked) newErrors.terms = 'You must accept the terms and conditions';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const allFields = ['name', 'fatherName', 'dateOfBirth', 'aadharNumber', 'presentAddress', 
                       'permanentAddress', 'dateOfJoin', 'packageDetails', 'contactNumber', 'email'];
    const touchedFields = {};
    allFields.forEach(field => { touchedFields[field] = true; });
    setTouched(touchedFields);
    
    if (validateForm()) {
      setLoading(true);
      setRegistrationError('');
      
      try {
        const selectedPackage = packageOptions.find(pkg => pkg.value === formData.packageDetails);
        
        const registrationData = {
          ...formData,
          dateOfBirth: formData.dateOfBirth ? dayjs(formData.dateOfBirth).format('YYYY-MM-DD') : '',
          dateOfJoin: formData.dateOfJoin ? dayjs(formData.dateOfJoin).format('YYYY-MM-DD') : '',
          packageDetails: selectedPackage ? selectedPackage.label : formData.packageDetails,
          packageValue: formData.packageDetails,
          packagePrice: selectedPackage ? selectedPackage.price : '',
          packageDuration: selectedPackage ? selectedPackage.duration : ''
        };
        
        const response = await axios.post(`${API_BASE_URL}/api/register`, registrationData);
        
        if (response.data.success) {
          setRegistrationSuccess(true);
          setActiveStep(1);
          
          setTimeout(() => {
            resetForm();
            setActiveStep(0);
            setRegistrationSuccess(false);
          }, 3000);
        }
      } catch (error) {
        console.error('Registration error:', error);
        setRegistrationError(error.response?.data?.message || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', fatherName: '', dateOfBirth: null, aadharNumber: '', presentAddress: '',
      permanentAddress: '', dateOfJoin: null, packageDetails: '', contactNumber: '', altContactNumber: '', email: ''
    });
    setErrors({});
    setTouched({});
    setIsTermsChecked(false);
    setRegistrationSuccess(false);
    setRegistrationError('');
    setActiveStep(0);
  };

  const showError = (field) => touched[field] && errors[field] ? errors[field] : '';

  // Section Component for consistent styling
  const FormSection = ({ title, icon: Icon, children }) => (
    <Card
      elevation={0}
      sx={{
        mb: 4,
        border: '1px solid #e0e0e0',
        borderRadius: 3,
        overflow: 'visible',
        position: 'relative',
        backgroundColor: '#ffffff',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          borderColor: '#ff6b6b'
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -14,
          left: 20,
          backgroundColor: '#ffffff',
          px: 2,
          py: 0.5,
          borderRadius: 20,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          border: '1px solid #ff6b6b',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}
      >
        <Icon sx={{ color: '#ff6b6b', fontSize: 20 }} />
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 'bold',
            color: '#ff6b6b',
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
        >
          {title}
        </Typography>
      </Box>
      
      <CardContent sx={{ p: { xs: 2, sm: 3 }, mt: 2 }}>
        {children}
      </CardContent>
    </Card>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 5 }, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <Paper 
          elevation={3} 
          sx={{
            p: { xs: 2, sm: 3, md: 5 },
            borderRadius: { xs: 2, md: 4 },
            background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)'
          }}
        >
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 5 } }}>
            <SchoolIcon sx={{ fontSize: { xs: 50, md: 70 }, color: '#ff6b6b', mb: 2 }} />
            <Typography 
              variant="h4" 
              component="h1"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 1
              }}
            >
              INTENSE BEAUTY ACADEMY
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" sx={{ fontWeight: 500 }}>
              Candidate Registration Form
            </Typography>
            <Divider sx={{ mt: 3, maxWidth: '200px', mx: 'auto', borderColor: '#ff6b6b', borderWidth: 2 }} />
          </Box>

          {/* Stepper */}
          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              mb: { xs: 3, md: 5 }, 
              px: { xs: 1, sm: 2, md: 5 },
              '& .MuiStepLabel-label': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }
            }}
          >
            <Step><StepLabel>Registration Details</StepLabel></Step>
            <Step><StepLabel>Confirmation</StepLabel></Step>
          </Stepper>

          {/* Alerts */}
          {registrationSuccess && (
            <Alert 
              severity="success" 
              sx={{ mb: 3, borderRadius: 2 }}
              icon={<CheckCircleIcon />}
            >
              🎉 Registration successful! A confirmation email has been sent to your email address.
            </Alert>
          )}

          {registrationError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              ❌ {registrationError}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Section 1: Personal Information */}
            <FormSection title="Personal Information" icon={PersonIcon}>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name *"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!showError('name')}
                    helperText={showError('name')}
                    placeholder="Enter your full name"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color={showError('name') ? 'error' : 'primary'} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Father's / Husband's Name *"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!showError('fatherName')}
                    helperText={showError('fatherName')}
                    placeholder="Enter father's or husband's name"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FamilyIcon color={showError('fatherName') ? 'error' : 'primary'} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Date of Birth *"
                    value={formData.dateOfBirth}
                    onChange={(newValue) => handleDateChange('dateOfBirth', newValue)}
                    onClose={() => handleDateBlur('dateOfBirth')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!showError('dateOfBirth'),
                        helperText: showError('dateOfBirth'),
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarIcon color={showError('dateOfBirth') ? 'error' : 'primary'} />
                            </InputAdornment>
                          ),
                        }
                      }
                    }}
                    maxDate={dayjs()}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Aadhar Number *"
                    name="aadharNumber"
                    value={formData.aadharNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!showError('aadharNumber')}
                    helperText={showError('aadharNumber')}
                    inputProps={{ maxLength: 12 }}
                    placeholder="123456789012"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AadharIcon color={showError('aadharNumber') ? 'error' : 'primary'} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Section 2: Address Information */}
            <FormSection title="Address Information" icon={HomeIcon}>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Present Address *"
                    name="presentAddress"
                    value={formData.presentAddress}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!showError('presentAddress')}
                    helperText={showError('presentAddress')}
                    multiline
                    rows={2}
                    placeholder="House No., Street, City, State - PIN Code"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon color={showError('presentAddress') ? 'error' : 'primary'} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Permanent Address *"
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!showError('permanentAddress')}
                    helperText={showError('permanentAddress')}
                    multiline
                    rows={2}
                    placeholder="House No., Street, City, State - PIN Code"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon color={showError('permanentAddress') ? 'error' : 'primary'} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Section 3: Course Information */}
            <FormSection title="Course Information" icon={WorkIcon}>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Date of Joining *"
                    value={formData.dateOfJoin}
                    onChange={(newValue) => handleDateChange('dateOfJoin', newValue)}
                    onClose={() => handleDateBlur('dateOfJoin')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!showError('dateOfJoin'),
                        helperText: showError('dateOfJoin'),
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarIcon color={showError('dateOfJoin') ? 'error' : 'primary'} />
                            </InputAdornment>
                          ),
                        }
                      }
                    }}
                    maxDate={dayjs()}
                  />
                </Grid>
{/* <Grid size={{ xs: 12, md: 6 }}>
  <FormControl
    fullWidth
    error={!!showError('packageDetails')}
    sx={{
      minWidth: 250,
      '& .MuiSelect-select': {
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        display: 'flex',
        alignItems: 'center',
        minHeight: '24px',
      }
    }}
  >
    <InputLabel id="package-label">
      Package Details *
    </InputLabel>

    <Select
      labelId="package-label"
      id="packageDetails"
      name="packageDetails"
      value={formData.packageDetails}
      onChange={handleChange}
      onBlur={handleBlur}
      label="Package Details *"
      fullWidth
      displayEmpty
      renderValue={(selected) => {
        if (!selected) {
          return (
            <Typography sx={{ color: '#999' }}>
              Select a course package
            </Typography>
          );
        }

        const selectedPackage = packageOptions.find(
          (pkg) => pkg.value === selected
        );

        return selectedPackage?.label || '';
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            maxHeight: 300,
            width: 350,
          },
        },
      }}
    >
      <MenuItem disabled value="">
        Select a course package
      </MenuItem>

      {packageOptions.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          sx={{
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            py: 1.5,
          }}
        >
          {option.label}
        </MenuItem>
      ))}
    </Select>

    <FormHelperText>
      {showError('packageDetails')}
    </FormHelperText>
  </FormControl>
</Grid> */}
<FormControl
  fullWidth
  error={!!showError('packageDetails')}
  variant="outlined"
  sx={{
    minWidth: 250,
  }}
>
 

  <Select
    labelId="package-label"
    id="packageDetails"
    name="packageDetails"
    value={formData.packageDetails}
    onChange={handleChange}
    onBlur={handleBlur}
    displayEmpty
    fullWidth
    renderValue={(selected) => {
      if (!selected) {
        return (
          <Typography
            sx={{
              color: '#9e9e9e',
            }}
          >
            Select a course package
          </Typography>
        );
      }

      const selectedPackage = packageOptions.find(
        (pkg) => pkg.value === selected
      );

      return selectedPackage?.label || '';
    }}
    sx={{
      '& .MuiSelect-select': {
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        display: 'flex',
        alignItems: 'center',
        minHeight: '24px',
        py: 1.8,
      },
    }}
    MenuProps={{
      PaperProps: {
        sx: {
          maxHeight: 300,
          width: 350,
        },
      },
    }}
  >
    <MenuItem disabled value="">
      <em>Select a course package</em>
    </MenuItem>

    {packageOptions.map((option) => (
      <MenuItem
        key={option.value}
        value={option.value}
        sx={{
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          py: 1.5,
        }}
      >
        {option.label}
      </MenuItem>
    ))}
  </Select>

  <FormHelperText>
    {showError('packageDetails')}
  </FormHelperText>
</FormControl>
              </Grid>
            </FormSection>

            {/* Section 4: Contact Information */}
            <FormSection title="Contact Information" icon={ContactIcon}>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contact Number *"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!showError('contactNumber')}
                    helperText={showError('contactNumber')}
                    inputProps={{ maxLength: 10 }}
                    placeholder="9876543210"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color={showError('contactNumber') ? 'error' : 'primary'} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Alternative Contact Number (Optional)"
                    name="altContactNumber"
                    value={formData.altContactNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!showError('altContactNumber')}
                    helperText={showError('altContactNumber')}
                    inputProps={{ maxLength: 10 }}
                    placeholder="9876543210"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color={showError('altContactNumber') ? 'error' : 'primary'} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color={showError('email') ? 'error' : 'primary'} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Section 5: Terms & Conditions */}
            <Box sx={{ mb: 3 }}>
              <Card
                elevation={0}
                sx={{
                  border: isTermsChecked ? '1px solid #4caf50' : '1px solid #ff6b6b',
                  borderRadius: 3,
                  backgroundColor: isTermsChecked ? '#e8f5e9' : '#fff3cd'
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isTermsChecked}
                        onChange={(e) => setIsTermsChecked(e.target.checked)}
                        sx={{ 
                          color: '#ff6b6b', 
                          '&.Mui-checked': { color: '#4caf50' }
                        }}
                      />
                    }
                    label={
                      <Typography>
                        I have read and agree to the{' '}
                        <MuiLink
                          component="button"
                          type="button"
                          onClick={() => setTermsOpen(true)}
                          sx={{ color: '#ff6b6b', fontWeight: 'bold', textDecoration: 'underline' }}
                        >
                          Terms & Conditions
                        </MuiLink>
                        {' *'}
                      </Typography>
                    }
                  />
                  {errors.terms && (
                    <Typography variant="caption" color="error" sx={{ display: 'block', ml: 4, mt: 1 }}>
                      ❌ {errors.terms}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Box>

            {/* Buttons */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                mt: 3,
                pt: 3,
                borderTop: '2px solid #e0e0e0'
              }}
            >
              <Button
                type="button"
                variant="outlined"
                onClick={resetForm}
                startIcon={<CancelIcon />}
                sx={{
                  py: 1.2,
                  px: 4,
                  borderRadius: 3,
                  borderColor: '#ff6b6b',
                  color: '#ff6b6b',
                  fontWeight: 'bold',
                  '&:hover': {
                    borderColor: '#ff5252',
                    backgroundColor: '#ff6b6b10'
                  },
                  width: { xs: '100%', sm: 'auto' },
                  order: { xs: 2, sm: 1 }
                }}
              >
                Reset Form
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.2,
                  px: 6,
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #ff5252, #ff6b6b)'
                  },
                  width: { xs: '100%', sm: 'auto' },
                  order: { xs: 1, sm: 2 }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Register Now'}
              </Button>

              <Button
                component={Link}
                to="/user/login"
                sx={{
                  color: '#ff6b6b',
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: '#ff6b6b10' },
                  width: { xs: '100%', sm: 'auto' },
                  order: 3
                }}
              >
                ← Back to Login
              </Button>
            </Box>
          </form>

          {/* Terms Dialog */}
          <Dialog open={termsOpen} onClose={() => setTermsOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ bgcolor: '#ff6b6b', color: 'white' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Terms & Conditions</Typography>
                <IconButton onClick={() => setTermsOpen(false)} sx={{ color: 'white' }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ maxHeight: '60vh' }}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ color: '#ff6b6b', fontWeight: 'bold', mb: 1 }}>1. Admission Policy</Typography>
                <Typography paragraph>Admission is granted based on first-come, first-served basis. The academy reserves the right to refuse admission without assigning any reason.</Typography>

                <Typography variant="h6" sx={{ color: '#ff6b6b', fontWeight: 'bold', mb: 1, mt: 3 }}>2. Fees & Payment</Typography>
                <Typography paragraph>Course fees must be paid in full at the time of admission. Fees once paid are non-refundable and non-transferable.</Typography>

                <Typography variant="h6" sx={{ color: '#ff6b6b', fontWeight: 'bold', mb: 1, mt: 3 }}>3. Attendance Requirements</Typography>
                <Typography paragraph>Minimum 75% attendance is required for certification. Absence without prior intimation may lead to disqualification.</Typography>

                <Typography variant="h6" sx={{ color: '#ff6b6b', fontWeight: 'bold', mb: 1, mt: 3 }}>4. Code of Conduct</Typography>
                <Typography paragraph>Students must maintain professional conduct at all times. Any misconduct will result in immediate termination.</Typography>

                <Typography variant="h6" sx={{ color: '#ff6b6b', fontWeight: 'bold', mb: 1, mt: 3 }}>5. Certification</Typography>
                <Typography paragraph>Certificate awarded only after successful course completion and clearance of all dues.</Typography>

                <Typography variant="h6" sx={{ color: '#ff6b6b', fontWeight: 'bold', mb: 1, mt: 3 }}>6. Data Privacy</Typography>
                <Typography paragraph>Your personal information will be kept confidential as per our privacy policy.</Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button 
                onClick={() => setTermsOpen(false)} 
                variant="outlined" 
                sx={{ 
                  borderColor: '#ff6b6b', 
                  color: '#ff6b6b',
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Decline
              </Button>
              <Button 
                onClick={() => { setIsTermsChecked(true); setTermsOpen(false); }} 
                variant="contained" 
                sx={{ 
                  bgcolor: '#ff6b6b', 
                  '&:hover': { bgcolor: '#ff5252' },
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Accept Terms
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default BeautyAcademyRegistration;