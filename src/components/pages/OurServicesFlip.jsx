import { Container, Typography, Grid, Box } from "@mui/material";

export default function OurServices() {
  const services = [
    { title: "Makeup", desc: "Professional bridal & party makeup", icon: "💄" },
    { title: "Hair Styling", desc: "Trendy hairstyles & treatments", icon: "💇‍♀️" },
    // { title: "Nail Art", desc: "Creative nail designs", icon: "💅" },
    // { title: "Cosmetology", desc: "Advanced skincare solutions", icon: "🌿" },
    // { title: "Bridal", desc: "Complete bridal packages", icon: "👰" },
    // { title: "Skin Care", desc: "Facials & glow treatments", icon: "✨" }
  ];

  return (
    <Container sx={{ py: 6 }}>
      
      <Typography variant="h4" align="center" mb={5}>
        Our Services
      </Typography>

      <Grid container spacing={4}>
        {services.map((service, index) => (
          
          <Grid item xs={12} sm={6} md={4} key={index}>
            
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