import HeroCarousel from "./HeroCarousel";
import ServicesPage from "./ServicesPage";

export default function Services() {
  return (
    <div className="container mt-4">
      <div className="row">
        <HeroCarousel />
      </div>

      <div>
        <h1>Our Services</h1>

        <div>
          <ServicesPage />
        </div>
      </div>
    </div>
  );
}