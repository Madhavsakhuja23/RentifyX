import { useState, useEffect } from 'react';
import toyotaFortunerImg from '../assets/toyota-fortuner.webp';
import hondaCityImg from '../assets/honda-city.webp';
import teslaImg from '../assets/tesla3.avif';
import cretaImg from '../assets/creta.avif';
import '../components/dwellings/HeroCarousel.css';

const slides = [
  { image: toyotaFortunerImg, title: "Find Your Dream Ride", desc: "Premium vehicles for long-term journeys", category: "cars" },
  { image: hondaCityImg, title: "City Drives, Simplified", desc: "Modern cars for daily commutes and road trips", category: "cars" },
  { image: teslaImg, title: "Go Electric, Go Green", desc: "Eco-friendly EVs for a sustainable ride", category: "evs" },
  { image: cretaImg, title: "Adventure Awaits", desc: "SUVs and bikes for every terrain", category: "bikes" },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="hero-carousel">
      {slides.map((s, i) => (
        <div
          key={s.category + i}
          className="carousel-slide"
          style={{
            opacity: i === current ? 1 : 0,
            zIndex: i === current ? 1 : 0
          }}
        >
          <img
            src={s.image}
            alt={s.title}
            className="carousel-image"
          />
          <div className="carousel-overlay" />
        </div>
      ))}

      <div className="carousel-content">
        <h1 className="carousel-title">
          {slide.title}
        </h1>
        <p className="carousel-desc">
          {slide.desc}
        </p>
      </div>

      <div className="carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`dot ${i === current ? "active" : ""}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;