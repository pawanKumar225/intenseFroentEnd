import React from "react";

export default function WelcomeSection() {
  return (
    <div className="welcome-section py-5">
      <div className="container text-center position-relative">

        {/* Heading */}
        {/* <h1 className="welcome-title">
          <h1 className="welcome-title">
  <span className="highlight">Welcome</span> To The{" "}
  <span className="title">Intense</span> Beauty Academy!
</h1>
        </h1> */}
        <h1 className="welcome-title">
  Welcome To The Intense Beauty Academy!
</h1>

        {/* Description */}
        <p className="welcome-text mt-4">
          At Beauty Academy, you will discover a perfect blend of creativity and professionalism.
          We offer world-class beauty training programs including makeup, hairstyling, nail art,
          and cosmetology. Our goal is to train and groom students to become successful beauty
          professionals in the industry.
        </p>

        <p className="welcome-text">
          We also provide bridal makeup services, fashion styling, editorial shoots, and
          professional certification courses designed to elevate your career in the beauty
          and wellness sector.
        </p>

        {/* Side Image */}
       <img 
  src="/welcome.png" 
  alt="beauty" 
  className="welcome-img-right"
/>
 <img 
  src="/welcome.png" 
  alt="beauty" 
  className="welcome-img-left"
/>

      </div>
    </div>
  );
}