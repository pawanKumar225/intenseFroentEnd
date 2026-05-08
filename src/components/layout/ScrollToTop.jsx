import React, { useState, useEffect } from "react";
import { IconButton, Zoom } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down 300px
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling effect
    });
  };

  return (
    <Zoom in={isVisible}>
      <IconButton
        onClick={scrollToTop}
        className="scroll-to-top-btn"
        sx={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          zIndex: 1000,
          backgroundColor: "#e91e63", // Matches your beauty theme
          color: "white",
          "&:hover": {
            backgroundColor: "#ff6f91",
            transform: "scale(1.1)",
          },
          boxShadow: "0 4px 15px rgba(233, 30, 99, 0.4)",
        }}
      >
        <KeyboardArrowUpIcon fontSize="large" />
      </IconButton>
    </Zoom>
  );
}