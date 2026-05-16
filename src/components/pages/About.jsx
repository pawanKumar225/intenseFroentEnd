import HeroCarousel from "./HeroCarousel";
import 'bootstrap/dist/css/bootstrap.min.css';
import ImpactfulAboutSection from './ImpactfulAboutSection';

export default function About() {
    return(
        <div className="container mt-4">
              <div className="row">
                <HeroCarousel/>
              </div>
		<div className="App">
      <ImpactfulAboutSection />
    </div>   </div>
    )
}