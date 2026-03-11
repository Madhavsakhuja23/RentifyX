import { useState, useEffect } from 'react';
import toyotaFortunerImg from '../assets/toyota-fortuner.webp';
import bajajPulsarImg from '../assets/bajaj-pulsar.avif';
import activaImg from '../assets/activa-6g.avif';
import mountainBikeImg from '../assets/mountain-bike.jpg';
import '../components/dwellings/HeroCarousel.css';

const slides = [
  { image: toyotaFortunerImg, title: "Find Your Dream Ride", desc: "Premium vehicles for long-term journeys", category: "cars" },
  { image: bajajPulsarImg, title: "Ride the Legend", desc: "Classic bikes for the ultimate road trip", category: "bikes" },
  { image: activaImg, title: "Zip Through Traffic", desc: "Efficient scooters for your daily commute", category: "bikes" },
  { image: mountainBikeImg, title: "Adventure on Two Wheels", desc: "Explore off-road trails with our best cycles", category: "bicycles" },
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