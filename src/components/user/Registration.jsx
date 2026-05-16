import React, { useState, useMemo } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import {
  TextField,
  Typography,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Divider,
  Paper,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import GppGoodIcon from '@mui/icons-material/GppGood';
import SecurityIcon from '@mui/icons-material/Security';
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import PaymentIcon from "@mui/icons-material/Payment";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";

import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE_URL = "http://localhost:5000";

const PACKAGE_DETAILS = [
  { id: "basic", label: "Basic Makeup Course", price: 15000 },
  { id: "professional", label: "Professional Makeup Course", price: 35000 },
  { id: "advanced", label: "Advanced Makeup Course", price: 60000 },
  { id: "master", label: "Master Program", price: 100000 },
];

// Terms & Conditions Content
const TERMS_CONTENT = {
  introduction: "Welcome to Intense Beauty Academy. By registering for our courses, you agree to the following terms and conditions:",
  sections: [
    {
      title: "1. Course Enrollment",
      content: "Enrollment is confirmed only after successful payment and document verification. The academy reserves the right to accept or reject any application."
    },
    {
      title: "2. Fee Payment",
      content: "Course fees must be paid in full or as per the installment plan agreed upon. Late payments may incur additional charges. Fees once paid are non-refundable except as per academy policy."
    },
    {
      title: "3. Attendance Policy",
      content: "Minimum 75% attendance is required for certification. Absences beyond this may result in course extension with additional fees."
    },
    {
      title: "4. Code of Conduct",
      content: "Students must maintain professional behavior, respect academy property, and follow all safety guidelines during training."
    },
    {
      title: "5. Certification",
      content: "Certificates are awarded upon successful completion of all course requirements including exams, assignments, and attendance criteria."
    },
    {
      title: "6. Data Privacy",
      content: "Your personal information will be kept confidential and used only for academic and administrative purposes as per our privacy policy."
    },
    {
      title: "7. Refund Policy",
      content: "No refunds will be issued after 7 days of course commencement. Refund requests within 7 days are subject to administrative fees."
    },
    {
      title: "8. Academy Rights",
      content: "The academy reserves the right to modify course content, schedules, or terms with prior notice to enrolled students."
    }
  ]
};

// Section Title Component
const SectionTitle = ({ icon, title }) => (
  <Box
    sx={{
      position: "absolute",
      top: -15,
      left: 20,
      background: "#fff",
      px: 2,
      py: 0.3,
      border: "2px solid #ff6b6b",
      borderRadius: "20px",
      display: "flex",
      alignItems: "center",
      gap: 1,
      zIndex: 10,
    }}
  >
    {icon}
    <Typography sx={{ color: "#ff6b6b", fontWeight: 600, fontSize: "13px" }}>
      {title}
    </Typography>
  </Box>
);

const sectionStyle = {
  position: "relative",
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "35px 20px 20px",
  marginBottom: "30px",
  background: "#fff",
};

// Custom Date Field Component
const CustomDateField = ({ label, value, onChange, error, helperText, required = false }) => {
  return (
    <DatePicker
      label={label}
      value={value ? dayjs(value) : null}
      onChange={(newValue) => {
        onChange({
          target: {
            name: label === "Date of Birth" ? "dob" : "joinDate",
            value: newValue ? newValue.format('YYYY-MM-DD') : ''
          }
        });
      }}
      slotProps={{
        textField: {
          fullWidth: true,
          required: required,
          error: !!error,
          helperText: helperText,
          sx: {
            '& .MuiInputLabel-root': {
              backgroundColor: '#fff',
              px: 0.5,
              zIndex: 1
            },
            '& .MuiInputLabel-shrink': {
              transform: 'translate(14px, -9px) scale(0.75)',
              backgroundColor: '#fff',
              padding: '0 4px'
            }
          }
        }
      }}
    />
  );
};

const Registration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    dob: "",
    aadhar: "",
    presentAddress: "",
    permanentAddress: "",
    joinDate: "",
    package: "",
    paymentMethod: "",
    paidAmount: "",
    transactionId: "",
    contact: "",
    altContact: "",
    email: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [touched, setTouched] = useState({});

  // CALCULATE DUE AMOUNT
  const { packagePrice, dueAmount } = useMemo(() => {
    const selectedPkg = PACKAGE_DETAILS.find((p) => p.id === formData.package);
    const price = selectedPkg ? selectedPkg.price : 0;
    const paid = parseFloat(formData.paidAmount) || 0;
    return {
      packagePrice: price,
      dueAmount: price - paid,
    };
  }, [formData.package, formData.paidAmount]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear error for field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    
    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    // Validate single field on blur
    const fieldError = validateField(fieldName, formData[fieldName]);
    if (fieldError) {
      setErrors((prev) => ({ ...prev, [fieldName]: fieldError }));
    }
  };

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "fullName":
        return !value.trim() ? "Full name is required" : "";
      case "fatherName":
        return !value.trim() ? "Father's name is required" : "";
      case "dob":
        return !value ? "Date of birth is required" : "";
      case "aadhar":
        if (!value) return "Aadhar number is required";
        if (!/^\d{12}$/.test(value)) return "Aadhar number must be 12 digits";
        return "";
      case "presentAddress":
        return !value.trim() ? "Present address is required" : "";
      case "permanentAddress":
        return !value.trim() ? "Permanent address is required" : "";
      case "joinDate":
        return !value ? "Join date is required" : "";
      case "package":
        return !value ? "Please select a course package" : "";
      case "paymentMethod":
        return !value ? "Please select payment method" : "";
      case "paidAmount":
        if (!value) return "Please enter paid amount";
        if (parseFloat(value) > packagePrice) return "Paid amount cannot exceed package price";
        return "";
      case "transactionId":
        if (formData.paymentMethod === "upi" && !value) return "Transaction ID is required for UPI payment";
        return "";
      case "contact":
        if (!value) return "Contact number is required";
        if (!/^\d{10}$/.test(value)) return "Contact number must be 10 digits";
        return "";
      case "altContact":
        if (value && !/^\d{10}$/.test(value)) return "Alternate contact must be 10 digits";
        return "";
      case "email":
        if (!value) return "Email address is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address";
        return "";
      case "terms":
        return !value ? "You must accept Terms & Conditions" : "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = [
      "fullName", "fatherName", "dob", "aadhar", "presentAddress", 
      "permanentAddress", "joinDate", "package", "paymentMethod", 
      "paidAmount", "contact", "email", "terms"
    ];
    
    // Add transactionId validation if needed
    if (formData.paymentMethod === "upi") {
      fieldsToValidate.push("transactionId");
    }
    
    // Validate all fields
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    // Validate altContact if provided
    if (formData.altContact && !/^\d{10}$/.test(formData.altContact)) {
      newErrors.altContact = "Alternate contact must be 10 digits";
    }
    
    setErrors(newErrors);
    
    // Mark all fields as touched
    const allTouched = {};
    fieldsToValidate.forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
    
    return Object.keys(newErrors).length === 0;
  };

  const handleTermsAccept = () => {
    setFormData((prev) => ({ ...prev, terms: true }));
    setTermsDialogOpen(false);
    setErrors((prev) => ({ ...prev, terms: "" }));
    setTouched((prev) => ({ ...prev, terms: true }));
  };

  const handleTermsDecline = () => {
    setFormData((prev) => ({ ...prev, terms: false }));
    setTermsDialogOpen(false);
    setErrors((prev) => ({ ...prev, terms: "You must accept Terms & Conditions to register" }));
    setTouched((prev) => ({ ...prev, terms: true }));
  };

  const handleTermsClick = () => {
    setTermsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    const isValid = validateForm();
    
    if (!isValid) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      setStatus({ 
        type: "error", 
        msg: "Please fix all errors before submitting." 
      });
      return;
    }

    setLoading(true);
    setStatus({ type: "", msg: "" });

    try {
      const payload = {
        fullName: formData.fullName,
        fatherName: formData.fatherName,
        dob: formData.dob,
        aadhar: formData.aadhar,
        presentAddress: formData.presentAddress,
        permanentAddress: formData.permanentAddress,
        joinDate: formData.joinDate,
        package: formData.package,
        paymentMethod: formData.paymentMethod,
        paidAmount: formData.paidAmount,
        transactionId: formData.transactionId,
        contact: formData.contact,
        altContact: formData.altContact,
        email: formData.email,
        packagePrice,
        dueAmount,
        submittedAt: new Date().toISOString()
      };

      const response = await axios.post(`${API_BASE_URL}/api/register`, payload);

      if (response.data.success) {
        setStatus({ 
          type: "success", 
          msg: response.data.message || "Registration Successful! Login credentials sent to your email." 
        });
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            fullName: "", fatherName: "", dob: "", aadhar: "",
            presentAddress: "", permanentAddress: "", joinDate: "",
            package: "", paymentMethod: "", paidAmount: "",
            transactionId: "", contact: "", altContact: "",
            email: "", terms: false,
          });
          setErrors({});
          setTouched({});
        }, 3000);
      } else {
        setStatus({ 
          type: "error", 
          msg: response.data.message || "Registration failed" 
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setStatus({ 
        type: "error", 
        msg: error.response?.data?.message || "Connection failed. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper to show error if field is touched
  const showError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ background: "#f5f5f5", minHeight: "100vh", py: 5 }}>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} lg={10}>
              <Paper elevation={3} sx={{ p: { xs: 2, md: 5 }, borderRadius: "20px" }}>
                <Box textAlign="center" mb={5}>
                  <SchoolIcon sx={{ fontSize: 55, color: "#ff6b6b" }} />
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: "#ff6b6b", mt: 1 }}>
                    INTENSE BEAUTY ACADEMY
                  </Typography>
                  <Divider sx={{ width: 120, margin: "15px auto", borderColor: "#ff6b6b", borderWidth: 2 }} />
                </Box>

                {status.msg && (
                  <Alert 
                    severity={status.type} 
                    sx={{ mb: 3 }}
                    onClose={() => setStatus({ type: "", msg: "" })}
                  >
                    {status.msg}
                  </Alert>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  {/* 1. PERSONAL INFORMATION */}
                  <div style={sectionStyle}>
                    <SectionTitle icon={<PersonIcon sx={{ color: "#ff6b6b", fontSize: 18 }} />} title="Personal Information" />
                    <Row className="g-3">
                      <Col md={6}>
                        <TextField 
                          fullWidth 
                          label="Full Name *" 
                          name="fullName" 
                          value={formData.fullName} 
                          onChange={handleChange} 
                          onBlur={() => handleBlur("fullName")}
                          error={showError("fullName")} 
                          helperText={showError("fullName") && errors.fullName}
                          required
                          sx={{
                            '& .MuiInputLabel-root': { backgroundColor: '#fff', px: 0.5 },
                            '& .MuiInputLabel-shrink': { backgroundColor: '#fff', padding: '0 4px' }
                          }}
                        />
                      </Col>
                      <Col md={6}>
                        <TextField 
                          fullWidth 
                          label="Father's / Husband's Name *" 
                          name="fatherName" 
                          value={formData.fatherName} 
                          onChange={handleChange} 
                          onBlur={() => handleBlur("fatherName")}
                          error={showError("fatherName")} 
                          helperText={showError("fatherName") && errors.fatherName}
                          required
                          sx={{
                            '& .MuiInputLabel-root': { backgroundColor: '#fff', px: 0.5 },
                            '& .MuiInputLabel-shrink': { backgroundColor: '#fff', padding: '0 4px' }
                          }}
                        />
                      </Col>
                      <Col md={6}>
                        <CustomDateField
                          label="Date of Birth"
                          value={formData.dob}
                          onChange={handleChange}
                          error={showError("dob")}
                          helperText={showError("dob") && errors.dob}
                          required={true}
                        />
                      </Col>
                      <Col md={6}>
                        <TextField 
                          fullWidth 
                          label="Aadhar Number *" 
                          name="aadhar" 
                          value={formData.aadhar} 
                          onChange={handleChange} 
                          onBlur={() => handleBlur("aadhar")}
                          error={showError("aadhar")} 
                          helperText={showError("aadhar") && errors.aadhar}
                          inputProps={{ maxLength: 12 }}
                          required
                          sx={{
                            '& .MuiInputLabel-root': { backgroundColor: '#fff', px: 0.5 },
                            '& .MuiInputLabel-shrink': { backgroundColor: '#fff', padding: '0 4px' }
                          }}
                        />
                      </Col>
                    </Row>
                  </div>

                  {/* 2. ADDRESS INFORMATION */}
                  <div style={sectionStyle}>
                    <SectionTitle icon={<HomeIcon sx={{ color: "#ff6b6b", fontSize: 18 }} />} title="Address Information" />
                    <Row className="g-3">
                      <Col md={6}>
                        <TextField 
                          fullWidth 
                          multiline 
                          rows={2} 
                          label="Present Address *" 
                          name="presentAddress" 
                          value={formData.presentAddress} 
                          onChange={handleChange} 
                          onBlur={() => handleBlur("presentAddress")}
                          error={showError("presentAddress")} 
                          helperText={showError("presentAddress") && errors.presentAddress}
                          required
                          sx={{
                            '& .MuiInputLabel-root': { backgroundColor: '#fff', px: 0.5 },
                            '& .MuiInputLabel-shrink': { backgroundColor: '#fff', padding: '0 4px' }
                          }}
                        />
                      </Col>
                      <Col md={6}>
                        <TextField 
                          fullWidth 
                          multiline 
                          rows={2} 
                          label="Permanent Address *" 
                          name="permanentAddress" 
                          value={formData.permanentAddress} 
                          onChange={handleChange} 
                          onBlur={() => handleBlur("permanentAddress")}
                          error={showError("permanentAddress")} 
                          helperText={showError("permanentAddress") && errors.permanentAddress}
                          required
                          sx={{
                            '& .MuiInputLabel-root': { backgroundColor: '#fff', px: 0.5 },
                            '& .MuiInputLabel-shrink': { backgroundColor: '#fff', padding: '0 4px' }
                          }}
                        />
                      </Col>
                    </Row>
                  </div>

                  {/* 3. COURSE INFORMATION */}
                  <div style={sectionStyle}>
                    <SectionTitle icon={<WorkIcon sx={{ color: "#ff6b6b", fontSize: 18 }} />} title="Course Information" />
                    <Row className="g-3">
                      <Col md={6}>
                        <CustomDateField
                          label="Joining Date"
                          value={formData.joinDate}
                          onChange={handleChange}
                          error={showError("joinDate")}
                          helperText={showError("joinDate") && errors.joinDate}
                          required={true}
                        />
                      </Col>
                      <Col md={6}>
                        <FormControl fullWidth error={showError("package")} required>
                          <InputLabel sx={{ backgroundColor: '#fff', px: 0.5 }}>Package Details *</InputLabel>
                          <Select 
                            name="package" 
                            value={formData.package} 
                            onChange={handleChange} 
                            onBlur={() => handleBlur("package")}
                            label="Package Details *"
                          >
                            <MenuItem value="" disabled>Select a course package</MenuItem>
                            {PACKAGE_DETAILS.map(pkg => (
                              <MenuItem key={pkg.id} value={pkg.id}>
                                {pkg.label} - ₹{pkg.price.toLocaleString()}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>{showError("package") && errors.package}</FormHelperText>
                        </FormControl>
                      </Col>
                    </Row>
                  </div>

                  {/* 4. PAYMENT DETAILS */}
                  <div style={sectionStyle}>
                    <SectionTitle icon={<PaymentIcon sx={{ color: "#ff6b6b", fontSize: 18 }} />} title="Payment Details" />
                    <Row className="g-3">
                      <Col md={4}>
                        <TextField 
                          fullWidth 
                          label="Package Price" 
                          value={`₹${packagePrice.toLocaleString()}`} 
                          disabled 
                          variant="filled"
                        />
                      </Col>
                      <Col md={4}>
                        <TextField 
                          fullWidth 
                          label="Paid Amount *" 
                          name="paidAmount" 
                          type="number"
                          value={formData.paidAmount} 
                          onChange={handleChange} 
                          onBlur={() => handleBlur("paidAmount")}
                          error={showError("paidAmount")} 
                          helperText={showError("paidAmount") && errors.paidAmount}
                          inputProps={{ min: 0, max: packagePrice }}
                          required
                          sx={{
                            '& .MuiInputLabel-root': { backgroundColor: '#fff', px: 0.5 },
                            '& .MuiInputLabel-shrink': { backgroundColor: '#fff', padding: '0 4px' }
                          }}
                        />
                      </Col>
                      <Col md={4}>
                        <TextField 
                          fullWidth 
                          label="Due Amount" 
                          value={`₹${dueAmount.toLocaleString()}`} 
                          disabled 
                          variant="filled" 
                          sx={{ 
                            '& .MuiInputBase-input': { 
                              color: dueAmount > 0 ? '#f44336' : '#4caf50', 
                              fontWeight: 'bold' 
                            }
                          }}
                        />
                      </Col>
                      <Col md={6}>
                        <FormControl fullWidth error={showError("paymentMethod")} required>
                          <InputLabel sx={{ backgroundColor: '#fff', px: 0.5 }}>Payment Method *</InputLabel>
                          <Select 
                            name="paymentMethod" 
                            value={formData.paymentMethod} 
                            onChange={handleChange} 
                            onBlur={() => handleBlur("paymentMethod")}
                            label="Payment Method *"
                          >
                            <MenuItem value="" disabled>Select payment method</MenuItem>
                            <MenuItem value="upi">UPI / Online Transfer</MenuItem>
                            <MenuItem value="cash">Cash / Offline Payment</MenuItem>
                          </Select>
                          <FormHelperText>{showError("paymentMethod") && errors.paymentMethod}</FormHelperText>
                        </FormControl>
                      </Col>
                      {formData.paymentMethod === "upi" && (
                        <Col md={6}>
                          <TextField 
                            fullWidth 
                            label="Transaction ID *" 
                            name="transactionId" 
                            value={formData.transactionId} 
                            onChange={handleChange} 
                            onBlur={() => handleBlur("transactionId")}
                            error={showError("transactionId")} 
                            helperText={showError("transactionId") && errors.transactionId}
                            required
                            sx={{
                              '& .MuiInputLabel-root': { backgroundColor: '#fff', px: 0.5 },
                              '& .MuiInputLabel-shrink': { backgroundColor: '#fff', padding: '0 4px' }
                            }}
                          />
                        </Col>
                      )}
                    </Row>
                  </div>

                  {/* 5. CONTACT INFORMATION */}
                  <div style={sectionStyle}>
                    <SectionTitle icon={<ContactPhoneIcon sx={{ color: "#ff6b6b", fontSize: 18 }} />} title="Contact Information" />
                    <Row className="g-3">
                      <Col md={4}>
                        <TextField 
                          fullWidth 
                          label="Contact Number *" 
                          name="contact" 
                          value={formData.contact} 
                          onChange={handleChange} 
                          onBlur={() => handleBlur("contact")}
                          error={showError("contact")} 
                          helperText={showError("contact") && errors.contact}
                          inputProps={{ maxLength: 10 }}
                          required
                          sx={{
                            '& .MuiInputLabel-root': { backgroundColor: '#fff', px: 0.5 },
                            '& .MuiInputLabel-shrink': { backgroundColor: '#fff', padding: '0 4px' }
                          }}
                        />
                      </Col>
                      <Col md={4}>
                        <TextField 
                          fullWidth 
                          label="Alternate Contact" 
                          name="altContact" 
                          value={formData.altContact} 
                          onChange={handleChange} 
                          onBlur={() => handleBlur("altContact")}
                          error={showError("altContact")} 
                          helperText={showError("altContact") && errors.altContact}
                          inputProps={{ maxLength: 10 }}
                          sx={{
                            '& .MuiInputLabel-root': { backgroundColor: '#fff', px: 0.5 },
                            '& .MuiInputLabel-shrink': { backgroundColor: '#fff', padding: '0 4px' }
                          }}
                        />
                      </Col>
                      <Col md={4}>
                        <TextField 
                          fullWidth 
                          label="Email Address *" 
                          name="email" 
                          type="email"
                          value={formData.email} 
                          onChange={handleChange} 
                          onBlur={() => handleBlur("email")}
                          error={showError("email")} 
                          helperText={showError("email") && errors.email}
                          required
                          sx={{
                            '& .MuiInputLabel-root': { backgroundColor: '#fff', px: 0.5 },
                            '& .MuiInputLabel-shrink': { backgroundColor: '#fff', padding: '0 4px' }
                          }}
                        />
                      </Col>
                    </Row>
                  </div>

                  {/* Terms & Conditions */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                    <FormControlLabel 
                      control={
                        <Checkbox 
                          name="terms" 
                          checked={formData.terms} 
                          onChange={handleChange}
                          onBlur={() => handleBlur("terms")}
                          disabled={loading}
                        />
                      } 
                      label={
                        <Typography variant="body2">
                          I agree to the{' '}
                          <Button 
                            onClick={handleTermsClick}
                            sx={{ 
                              textTransform: 'none', 
                              p: 0, 
                              minWidth: 'auto',
                              color: '#ff6b6b',
                              fontWeight: 'bold',
                              '&:hover': { background: 'transparent', textDecoration: 'underline' }
                            }}
                          >
                            Terms & Conditions
                          </Button>
                        </Typography>
                      } 
                    />
                    {showError("terms") && (
                      <Typography color="error" variant="caption">
                        {errors.terms}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", gap: 2 }}>
                    <Button 
                      variant="outline-danger" 
                      onClick={() => {
                        setFormData({
                          fullName: "", fatherName: "", dob: "", aadhar: "",
                          presentAddress: "", permanentAddress: "", joinDate: "",
                          package: "", paymentMethod: "", paidAmount: "",
                          transactionId: "", contact: "", altContact: "",
                          email: "", terms: false,
                        });
                        setErrors({});
                        setTouched({});
                        setStatus({ type: "", msg: "" });
                      }}
                      disabled={loading}
                      style={{ padding: "10px 30px" }}
                    >
                      RESET
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={loading} 
                      style={{ 
                        background: "linear-gradient(45deg, #ff6b6b, #ff8e8e)", 
                        border: "none", 
                        minWidth: "180px",
                        padding: "10px 30px",
                        color: "white",
                        fontWeight: "bold"
                      }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : "REGISTER NOW"}
                    </Button>
                  </Box>
                </form>
              </Paper>
            </Col>
          </Row>
        </Container>

        {/* Terms & Conditions Dialog/Popup */}
        <Dialog 
          open={termsDialogOpen} 
          onClose={handleTermsDecline}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              maxHeight: '90vh'
            }
          }}
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PrivacyTipIcon />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Terms & Conditions
              </Typography>
            </Box>
            <IconButton onClick={handleTermsDecline} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent dividers sx={{ p: 3 }}>
            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              {TERMS_CONTENT.introduction}
            </Typography>
            
            <List>
              {TERMS_CONTENT.sections.map((section, index) => (
                <ListItem key={index} alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {index === 0 ? <GppGoodIcon color="primary" /> :
                     index === 1 ? <PaymentIcon color="primary" /> :
                     index === 7 ? <SecurityIcon color="primary" /> :
                     <CheckCircleIcon color="primary" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#ff6b6b' }}>
                        {section.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {section.content}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ 
              mt: 3, 
              p: 2, 
              bgcolor: '#fff3e0', 
              borderRadius: 2,
              borderLeft: '4px solid #ff6b6b'
            }}>
              <Typography variant="body2" color="text.secondary">
                <strong>📝 Note:</strong> By accepting these terms, you confirm that you have read, understood, and agree to abide by all the rules and regulations of Intense Beauty Academy.
              </Typography>
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button 
              onClick={handleTermsDecline}
              variant="outlined"
              color="error"
              sx={{ px: 4, py: 1 }}
            >
              Decline
            </Button>
            <Button 
              onClick={handleTermsAccept}
              variant="contained"
              sx={{ 
                px: 4, 
                py: 1,
                background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #ff5252, #ff6b6b)'
                }
              }}
            >
              Accept & Continue
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default Registration;