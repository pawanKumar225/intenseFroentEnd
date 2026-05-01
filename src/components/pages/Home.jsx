// src/pages/Home.jsx
import { Card, CardContent, Typography } from "@mui/material";
import HeroCarousel from "./HeroCarousel";
import WelcomeSection from "./WelcomeSection";
import OurServices from "./OurServices";
import OurServicesFlip from "./OurServicesFlip";
export default function Home() {
  return (
    <div className="container mt-4">
      <div className="row">        
          
          <HeroCarousel />
         <WelcomeSection />
         <OurServices />
        {/* <OurServicesFlip /> */}
         
      </div>
    </div>
  );
}