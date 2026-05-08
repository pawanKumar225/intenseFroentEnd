import { Container, Typography, Grid, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
export default function OurServices() {
  const navigate = useNavigate();
  const services = [
  {
    title: "Beauty Therapist",
    desc: "Comprehensive training in skincare, facials, and client consultation techniques.",
    icon: "🧖‍♀️"
  },
  {
    title: "Hair Dressing",
    desc: "Learn cutting, coloring, and professional salon hair styling techniques.",
    icon: "✂️"
  },
  {
    title: "Cosmetology",
    desc: "Advanced beauty science including skin, hair, and cosmetic treatments.",
    icon: "🧴"
  },
  {
    title: "make-up",
    desc: "Professional makeup techniques for bridal, fashion, and special occasions.",
    icon: "💄"
  },
  {
    title: "Hair Style",
    desc: "Master modern and traditional hairstyles for events and bridal looks.",
    icon: "💇‍♀️"
  },
  {
  title: "Mehandi",
  desc: "Beautiful mehndi designs for weddings and special occasions, featuring intricate patterns and traditional artistry.",
  icon: "🌿",
},
  {
    title: "Saree Draping",
    desc: "Learn elegant saree draping styles for weddings and special occasions.",
  //  icon: <img src="saree.png" alt="saree" style={{ width: 30 }} />
    icon: "👗",
  },
  {
    title: "Flower Making",
    desc: "Create beautiful floral accessories for bridal hairstyles and decorations.",
    icon: "🌸"
  },
  {
    title: "Nail Art",
    desc: "Creative nail design techniques including extensions, gel, and polish art.",
    icon: "💅"
  }
];

const handleNavigate = (title) => {
    // Converts "Hair Dressing" to "hair-dressing"
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    navigate(`/services/${slug}`);
  };
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
                  <button 
                    className="btn btn-light mt-2 shadow-sm"
                   onClick={() => handleNavigate(service.title)}
                    style={{ fontWeight: 'bold', borderRadius: '20px' }}
                  >
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