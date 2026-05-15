// src/pages/Registration.jsx

import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Box,
  Button,
  Divider,
  Card,
  CardContent,
  MenuItem,
  FormControlLabel,
  Checkbox,
  InputAdornment,
} from "@mui/material";

import {
  Person,
  FamilyRestroom,
  Badge,
  CalendarMonth,
  LocationOn,
  School,
  Phone,
  Email,
  Payment,
} from "@mui/icons-material";

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
    packageDetails: "",
    paymentMethod: "",
    paidAmount: "",
    contact: "",
    altContact: "",
    email: "",
    agree: false,
  });

  const packages = [
    "Basic Makeup Course",
    "Professional Makeup",
    "Hair Styling",
    "Bridal Makeup",
    "Nail Art Course",
  ];

  const paymentMethods = [
    "UPI / Online Payment",
    "Offline Payment (Cash/Bank Transfer)",
  ];

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const SectionCard = ({ title, children }) => (
    <Card
      elevation={0}
      sx={{
        mb: 4,
        borderRadius: "14px",
        border: "1px solid #e7e7e7",
        position: "relative",
        overflow: "visible",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -14,
          left: 18,
          bgcolor: "#fff",
          border: "2px solid #ff6b6b",
          borderRadius: "30px",
          px: 2,
          py: 0.5,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "#ff6b6b",
            fontWeight: 700,
            fontSize: "13px",
          }}
        >
          {title}
        </Typography>
      </Box>

      <CardContent sx={{ pt: 4 }}>{children}</CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        background: "#f4f4f4",
        minHeight: "100vh",
        py: { xs: 2, md: 5 },
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            borderRadius: "18px",
            p: { xs: 2, sm: 3, md: 5 },
            background: "#fff",
          }}
        >
          {/* HEADER */}

          <Box textAlign="center" mb={5}>
            <School
              sx={{
                fontSize: 45,
                color: "#ff6b6b",
                mb: 1,
              }}
            />

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#ff6b6b",
                fontSize: {
                  xs: "1.7rem",
                  sm: "2rem",
                },
              }}
            >
              INTENSE BEAUTY ACADEMY
            </Typography>

            <Typography
              sx={{
                color: "#777",
                mt: 1,
                fontSize: "14px",
              }}
            >
              Candidate Registration Form
            </Typography>

            <Divider
              sx={{
                width: 120,
                mx: "auto",
                mt: 2,
                borderColor: "#ff6b6b",
              }}
            />
          </Box>

          {/* FORM */}

          <form>
            {/* PERSONAL INFO */}

            <SectionCard title="Personal Information">
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: "#ff6b6b" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Father's / Husband's Name"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FamilyRestroom sx={{ color: "#ff6b6b" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="Date of Birth"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonth sx={{ color: "#ff6b6b" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Aadhar Number"
                    name="aadhar"
                    value={formData.aadhar}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Badge sx={{ color: "#ff6b6b" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            {/* ADDRESS */}

            <SectionCard title="Address Information">
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Present Address"
                    name="presentAddress"
                    value={formData.presentAddress}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn sx={{ color: "#ff6b6b" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Permanent Address"
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn sx={{ color: "#ff6b6b" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            {/* COURSE */}

            <SectionCard title="Course Information">
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="Date of Joining"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonth sx={{ color: "#ff6b6b" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Package Details"
                    name="packageDetails"
                    value={formData.packageDetails}
                    onChange={handleChange}
                  >
                    {packages.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </SectionCard>

            {/* PAYMENT */}

            <SectionCard title="Payment Details">
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Package Price"
                    value="₹ 0"
                    disabled
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Payment sx={{ color: "#ff6b6b" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Payment Method"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                  >
                    {paymentMethods.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Paid Amount"
                    name="paidAmount"
                    value={formData.paidAmount}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            {/* CONTACT */}

            <SectionCard title="Contact Information">
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Contact Number"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone sx={{ color: "#ff6b6b" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Alternative Contact Number"
                    name="altContact"
                    value={formData.altContact}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone sx={{ color: "#ff6b6b" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: "#ff6b6b" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            {/* TERMS */}

            <Box
              sx={{
                border: "1px solid #ff6b6b",
                borderRadius: "12px",
                bgcolor: "#fff8e8",
                p: 2,
                mb: 4,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.agree}
                    name="agree"
                    onChange={handleChange}
                    sx={{
                      color: "#ff6b6b",
                      "&.Mui-checked": {
                        color: "#ff6b6b",
                      },
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
            </Box>

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
                variant="outlined"
                sx={{
                  borderColor: "#ff6b6b",
                  color: "#ff6b6b",
                  borderRadius: "10px",
                  px: 4,
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#ff6b6b",
                    background: "#fff1f1",
                  },
                }}
              >
                RESET FORM
              </Button>

              <Button
                variant="contained"
                sx={{
                  background:
                    "linear-gradient(45deg, #ff6b6b, #ff8b8b)",
                  borderRadius: "10px",
                  px: 5,
                  fontWeight: 700,
                  boxShadow: "none",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #ff5a5a, #ff7d7d)",
                    boxShadow: "none",
                  },
                }}
              >
                REGISTER NOW
              </Button>

              <Button
                sx={{
                  color: "#ff6b6b",
                  fontWeight: 600,
                }}
              >
                ← BACK TO LOGIN
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Registration;