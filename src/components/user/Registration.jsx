import React, { useState, useMemo } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
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
  CircularProgress
} from "@mui/material";

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

// SUB-COMPONENTS DEFINED OUTSIDE TO PREVENT FOCUS LOSS
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
    // Clear error for field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Required";
    if (!formData.fatherName.trim()) newErrors.fatherName = "Required";
    if (!formData.dob) newErrors.dob = "Required";
    if (!/^\d{12}$/.test(formData.aadhar)) newErrors.aadhar = "Must be 12 digits";
    if (!formData.presentAddress.trim()) newErrors.presentAddress = "Required";
    if (!formData.permanentAddress.trim()) newErrors.permanentAddress = "Required";
    if (!formData.joinDate) newErrors.joinDate = "Required";
    if (!formData.package) newErrors.package = "Select Package";
    if (!formData.paymentMethod) newErrors.paymentMethod = "Select Method";
    if (!formData.paidAmount) newErrors.paidAmount = "Required";
    if (formData.paymentMethod === "upi" && !formData.transactionId) newErrors.transactionId = "Required for UPI";
    if (!/^\d{10}$/.test(formData.contact)) newErrors.contact = "Must be 10 digits";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid Email";
    if (!formData.terms) newErrors.terms = "Accept Terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setStatus({ type: "", msg: "" });

    try {
      const payload = {
        ...formData,
        packagePrice,
        dueAmount,
        submittedAt: new Date().toISOString()
      };

      const response = await axios.post(`${API_BASE_URL}/api/register`, payload);

      if (response.data) {
        setStatus({ type: "success", msg: "Registration Successful!" });
        setFormData({
          fullName: "", fatherName: "", dob: "", aadhar: "",
          presentAddress: "", permanentAddress: "", joinDate: "",
          package: "", paymentMethod: "", paidAmount: "",
          transactionId: "", contact: "", altContact: "",
          email: "", terms: false,
        });
      }
    } catch (error) {
      setStatus({ type: "error", msg: error.response?.data?.message || "Connection Failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
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

              {status.msg && <Alert severity={status.type} sx={{ mb: 3 }}>{status.msg}</Alert>}

              <form onSubmit={handleSubmit}>
                {/* 1. PERSONAL */}
                <div style={sectionStyle}>
                  <SectionTitle icon={<PersonIcon sx={{ color: "#ff6b6b", fontSize: 18 }} />} title="Personal Information" />
                  <Row className="g-3">
                    <Col md={6}><TextField fullWidth label="Full Name *" name="fullName" value={formData.fullName} onChange={handleChange} error={!!errors.fullName} helperText={errors.fullName} /></Col>
                    <Col md={6}><TextField fullWidth label="Father's / Husband's Name *" name="fatherName" value={formData.fatherName} onChange={handleChange} error={!!errors.fatherName} helperText={errors.fatherName} /></Col>
                    <Col md={6}><TextField fullWidth type="date" label="DOB *" InputLabelProps={{ shrink: true }} name="dob" value={formData.dob} onChange={handleChange} error={!!errors.dob} helperText={errors.dob} /></Col>
                    <Col md={6}><TextField fullWidth label="Aadhar Number *" name="aadhar" value={formData.aadhar} onChange={handleChange} error={!!errors.aadhar} helperText={errors.aadhar} /></Col>
                  </Row>
                </div>

                {/* 2. ADDRESS */}
                <div style={sectionStyle}>
                  <SectionTitle icon={<HomeIcon sx={{ color: "#ff6b6b", fontSize: 18 }} />} title="Address Information" />
                  <Row className="g-3">
                    <Col md={6}><TextField fullWidth multiline rows={2} label="Present Address *" name="presentAddress" value={formData.presentAddress} onChange={handleChange} error={!!errors.presentAddress} helperText={errors.presentAddress} /></Col>
                    <Col md={6}><TextField fullWidth multiline rows={2} label="Permanent Address *" name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} error={!!errors.permanentAddress} helperText={errors.permanentAddress} /></Col>
                  </Row>
                </div>

                {/* 3. COURSE */}
                <div style={sectionStyle}>
                  <SectionTitle icon={<WorkIcon sx={{ color: "#ff6b6b", fontSize: 18 }} />} title="Course Information" />
                  <Row className="g-3">
                    <Col md={6}><TextField fullWidth type="date" label="Join Date *" InputLabelProps={{ shrink: true }} name="joinDate" value={formData.joinDate} onChange={handleChange} error={!!errors.joinDate} helperText={errors.joinDate} /></Col>
                    <Col md={6}>
                      <FormControl fullWidth error={!!errors.package}>
                        <InputLabel shrink>Package Details *</InputLabel>
                        <Select notched name="package" value={formData.package} onChange={handleChange} label="Package Details *">
                          {PACKAGE_DETAILS.map(pkg => <MenuItem key={pkg.id} value={pkg.id}>{pkg.label} - ₹{pkg.price.toLocaleString()}</MenuItem>)}
                        </Select>
                        <FormHelperText>{errors.package}</FormHelperText>
                      </FormControl>
                    </Col>
                  </Row>
                </div>

                {/* 4. PAYMENT */}
                <div style={sectionStyle}>
                  <SectionTitle icon={<PaymentIcon sx={{ color: "#ff6b6b", fontSize: 18 }} />} title="Payment Details" />
                  <Row className="g-3">
                    <Col md={4}><TextField fullWidth label="Package Price" value={`₹${packagePrice.toLocaleString()}`} disabled variant="filled" /></Col>
                    <Col md={4}><TextField fullWidth label="Paid Amount *" name="paidAmount" value={formData.paidAmount} onChange={handleChange} error={!!errors.paidAmount} helperText={errors.paidAmount} /></Col>
                    <Col md={4}><TextField fullWidth label="Due Amount" value={`₹${dueAmount.toLocaleString()}`} disabled variant="filled" sx={{ input: { color: dueAmount > 0 ? 'red' : 'green', fontWeight: 'bold' } }} /></Col>
                    <Col md={6}>
                      <FormControl fullWidth error={!!errors.paymentMethod}>
                        <InputLabel shrink>Payment Method</InputLabel>
                        <Select notched name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} label="Payment Method">
                          <MenuItem value="upi">UPI / Online</MenuItem>
                          <MenuItem value="cash">Cash / Offline</MenuItem>
                        </Select>
                      </FormControl>
                    </Col>
                    {formData.paymentMethod === "upi" && (
                      <Col md={6}><TextField fullWidth label="Transaction ID *" name="transactionId" value={formData.transactionId} onChange={handleChange} error={!!errors.transactionId} helperText={errors.transactionId} /></Col>
                    )}
                  </Row>
                </div>

                {/* 5. CONTACT */}
                <div style={sectionStyle}>
                  <SectionTitle icon={<ContactPhoneIcon sx={{ color: "#ff6b6b", fontSize: 18 }} />} title="Contact Information" />
                  <Row className="g-3">
                    <Col md={4}><TextField fullWidth label="Contact Number *" name="contact" value={formData.contact} onChange={handleChange} error={!!errors.contact} helperText={errors.contact} /></Col>
                    <Col md={4}><TextField fullWidth label="Alt Contact" name="altContact" value={formData.altContact} onChange={handleChange} /></Col>
                    <Col md={4}><TextField fullWidth label="Email Address *" name="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} /></Col>
                  </Row>
                </div>

                <FormControlLabel control={<Checkbox name="terms" checked={formData.terms} onChange={handleChange} />} label="I agree to Terms & Conditions" />
                {errors.terms && <Typography color="error" variant="caption" display="block">{errors.terms}</Typography>}

                <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                  <Button variant="outline-danger" onClick={() => window.location.reload()}>RESET</Button>
                  <Button type="submit" disabled={loading} style={{ background: "linear-gradient(45deg,#ff6b6b,#ff8e8e)", border: "none", minWidth: "150px" }}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : "REGISTER NOW"}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Col>
        </Row>
      </Container>
    </Box>
  );
};

export default Registration;