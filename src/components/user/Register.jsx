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
  Stack
} from '@mui/material';
import {
  Close as CloseIcon,
  Phone as PhoneIcon,
  AssignmentInd as AadharIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  FamilyRestroom as FamilyIcon,
  WorkspacePremium as PackageIcon,
  Email as EmailIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link } from 'react-router-dom';
const BeautyAcademyRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    dateOfBirth: '',
    aadharNumber: '',
    presentAddress: '',
    permanentAddress: '',
    dateOfJoin: '',
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
  const [activeStep, setActiveStep] = useState(0);

  // Package options
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
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 3) return 'Name must be at least 3 characters';
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'Name should only contain letters and spaces';
        return '';

      case 'fatherName':
        if (!value.trim()) return "Father's/Husband's name is required";
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
        if (!value.trim()) return 'Present address is required';
        if (value.trim().length < 10) return 'Please enter complete address (minimum 10 characters)';
        return '';

      case 'permanentAddress':
        if (!value.trim()) return 'Permanent address is required';
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
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address (e.g., name@example.com)';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const allFields = ['name', 'fatherName', 'dateOfBirth', 'aadharNumber', 'presentAddress', 
                       'permanentAddress', 'dateOfJoin', 'packageDetails', 'contactNumber', 'email'];
    
    allFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    if (formData.altContactNumber) {
      const altError = validateField('altContactNumber', formData.altContactNumber);
      if (altError) {
        newErrors.altContactNumber = altError;
      }
    }
    
    if (!isTermsChecked) {
      newErrors.terms = 'You must accept the terms and conditions to register';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const allFields = ['name', 'fatherName', 'dateOfBirth', 'aadharNumber', 'presentAddress', 
                       'permanentAddress', 'dateOfJoin', 'packageDetails', 'contactNumber', 'email'];
    const touchedFields = {};
    allFields.forEach(field => {
      touchedFields[field] = true;
    });
    setTouched(touchedFields);
    
    if (validateForm()) {
      setRegistrationSuccess(true);
      setActiveStep(1);
      
      const selectedPackage = packageOptions.find(pkg => pkg.value === formData.packageDetails);
      const registrationData = {
        ...formData,
        packageDetails: selectedPackage ? selectedPackage.label : formData.packageDetails
      };
      
      console.log('Form Data:', registrationData);
      
      setTimeout(() => {
        setRegistrationSuccess(false);
        resetForm();
        setActiveStep(0);
      }, 3000);
    } else {
      const firstError = document.querySelector('.error-field');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      fatherName: '',
      dateOfBirth: '',
      aadharNumber: '',
      presentAddress: '',
      permanentAddress: '',
      dateOfJoin: '',
      packageDetails: '',
      contactNumber: '',
      altContactNumber: '',
      email: ''
    });
    setErrors({});
    setTouched({});
    setIsTermsChecked(false);
    setRegistrationSuccess(false);
    setActiveStep(0);
    
    alert('Form has been reset successfully!');
  };

  const handleTermsOpen = () => {
    setTermsOpen(true);
  };

  const handleTermsClose = () => {
    setTermsOpen(false);
  };

  const handleTermsAccept = () => {
    setIsTermsChecked(true);
    setTermsOpen(false);
    if (errors.terms) {
      setErrors(prev => ({
        ...prev,
        terms: ''
      }));
    }
  };

  const showError = (field) => {
    return touched[field] && errors[field] ? errors[field] : '';
  };

  return (
    <Container maxWidth="lg" className="py-5">
      <Paper 
        elevation={3} 
        className="p-4 p-md-5"
        sx={{
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
        }}
      >
        {/* Logo Header */}
        <Box className="text-center mb-4">
          <div className="logo-container mb-3">
            <img 
              src="/logo.png" 
              alt="Intense Beauty Academy Logo"
              style={{ 
                maxWidth: '180px', 
                height: 'auto',
                borderRadius: '10px'
              }}
            />
          </div>
          <Typography 
            variant="h4" 
            component="h1" 
            className="mt-3" 
            gutterBottom
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
          >
            INTENSE BEAUTY ACADEMY
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" sx={{ fontWeight: '500' }}>
            Candidate Registration Form
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} className="mb-4">
          <Step>
            <StepLabel>Registration Details</StepLabel>
          </Step>
          <Step>
            <StepLabel>Confirmation</StepLabel>
          </Step>
        </Stepper>

        {registrationSuccess && (
          <Alert severity="success" className="mb-4" sx={{ borderRadius: '10px' }}>
            🎉 Registration successful! Welcome to Intense Beauty Academy!
          </Alert>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {/* Row 1: Name and Father Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!showError('name')}
                helperText={showError('name')}
                required
                className={showError('name') ? 'error-field' : ''}
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
                label="Father's / Husband's Name"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!showError('fatherName')}
                helperText={showError('fatherName')}
                required
                className={showError('fatherName') ? 'error-field' : ''}
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

            {/* Row 2: Date of Birth and Aadhar Number - Fixed placeholder issue */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!showError('dateOfBirth')}
                helperText={showError('dateOfBirth')}
                required
                className={showError('dateOfBirth') ? 'error-field' : ''}
                InputLabelProps={{ 
                  shrink: true,
                  style: { backgroundColor: 'white', padding: '0 4px' }
                }}
                inputProps={{
                  placeholder: ''
                }}
                sx={{
                  '& input[type="date"]::-webkit-calendar-picker-indicator': {
                    cursor: 'pointer',
                    marginLeft: 'auto'
                  },
                  '& input[type="date"]::before': {
                    content: '""',
                    display: 'none'
                  }
                }}
              />
              <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block', ml: 1 }}>
                <CalendarIcon sx={{ fontSize: '12px', mr: 0.5 }} />
                Select your date of birth
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Aadhar Number"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!showError('aadharNumber')}
                helperText={showError('aadharNumber')}
                required
                className={showError('aadharNumber') ? 'error-field' : ''}
                inputProps={{ maxLength: 12 }}
                placeholder="1234 5678 9012"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AadharIcon color={showError('aadharNumber') ? 'error' : 'primary'} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Row 3: Present Address */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Present Address"
                name="presentAddress"
                value={formData.presentAddress}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!showError('presentAddress')}
                helperText={showError('presentAddress')}
                required
                className={showError('presentAddress') ? 'error-field' : ''}
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

            {/* Row 4: Permanent Address */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Permanent Address"
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!showError('permanentAddress')}
                helperText={showError('permanentAddress')}
                required
                className={showError('permanentAddress') ? 'error-field' : ''}
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

            {/* Row 5: Date of Joining and Package Details - Fixed placeholder and increased width */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                name="dateOfJoin"
                value={formData.dateOfJoin}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!showError('dateOfJoin')}
                helperText={showError('dateOfJoin')}
                required
                className={showError('dateOfJoin') ? 'error-field' : ''}
                InputLabelProps={{ 
                  shrink: true,
                  style: { backgroundColor: 'white', padding: '0 4px' }
                }}
                inputProps={{
                  placeholder: ''
                }}
                sx={{
                  '& input[type="date"]::-webkit-calendar-picker-indicator': {
                    cursor: 'pointer',
                    marginLeft: 'auto'
                  }
                }}
              />
              <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block', ml: 1 }}>
                <CalendarIcon sx={{ fontSize: '12px', mr: 0.5 }} />
                Select your joining date
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!showError('packageDetails')} required sx={{ minWidth: '100%' }}>
                <InputLabel id="package-label">Package Details</InputLabel>
                <Select
                  fullWidth
                  labelId="package-label"
                  name="packageDetails"
                  value={formData.packageDetails}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Package Details"
                  className={showError('packageDetails') ? 'error-field' : ''}
                  sx={{
                    '& .MuiSelect-select': {
                      whiteSpace: 'normal',
                      wordWrap: 'break-word',
                      padding: '16px 14px'
                    }
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>Select a course package</em>
                  </MenuItem>
                  {packageOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value} sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {showError('packageDetails') && (
                  <FormHelperText>{showError('packageDetails')}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Row 6: Contact Number and Alternative Contact Number */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!showError('contactNumber')}
                helperText={showError('contactNumber')}
                required
                className={showError('contactNumber') ? 'error-field' : ''}
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
                label="Alternative Contact Number"
                name="altContactNumber"
                value={formData.altContactNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!showError('altContactNumber')}
                helperText={showError('altContactNumber')}
                className={showError('altContactNumber') ? 'error-field' : ''}
                inputProps={{ maxLength: 10 }}
                placeholder="9876543210 (Optional)"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color={showError('altContactNumber') ? 'error' : 'primary'} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Row 7: Email Address */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!showError('email')}
                helperText={showError('email')}
                required
                className={showError('email') ? 'error-field' : ''}
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

            {/* Row 8: Terms and Conditions */}
            <Grid item xs={12}>
              <Box className="terms-section">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isTermsChecked}
                      onChange={(e) => {
                        setIsTermsChecked(e.target.checked);
                        if (errors.terms) {
                          setErrors(prev => ({
                            ...prev,
                            terms: ''
                          }));
                        }
                      }}
                      color="primary"
                    />
                  }
                  label={
                    <Typography>
                      I have read and agree to the{' '}
                      <MuiLink
                        component="button"
                        type="button"
                        onClick={handleTermsOpen}
                        underline="hover"
                        sx={{ fontWeight: 'bold', color: '#ff6b6b' }}
                      >
                        Terms & Conditions
                      </MuiLink>
                      {' *'}
                    </Typography>
                  }
                />
                {errors.terms && (
                  <Typography variant="caption" color="error" className="d-block mt-1" sx={{ display: 'block', ml: 2 }}>
                    ❌ {errors.terms}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Row 9: Register and Cancel Buttons */}
            {/* <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  size="large"
                  onClick={resetForm}
                  startIcon={<CancelIcon />}
                  sx={{
                    padding: '12px 24px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderRadius: '10px',
                    borderWidth: '2px',
                    '&:hover': {
                      borderWidth: '2px',
                    }
                  }}
                >
                  Cancel / Reset
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    padding: '12px 48px',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #ff5252, #ff6b6b)',
                    },
                    borderRadius: '10px'
                  }}
                >
                  Register Now
                </Button>

                <Typography variant="body1" color="textSecondary">
                                 <Link to="/user" style={{ color: '#e91e63', fontWeight: 'bold', textDecoration: 'none', marginBottom: '80px' }}>
                          Back
                           </Link>
                               </Typography>
              </Stack>
            </Grid> */}


            <Grid item xs={12}>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 2,
      mt: 2
    }}
  >

    {/* LEFT - Cancel */}
    <Button
      type="button"
      variant="outlined"
      color="secondary"
      size="large"
      onClick={resetForm}
      startIcon={<CancelIcon />}
      sx={{
        padding: "12px 24px",
        fontWeight: "bold",
        fontSize: "16px",
        borderRadius: "30px",
        borderWidth: "2px"
      }}
    >
      Cancel / Reset
    </Button>

    {/* CENTER - Register */}
    <Button
      type="submit"
      variant="contained"
      size="large"
      sx={{
        padding: "12px 48px",
        fontWeight: "bold",
        fontSize: "18px",
        background: "linear-gradient(45deg, #ff6b6b, #ff8e8e)",
        borderRadius: "30px",
        "&:hover": {
          background: "linear-gradient(45deg, #ff5252, #ff6b6b)"
        }
      }}
    >
      Register Now
    </Button>

    {/* RIGHT - Back */}
    <Typography>
      <Link
        to="/user"
        style={{
          color: "#e91e63",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        ← Back
      </Link>
    </Typography>

  </Box>
</Grid>
          </Grid>
        </form>

        {/* Terms & Conditions Popup */}
        <Dialog
          open={termsOpen}
          onClose={handleTermsClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '15px'
            }
          }}
        >
          <DialogTitle sx={{ background: '#ff6b6b', color: 'white' }}>
            <Box className="d-flex justify-content-between align-items-center">
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Terms & Conditions
              </Typography>
              <IconButton onClick={handleTermsClose} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box className="terms-content" sx={{ padding: '10px' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                1. Admission Policy
              </Typography>
              <Typography paragraph>
                Admission is granted based on first-come, first-served basis. The academy reserves the right to 
                refuse admission without assigning any reason.
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ color: '#ff6b6b', fontWeight: 'bold', marginTop: '20px' }}>
                2. Fees & Payment
              </Typography>
              <Typography paragraph>
                Course fees must be paid in full at the time of admission. Fees once paid are non-refundable 
                and non-transferable under any circumstances.
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ color: '#ff6b6b', fontWeight: 'bold', marginTop: '20px' }}>
                3. Attendance Requirements
              </Typography>
              <Typography paragraph>
                Minimum 75% attendance is required to be eligible for certification. Absence without prior 
                intimation may lead to disqualification.
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ color: '#ff6b6b', fontWeight: 'bold', marginTop: '20px' }}>
                4. Code of Conduct
              </Typography>
              <Typography paragraph>
                Students must maintain professional conduct at all times. Any form of harassment, discrimination, 
                or misconduct will result in immediate termination of enrollment.
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ color: '#ff6b6b', fontWeight: 'bold', marginTop: '20px' }}>
                5. Certification
              </Typography>
              <Typography paragraph>
                Certificate will be awarded only after successful completion of the course and clearance of all 
                dues. The academy's decision regarding certification is final.
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ color: '#ff6b6b', fontWeight: 'bold', marginTop: '20px' }}>
                6. Data Privacy
              </Typography>
              <Typography paragraph>
                Your personal information will be kept confidential and used only for academic and administrative 
                purposes as per our privacy policy.
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ color: '#ff6b6b', fontWeight: 'bold', marginTop: '20px' }}>
                7. Amendment of Terms
              </Typography>
              <Typography paragraph>
                The academy reserves the right to modify these terms & conditions at any time. Students will be 
                notified of any significant changes.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ padding: '20px' }}>
            <Button onClick={handleTermsClose} color="secondary" variant="outlined">
              Decline
            </Button>
            <Button onClick={handleTermsAccept} color="primary" variant="contained" sx={{ background: '#ff6b6b' }}>
              Accept Terms & Continue
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default BeautyAcademyRegistration;