// Registration.jsx

import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
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

  const [success, setSuccess] = useState(false);

  // ✅ Smooth input handling
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

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
          <Col xs={12} md={11} lg={10}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, md: 5 },
                borderRadius: "20px",
                background: "#fff",
              }}
            >
              {/* Header */}
              <Box textAlign="center" mb={5}>
                <SchoolIcon
                  sx={{
                    fontSize: 50,
                    color: "#ff6b6b",
                    mb: 1,
                  }}
                />

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: "#ff6b6b",
                    fontSize: {
                      xs: "28px",
                      md: "38px",
                    },
                  }}
                >
                  INTENSE BEAUTY ACADEMY
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#777",
                    mt: 1,
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

              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Registration Submitted Successfully
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                {/* Personal Information */}
                <div style={sectionStyle}>
                  <SectionTitle
                    icon={<PersonIcon sx={{ color: "#ff6b6b", fontSize: 18 }} />}
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
                      />
                    </Col>

                    <Col md={6}>
                      <TextField
                        fullWidth
                        label="Father's / Husband's Name *"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                      />
                    </Col>

               <Col md={6}>
  <Box>
    <Typography
      sx={{
        mb: 1,
        fontSize: "14px",
        fontWeight: 500,
        color: "#555",
      }}
    >
      Date of Birth *
    </Typography>

    <TextField
      fullWidth
      type="date"
      name="dob"
      value={formData.dob}
      onChange={handleChange}
      variant="outlined"
      InputLabelProps={{
        shrink: true,
      }}
      sx={{
        backgroundColor: "#fff",

        "& input": {
          padding: "14px",
        },
      }}
    />
  </Box>
</Col>

                    <Col md={6}>
                      <TextField
                        fullWidth
                        label="Aadhar Number *"
                        name="aadhar"
                        value={formData.aadhar}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </div>

                {/* Address */}
                <div style={sectionStyle}>
                  <SectionTitle
                    icon={<HomeIcon sx={{ color: "#ff6b6b", fontSize: 18 }} />}
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
                      />
                    </Col>
                  </Row>
                </div>

                {/* Course Information */}
                <div style={sectionStyle}>
                  <SectionTitle
                    icon={<WorkIcon sx={{ color: "#ff6b6b", fontSize: 18 }} />}
                    title="Course Information"
                  />

                  <Row className="g-3">
                 <Col md={6}>
  <Box>
    <Typography
      sx={{
        mb: 1,
        fontSize: "14px",
        fontWeight: 500,
        color: "#555",
      }}
    >
      Date of Joining *
    </Typography>

    <TextField
      fullWidth
      type="date"
      name="joinDate"
      value={formData.joinDate}
      onChange={handleChange}
      variant="outlined"
      InputLabelProps={{
        shrink: true,
      }}
      sx={{
        backgroundColor: "#fff",

        "& input": {
          padding: "14px",
        },
      }}
    />
  </Box>
</Col>

                    <Col md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Package Details *</InputLabel>

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
                          Select Course Package
                        </FormHelperText>
                      </FormControl>
                    </Col>
                  </Row>
                </div>

                {/* Payment */}
                {/* <div style={sectionStyle}>
                  <SectionTitle
                    icon={<PaymentIcon sx={{ color: "#ff6b6b", fontSize: 18 }} />}
                    title="Payment Details"
                  />

                  <Row className="g-3">
                    <Col md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Payment Method</InputLabel>

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
                      </FormControl>
                    </Col>

                    <Col md={6}>
                      <TextField
                        fullWidth
                        label="Paid Amount *"
                        name="paidAmount"
                        value={formData.paidAmount}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </div> */}

<div style={sectionStyle}>
  <SectionTitle
    icon={<PaymentIcon sx={{ color: "#ff6b6b", fontSize: 18 }} />}
    title="Payment Details"
  />

  <Row className="g-3">
    {/* Payment Method */}
    <Col md={6}>
      <FormControl fullWidth>
        <InputLabel id="payment-method-label">
          Payment Method
        </InputLabel>

        <Select
          labelId="payment-method-label"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          label="Payment Method"
        >
          <MenuItem value="upi">
            UPI / Online Payment
          </MenuItem>

          <MenuItem value="cash">
            Offline Payment (Cash / Bank)
          </MenuItem>
        </Select>
      </FormControl>
    </Col>

    {/* Paid Amount */}
    <Col md={6}>
      <TextField
        fullWidth
        label="Paid Amount *"
        name="paidAmount"
        value={formData.paidAmount}
        onChange={handleChange}
      />
    </Col>

    {/* ✅ CONDITIONAL TRANSACTION ID */}
    {formData.paymentMethod === "upi" && (
      <Col md={6}>
        <TextField
          fullWidth
          label="Transaction ID *"
          name="transactionId"
          value={formData.transactionId || ""}
          onChange={handleChange}
          placeholder="Enter Transaction ID"
        />
      </Col>
    )}
  </Row>
</div>
                {/* Contact */}
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
                      />
                    </Col>

                    <Col md={4}>
                      <TextField
                        fullWidth
                        label="Alternative Contact Number"
                        name="altContact"
                        value={formData.altContact}
                        onChange={handleChange}
                      />
                    </Col>

                    <Col md={4}>
                      <TextField
                        fullWidth
                        label="Email Address *"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </div>

                {/* Terms */}
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
                          sx={{
                            color: "#ff6b6b",
                          }}
                        />
                      }
                      label={
                        <Typography fontSize={14}>
                          I have read and agree to the{" "}
                          <span
                            style={{
                              color: "#ff6b6b",
                              fontWeight: 600,
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            Terms & Conditions
                          </span>
                        </Typography>
                      }
                    />
                  </Card.Body>
                </Card>

                {/* Buttons */}
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
                    style={{
                      borderRadius: "30px",
                      padding: "10px 30px",
                      fontWeight: 600,
                    }}
                  >
                    RESET FORM
                  </Button>

                  <Button
                    type="submit"
                    style={{
                      background:
                        "linear-gradient(45deg,#ff6b6b,#ff8e8e)",
                      border: "none",
                      borderRadius: "30px",
                      padding: "10px 40px",
                      fontWeight: 600,
                    }}
                  >
                    REGISTER NOW
                  </Button>

                  <Button
                    variant="link"
                    style={{
                      color: "#ff6b6b",
                      textDecoration: "none",
                      fontWeight: 600,
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