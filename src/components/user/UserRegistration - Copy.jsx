// Registration.jsx

import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";

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
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import PaymentIcon from "@mui/icons-material/Payment";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";

import "bootstrap/dist/css/bootstrap.min.css";

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
  const [success, setSuccess] = useState(false);

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =========================
  // VALIDATION
  // =========================

  const validate = () => {
    let newErrors = {};

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.fullName)) {
      newErrors.fullName = "Only letters allowed";
    }

    // Father Name
    if (!formData.fatherName.trim()) {
      newErrors.fatherName = "Father/Husband Name is required";
    }

    // DOB
    if (!formData.dob) {
      newErrors.dob = "Date of Birth is required";
    }

    // Aadhar
    if (!formData.aadhar) {
      newErrors.aadhar = "Aadhar Number is required";
    } else if (!/^\d{12}$/.test(formData.aadhar)) {
      newErrors.aadhar = "Aadhar must be 12 digits";
    }

    // Address
    if (!formData.presentAddress.trim()) {
      newErrors.presentAddress = "Present Address required";
    }

    if (!formData.permanentAddress.trim()) {
      newErrors.permanentAddress = "Permanent Address required";
    }

    // Joining Date
    if (!formData.joinDate) {
      newErrors.joinDate = "Joining Date required";
    }

    // Package
    if (!formData.package) {
      newErrors.package = "Select Package";
    }

    // Payment Method
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Select Payment Method";
    }

    // Paid Amount
    if (!formData.paidAmount) {
      newErrors.paidAmount = "Paid Amount required";
    }

    // Transaction ID
    if (
      formData.paymentMethod === "upi" &&
      !formData.transactionId
    ) {
      newErrors.transactionId = "Transaction ID required";
    }

    // Contact
    if (!formData.contact) {
      newErrors.contact = "Contact Number required";
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = "Enter valid 10 digit number";
    }

    // Alt Contact
    if (
      formData.altContact &&
      !/^\d{10}$/.test(formData.altContact)
    ) {
      newErrors.altContact = "Enter valid 10 digit number";
    }

    // Email
    if (!formData.email) {
      newErrors.email = "Email required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Invalid email";
    }

    // Terms
    if (!formData.terms) {
      newErrors.terms = "Accept Terms & Conditions";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      console.log(formData);

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);

      // RESET FORM
      setFormData({
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
    }
  };

  // =========================
  // SECTION TITLE
  // =========================

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
      }}
    >
      {icon}

      <Typography
        sx={{
          color: "#ff6b6b",
          fontWeight: 600,
          fontSize: "13px",
        }}
      >
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

  return (
    <Box
      sx={{
        background: "#f5f5f5",
        minHeight: "100vh",
        py: 5,
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} lg={10}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, md: 5 },
                borderRadius: "20px",
              }}
            >
              {/* HEADER */}

              <Box textAlign="center" mb={5}>
                <SchoolIcon
                  sx={{
                    fontSize: 55,
                    color: "#ff6b6b",
                  }}
                />

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: "#ff6b6b",
                    mt: 1,
                  }}
                >
                  INTENSE BEAUTY ACADEMY
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#777",
                  }}
                >
                  Candidate Registration Form
                </Typography>

                <Divider
                  sx={{
                    width: 120,
                    margin: "15px auto",
                    borderColor: "#ff6b6b",
                    borderWidth: 2,
                  }}
                />
              </Box>

              {/* SUCCESS */}

              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Registration Submitted Successfully
                </Alert>
              )}

              {/* FORM */}

              <form onSubmit={handleSubmit}>
                {/* PERSONAL */}

                <div style={sectionStyle}>
                  <SectionTitle
                    icon={
                      <PersonIcon
                        sx={{
                          color: "#ff6b6b",
                          fontSize: 18,
                        }}
                      />
                    }
                    title="Personal Information"
                  />

                  <Row className="g-3">
                    <Col md={6}>
                      <TextField
                        fullWidth
                        label="Full Name *"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                      />
                    </Col>

                    <Col md={6}>
                      <TextField
                        fullWidth
                        label="Father's / Husband's Name *"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        error={!!errors.fatherName}
                        helperText={errors.fatherName}
                      />
                    </Col>

                    <Col md={6}>
                      <Typography mb={1}>
                        Date of Birth *
                      </Typography>

                      <TextField
                        fullWidth
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        error={!!errors.dob}
                        helperText={errors.dob}
                      />
                    </Col>

                    <Col md={6}>
                      <TextField
                        fullWidth
                        label="Aadhar Number *"
                        name="aadhar"
                        value={formData.aadhar}
                        onChange={handleChange}
                        error={!!errors.aadhar}
                        helperText={errors.aadhar}
                      />
                    </Col>
                  </Row>
                </div>

                {/* ADDRESS */}

                <div style={sectionStyle}>
                  <SectionTitle
                    icon={
                      <HomeIcon
                        sx={{
                          color: "#ff6b6b",
                          fontSize: 18,
                        }}
                      />
                    }
                    title="Address Information"
                  />

                  <Row className="g-3">
                    <Col md={6}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Present Address *"
                        name="presentAddress"
                        value={formData.presentAddress}
                        onChange={handleChange}
                        error={!!errors.presentAddress}
                        helperText={errors.presentAddress}
                      />
                    </Col>

                    <Col md={6}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Permanent Address *"
                        name="permanentAddress"
                        value={formData.permanentAddress}
                        onChange={handleChange}
                        error={!!errors.permanentAddress}
                        helperText={errors.permanentAddress}
                      />
                    </Col>
                  </Row>
                </div>

                {/* COURSE */}

                <div style={sectionStyle}>
                  <SectionTitle
                    icon={
                      <WorkIcon
                        sx={{
                          color: "#ff6b6b",
                          fontSize: 18,
                        }}
                      />
                    }
                    title="Course Information"
                  />

                  <Row className="g-3">
                    <Col md={6}>
                      <Typography mb={1}>
                        Date of Joining *
                      </Typography>

                      <TextField
                        fullWidth
                        type="date"
                        name="joinDate"
                        value={formData.joinDate}
                        onChange={handleChange}
                        error={!!errors.joinDate}
                        helperText={errors.joinDate}
                      />
                    </Col>

                    <Col md={6}>
                      <FormControl
                        fullWidth
                        error={!!errors.package}
                      >
                        <InputLabel>
                          Package Details *
                        </InputLabel>

                        <Select
                          name="package"
                          value={formData.package}
                          onChange={handleChange}
                          label="Package Details *"
                        >
                          <MenuItem value="basic">
                            Basic Makeup Course - ₹15,000
                          </MenuItem>

                          <MenuItem value="professional">
                            Professional Makeup Course - ₹35,000
                          </MenuItem>

                          <MenuItem value="advanced">
                            Advanced Makeup Course - ₹60,000
                          </MenuItem>

                          <MenuItem value="master">
                            Master Program - ₹1,00,000
                          </MenuItem>
                        </Select>

                        <FormHelperText>
                          {errors.package}
                        </FormHelperText>
                      </FormControl>
                    </Col>
                  </Row>
                </div>

                {/* PAYMENT */}

                <div style={sectionStyle}>
                  <SectionTitle
                    icon={
                      <PaymentIcon
                        sx={{
                          color: "#ff6b6b",
                          fontSize: 18,
                        }}
                      />
                    }
                    title="Payment Details"
                  />

                  <Row className="g-3">
                    <Col md={6}>
                      <FormControl
                        fullWidth
                        error={!!errors.paymentMethod}
                      >
                        <InputLabel>
                          Payment Method
                        </InputLabel>

                        <Select
                          name="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleChange}
                          label="Payment Method"
                        >
                          <MenuItem value="upi">
                            UPI / Online Payment
                          </MenuItem>

                          <MenuItem value="cash">
                            Offline Payment
                          </MenuItem>
                        </Select>

                        <FormHelperText>
                          {errors.paymentMethod}
                        </FormHelperText>
                      </FormControl>
                    </Col>

                    <Col md={6}>
                      <TextField
                        fullWidth
                        label="Paid Amount *"
                        name="paidAmount"
                        value={formData.paidAmount}
                        onChange={handleChange}
                        error={!!errors.paidAmount}
                        helperText={errors.paidAmount}
                      />
                    </Col>

                    {formData.paymentMethod === "upi" && (
                      <Col md={6}>
                        <TextField
                          fullWidth
                          label="Transaction ID *"
                          name="transactionId"
                          value={formData.transactionId}
                          onChange={handleChange}
                          error={!!errors.transactionId}
                          helperText={errors.transactionId}
                        />
                      </Col>
                    )}
                  </Row>
                </div>

                {/* CONTACT */}

                <div style={sectionStyle}>
                  <SectionTitle
                    icon={
                      <ContactPhoneIcon
                        sx={{
                          color: "#ff6b6b",
                          fontSize: 18,
                        }}
                      />
                    }
                    title="Contact Information"
                  />

                  <Row className="g-3">
                    <Col md={4}>
                      <TextField
                        fullWidth
                        label="Contact Number *"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        error={!!errors.contact}
                        helperText={errors.contact}
                      />
                    </Col>

                    <Col md={4}>
                      <TextField
                        fullWidth
                        label="Alternative Contact Number"
                        name="altContact"
                        value={formData.altContact}
                        onChange={handleChange}
                        error={!!errors.altContact}
                        helperText={errors.altContact}
                      />
                    </Col>

                    <Col md={4}>
                      <TextField
                        fullWidth
                        label="Email Address *"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                      />
                    </Col>
                  </Row>
                </div>

                {/* TERMS */}

                <Card
                  style={{
                    border: "1px solid #ff6b6b",
                    background: "#fff8dc",
                    borderRadius: "10px",
                    marginBottom: "30px",
                  }}
                >
                  <Card.Body>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="terms"
                          checked={formData.terms}
                          onChange={handleChange}
                        />
                      }
                      label="I agree to Terms & Conditions"
                    />

                    {errors.terms && (
                      <Typography
                        color="error"
                        fontSize={13}
                      >
                        {errors.terms}
                      </Typography>
                    )}
                  </Card.Body>
                </Card>

                {/* BUTTONS */}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Button
                    variant="outline-danger"
                    type="reset"
                  >
                    RESET FORM
                  </Button>

                  <Button
                    type="submit"
                    style={{
                      background:
                        "linear-gradient(45deg,#ff6b6b,#ff8e8e)",
                      border: "none",
                    }}
                  >
                    REGISTER NOW
                  </Button>

                  <Button
                    variant="link"
                    style={{
                      color: "#ff6b6b",
                    }}
                  >
                    ← BACK TO LOGIN
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