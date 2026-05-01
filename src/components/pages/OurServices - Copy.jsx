import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent 
} from "@mui/material";

import FaceIcon from "@mui/icons-material/Face";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import BrushIcon from "@mui/icons-material/Brush";
import SpaIcon from "@mui/icons-material/Spa";

export default function OurServices() {

  const services = [
    {
      title: "Beauty Therapist",
      desc: "Professional bridal and party makeup services.",
      icon: <FaceIcon sx={{ fontSize: 40, color: "#e91e63" }} />
    },
    {
      title: "Hair Dresing",
      desc: "Modern and trendy hair styling solutions.",
      icon: <ContentCutIcon sx={{ fontSize: 40, color: "#ff6f91" }} />
    },
    {
      title: "Nail Art",
      desc: "Creative and stylish nail art designs.",
      icon: <BrushIcon sx={{ fontSize: 40, color: "#c471ed" }} />
    },
    {
      title: "Cosmetology",
      desc: "Advanced beauty and skincare treatments.",
      icon: <SpaIcon sx={{ fontSize: 40, color: "#84b8e2" }} />
    },
       {
      title: "Make-up",
      desc: "Professional bridal and party makeup services.",
      icon: <FaceIcon sx={{ fontSize: 40, color: "#e91e63" }} />
    },
    {
      title: "Hair Styling",
      desc: "Modern and trendy hair styling solutions.",
      icon: <ContentCutIcon sx={{ fontSize: 40, color: "#ff6f91" }} />
    },
    {
      title: "Saree Draping",
      desc: "Traditional and modern saree draping techniques.",
      icon: <BrushIcon sx={{ fontSize: 40, color: "#c471ed" }} />
    },
    {
      title: "Flower Making",
      desc: "Beautiful and intricate flower arrangements.",
      icon: <SpaIcon sx={{ fontSize: 40, color: "#84b8e2" }} />
    }
  ];

  return (
    <Container sx={{ py: 6 }}>
      
      {/* Heading */}
      <Typography 
        variant="h3" 
        align="center" 
        fontWeight="bold"
        sx={{
          background: "linear-gradient(90deg, #e91e63, #ff6f91)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 2
        }}
      >
        Our Services
      </Typography>

      {/* Description */}
      <Typography 
        align="center" 
        color="text.secondary"
        sx={{ maxWidth: 700, mx: "auto", mb: 5 }}
      >
        At Beauty Academy, we offer a wide range of services to help you look 
        and feel your best. Our expert team provides top-notch beauty services.
      </Typography>

      {/* Grid */}
      <Grid container spacing={4}>
        {services.map((service, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            
         
             <Card
              sx={{
                textAlign: "center",
                p: 8,
               background: "linear-gradient(135deg, #e91e63, #ff6f91, #d4af37)",
                color: "#fff",
                borderRadius: "20px",
                transition: "all 0.4s ease",
                boxShadow: "0 6px 20px rgba(0,0,0,0.15)",

                "&:hover": {
                  transform: "translateY(-10px) scale(1.03)",
                  background: "linear-gradient(135deg, #d4af37, #ff6f91, #e91e63)",
                  boxShadow: "0 15px 40px rgba(233, 30, 99, 0.4)",
                  borderRadius: "30px"
                }
              }}
            >
              <CardContent>

                <div style={{ fontSize: "40px" }}>
                  {service.icon}
                </div>

                <Typography variant="h6" fontWeight="bold" mt={2}>
                  {service.title}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  {service.desc}
                </Typography>

              </CardContent>
            </Card>

          </Grid>
        ))}
      </Grid>

    </Container>
  );
}