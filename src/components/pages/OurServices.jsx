import { Container, Typography, Grid, Box } from "@mui/material";

export default function OurServices() {
  const services = [
    { title: "Makeup", desc: "Professional bridal & party makeup", icon: "💄" },
    { title: "Hair Styling", desc: "Trendy hairstyles & treatments", icon: "💇‍♀️" },
    { title: "Nail Art", desc: "Creative nail designs", icon: "💅" },
    { title: "Cosmetology", desc: "Advanced skincare solutions", icon: "🌿" },
    { title: "Bridal", desc: "Complete bridal packages", icon: "👰" },
    { title: "Skin Care", desc: "Facials & glow treatments", icon: "✨" }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      
      {/* Title */}
      <Typography 
        variant="h4" 
        align="center" 
        fontWeight="bold"
        mb={5}
        sx={{
          background: "linear-gradient(90deg, #e91e63, #ff6f91)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}
      >
        Our Services
      </Typography>

      {/* Grid */}
      <Grid container spacing={4} justifyContent="center">
        {services.map((service, index) => (
          
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            key={index}
            sx={{ display: "flex", justifyContent: "center" }}
          >

            {/* Card Wrapper */}
            <Box className="flip-card">

              <Box className="flip-card-inner">

                {/* FRONT */}
                <Box className="flip-card-front">
                  <div className="icon">{service.icon}</div>
                  <h3>{service.title}</h3>
                </Box>

                {/* BACK */}
                <Box className="flip-card-back">
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                  <button className="btn btn-light mt-2">
                    Explore
                  </button>
                </Box>

              </Box>

            </Box>

          </Grid>
        ))}
      </Grid>

    </Container>
  );
}