import React from "react";

export default function HeroCarousel() {
  return (
    <div
      id="heroCarousel"
      className="carousel slide carousel-fade"
      data-bs-ride="carousel"
      data-bs-interval="3000"
      data-bs-pause="false"
    >
      
      {/* Indicators */}
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2"></button>
      </div>

      {/* Slides */}
      <div className="carousel-inner">

        <div className="carousel-item active text-center">
          <img 
            src="/makeup.png"
            className="carousel-img"
            alt="makeup"
          />
          <div className="carousel-caption">
            <h2>Bridal Makeup</h2>
            <p>Look stunning on your special day</p>
          </div>
        </div>

        <div className="carousel-item text-center">
          <img 
            src="/hairstyle.png"
            className="carousel-img"
            alt="hairstyle"
          />
          <div className="carousel-caption">
            <h2>Professional Courses</h2>
            <p>Become a certified makeup artist</p>
          </div>
        </div>

        <div className="carousel-item text-center">
          <img 
            src="/nailart.png"
            className="carousel-img"
            alt="nailart"
          />
          <div className="carousel-caption">
            <h2>Hair Styling</h2>
            <p>Trendy & modern styles</p>
          </div>
        </div>

      </div>

      {/* Controls */}
      <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon"></span>
      </button>

      <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon"></span>
      </button>

    </div>
  );
}