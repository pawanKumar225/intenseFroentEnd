import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function WhatsAppSticky() {
  const phoneNumber = "919000161922"; // Your Intense Beauty Academy Number
  const message = "Hello! I am interested in your beauty courses.";
  
  // WhatsApp URL format for both mobile and web
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Box
      sx={{
        position: "fixed",
        left: "20px", // Sticky to the left
        bottom: "40px", // Floating above the bottom
        zIndex: 2000, // Ensure it's above all other elements
      }}
    >
      <Tooltip title="Chat with us on WhatsApp" placement="right" arrow>
        <IconButton
          component="a"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-sticky-btn"
          sx={{
            backgroundColor: "#25d366", // Official WhatsApp Green
            color: "#fff",
            width: "60px",
            height: "60px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            "&:hover": {
              backgroundColor: "#128c7e", // Darker green on hover
              transform: "scale(1.1)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <WhatsAppIcon sx={{ fontSize: "35px" }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}