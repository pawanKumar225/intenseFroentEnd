import { Container, Grid, Typography, Box, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";

export default function Footer() {
  return (
    <Box className="footer-section">

      <Container maxWidth="lg">
        <Grid container spacing={4}>

          {/* LOGO */}
          <Grid item xs={12} md={3} textAlign="center">
            <img
              src="/logo.png"
              alt="logo"
              className="footer-logo"
            />
          </Grid>

          {/* VISIT US */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" className="footer-title">
              Visit Us
            </Typography>

            <Typography className="footer-link">
             Intense Beauty Academy
            </Typography>

            <Typography className="footer-text">
             Plot No. 126C, Addagutta, HMT Hills Road, JNTU, KPHB
              Hyderabad, Telangana 500072
            </Typography>

            <Typography className="footer-text">
              Landmark: Metro Pillar 722, Opp Road
            </Typography>
          </Grid>

          {/* CONTACT */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" className="footer-title">
              Contact Us
            </Typography>

            <Typography className="footer-text">
              📞 +91 9000161922
            </Typography>

            <Typography className="footer-text">
              📞 +91 9059775142
            </Typography>

            <Typography className="footer-text">
              ✉️ intensebeautyacademy9@gmail.com
            </Typography>
          </Grid>

          {/* SOCIAL */}
      <Grid 
  item 
  xs={12} 
  md={3}
  sx={{
    display: "flex",
    flexDirection: "column",
    width: "100%",              // 🔥 MUST
  }}
>
  <Typography 
    variant="h6" 
    className="footer-title"
    sx={{
      textAlign: { xs: "center", md: "right" }   // title also right
    }}
  >
    Follow Us
  </Typography>

  <Box 
    sx={{
      display: "flex",
      gap: "10px",
      width: "100%",                 // 🔥 MUST
      justifyContent: { 
        xs: "center", 
        md: "flex-end"               // 🔥 RIGHT ALIGN
      }
    }}
  >
    <IconButton className="social-btn fb">
      <FacebookIcon />
    </IconButton>

    <IconButton className="social-btn insta">
      <InstagramIcon />
    </IconButton>

    <IconButton className="social-btn whatsapp">
      <WhatsAppIcon />
    </IconButton>

    <IconButton className="social-btn email">
      <EmailIcon />
    </IconButton>
  </Box>
</Grid>

        </Grid>

        {/* Bottom */}
        <Box className="footer-bottom">
          <Typography variant="body2">
            © 2026 Intense Beauty Academy. All Rights Reserved.
          </Typography>
        </Box>
      </Container>

    </Box>
  );
}