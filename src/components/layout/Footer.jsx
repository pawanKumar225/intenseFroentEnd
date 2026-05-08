import {
  Container,
  Grid,
  Typography,
  Box,
  IconButton,
  Button
} from "@mui/material";

import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import CallIcon from "@mui/icons-material/Call";
import YouTubeIcon from '@mui/icons-material/YouTube';

export default function Footer() {
  return (
    <Box className="footer-section">
      <Container maxWidth="lg">

        <Grid container spacing={4}>

          {/* LOGO */}
          <Grid item xs={12} md={3} textAlign="center">
            <img src="/logo.png" alt="logo" className="footer-logo" />
          </Grid>

          {/* VISIT */}
          <Grid item xs={12} md={4}>
            <Typography className="footer-title">Visit Us</Typography>

            <Typography className="footer-link">
              Intense Beauty Academy
            </Typography>

            <Typography className="footer-text">
              Plot No.126C, Addagutta, HMT Hills Road, JNTU, KPHB,
              Hyderabad, Telangana 500072
            </Typography>

            <Typography className="footer-text">
              Landmark: Metro Pillar 722
            </Typography>
          </Grid>

          {/* CONTACT + SOCIAL */}
          <Grid item xs={12} md={5}>

            <Typography className="footer-title">Contact Us</Typography>

            {/* CONTACT BUTTONS */}
            <Box className="contact-buttons">

              <Button
                startIcon={<CallIcon />}
                className="contact-btn call"
                component="a"
                href="tel:+919000161922"
              >
                +91 9000161922
              </Button>

              <Button
                startIcon={<CallIcon />}
                className="contact-btn call"
                component="a"
                href="tel:+919059775142"
              >
                +91 9059775142
              </Button>

              <Button
                startIcon={<EmailIcon />}
                className="contact-btn email"
                component="a"
                href="mailto:intensebeautyacademy9@gmail.com"
              >
                intensebeautyacademy9@gmail.com
              </Button>

            </Box>

            {/* SOCIAL RIGHT */}
            <Box className="social-wrapper">

              <Typography className="footer-title social-title">
                Follow Us
              </Typography>

              <Box className="social-icons">

                {/* FACEBOOK */}
                <a
                  href= "https://www.facebook.com/intensebeautyacademy/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconButton className="social-btn fb">
                    <FacebookOutlinedIcon />
                  </IconButton>
                </a>

                {/* INSTAGRAM */}
                <a
                  href="https://www.instagram.com/intensebeautyacademy?igsh=MWViemtqNXVsNWV3aQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconButton className="social-btn insta">
                    <InstagramIcon />
                  </IconButton>
                </a>

                {/* WHATSAPP */}
                <a
                  href="https://wa.me/919000161922"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconButton className="social-btn whatsapp">
                    <WhatsAppIcon />
                  </IconButton>
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@Intensebeautymakeupacademy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconButton className="social-btn email">
                    <YouTubeIcon />
                  </IconButton>
                </a>

              </Box>
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