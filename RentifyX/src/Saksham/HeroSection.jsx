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

  const handleSearch = () => {
    if (onSearchClick) onSearchClick(searchData);
  };

  const menuRef = useRef(null);
  const dateInputRef = useRef(null);

  const bannerImages = [toyotaFortunerImg, hondaCityImg, teslaImg, cretaImg];

  const heroContent = [
    { title: "Dominate Every Territory", subtitle: "Rugged SUVs for your wildest adventures" },
    { title: "Navigate the City in Style", subtitle: "Compact sedans for sleek urban driving" },
    { title: "Experience the Future Today", subtitle: "Premium EVs for an eco-friendly journey" },
    { title: "Comfort for the Whole Family", subtitle: "Spacious crossovers for memorable road trips" }
  ];

  // EXACT GRADIENT MATCH (Sunset Orange to Coral Pink)
  const brandGradient = 'linear-gradient(90deg, #FF4D00 0%, #FF8A00 100%)';

  const categories = [
    { id: 'all', label: 'All', icon: <FaSearch size={12} /> },
    { id: 'cars', label: 'Cars', icon: <FaCar size={12} /> },
    { id: 'bikes', label: 'Bikes', icon: <FaMotorcycle size={12} /> },
    { id: 'evs', label: 'EVs', icon: <FaLeaf size={12} /> },
    { id: 'bicycles', label: 'Bicycles', icon: <FaBicycle size={12} /> },
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

        {/* Dark Overlay for text readability */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: '0', zIndex: 1 }}></div>
        
        {/* Content Wrapper */}
        <div className="position-relative d-flex flex-column align-items-center w-100" style={{ zIndex: 2, marginBottom: '20px' }}>
          
          {/* Main Typography - Animated */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="display-5 fw-bold mb-2" style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.5px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                {heroContent[currentSlide].title}
              </h1>
              <p className="fs-6 mb-4 opacity-100" style={{ fontWeight: 500, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                {heroContent[currentSlide].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Category Pills - Placed exactly like image relative to dots */}
          <div className="d-flex justify-content-center gap-3 mb-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className="btn rounded-pill px-4 py-2 border-0 transition-all d-flex align-items-center gap-2 shadow-sm"
                style={{ 
                  fontSize: '0.85rem', 
                  backgroundColor: activeCategory === cat.id ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                  color: '#222',
                  backdropFilter: 'blur(4px)',
                  fontWeight: activeCategory === cat.id ? '600' : '500',
                  transform: activeCategory === cat.id ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {/* No Icons, just label */}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Carousel Indicators - "Arousal dots" style directly below pills */}
          <div className="d-flex gap-2 align-items-center">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className="btn p-0 rounded-pill border-0"
                style={{
                  width: index === currentSlide ? '32px' : '8px',
                  height: '6px',
                  background: index === currentSlide ? '#764ba2' : 'rgba(255, 255, 255, 0.6)', 
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;