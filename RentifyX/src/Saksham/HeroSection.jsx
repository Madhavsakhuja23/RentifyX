import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Images for Carousel
import toyotaFortunerImg from '../assets/toyota-fortuner.webp';
import hondaCityImg from '../assets/honda-city.webp';
import teslaImg from '../assets/tesla3.avif';
import cretaImg from '../assets/creta.avif';
import { FaCalendarAlt, FaUser, FaSearch, FaMapMarkerAlt, FaCar, FaMotorcycle, FaLeaf, FaBicycle } from 'react-icons/fa';

const HeroSection = ({ activeCategory, onCategoryChange, onSearchClick }) => {
  const [activeTab, setActiveTab] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0); 
  const [searchData, setSearchData] = useState({
    location: '',
    date: '',
    guests: 1
  });

  const handleSearch = () => {
    if (onSearchClick) onSearchClick(searchData);
  };

  const menuRef = useRef(null);
  const dateInputRef = useRef(null);

  const bannerImages = [toyotaFortunerImg, hondaCityImg, teslaImg, cretaImg];

  // EXACT GRADIENT MATCH (Sunset Orange to Coral Pink)
  const brandGradient = 'linear-gradient(90deg, #FF4D00 0%, #FF8A00 100%)';

  const categories = [
    { id: 'all', label: 'All', icon: <FaSearch size={12} /> },
    { id: 'cars', label: 'Cars', icon: <FaCar size={12} /> },
    { id: 'bikes', label: 'Bikes', icon: <FaMotorcycle size={12} /> },
    { id: 'evs', label: 'EVs', icon: <FaLeaf size={12} /> },
    { id: 'bicycles', label: 'Bicycles', icon: <FaBicycle size={12} /> },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveTab(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 3000); // 3 seconds between images with smooth fade
    return () => clearInterval(slideInterval);
  }, [bannerImages.length]);

  return (
<<<<<<< HEAD
    <section className="premium-hero-section" id="home">
      {/* Background elements */}
      <div className="hero-bg-elements">
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />
        <div className="hero-circle" />
        <div className="hero-circle-inner" />
=======
    <section className="w-100 bg-white" id="home">
      {/* 1. Main Banner Image Section */}
      <div
        className="position-relative d-flex flex-column align-items-center justify-content-end text-center text-white"
        style={{
          height: '400px', // Reduced height further
          borderRadius: '0',
          overflow: 'hidden',
          paddingBottom: '20px' 
        }}
      >
        {/* Background Images with Fade Effect */}
        {bannerImages.map((img, index) => (
          <div
            key={index}
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: '100% 30%', // Adjusted to center better vertically
              opacity: currentSlide === index ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: 0
            }}
          />
        ))}

        {/* Dark Overlay for text readability */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: '0', zIndex: 1 }}></div>
        
        {/* Content Wrapper */}
        <div className="position-relative d-flex flex-column align-items-center w-100" style={{ zIndex: 2, marginBottom: '20px' }}>
          
          {/* Main Typography */}
          <h1 className="display-5 fw-bold mb-2" style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.5px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Find Your Dream Ride
          </h1>
          <p className="fs-6 mb-4 opacity-100" style={{ fontWeight: 500, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
            Premium vehicles for long-term journeys
          </p>

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
>>>>>>> main
      </div>

      {/* 2. Main Search Container - Reduced Size & Functional */}
      <div className="container" style={{ marginTop: '20px', marginBottom: '40px', position: 'relative', zIndex: 20 }} ref={menuRef}>
        <div 
          className="bg-white rounded-pill shadow-sm d-flex align-items-center p-1 mx-auto border position-relative" 
          style={{ maxWidth: '650px', border: '1px solid #e2e8f0', height: '55px' }}
        >
<<<<<<< HEAD
          <span className="hero-badge-dot" />
          Premium Vehicle Rentals
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          UNLOCK THE <br />
          <span className="highlight">POTENTIAL</span> OF <br />
          YOUR RIDE WITH US
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Experience premium vehicles at unbeatable prices. From sleek cars to electric scooters —
          we have everything you need for the perfect journey.
        </motion.p>

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <motion.button
            className="hero-btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onExplore}
=======
          {/* WHERE SECTION */}
          <div 
            className={`d-flex align-items-center px-4 flex-grow-1 border-end transition-all position-relative h-100`}
            style={{ 
              borderRadius: '50px 0 0 50px',
              backgroundColor: activeTab === 'where' ? '#fcfcfc' : 'transparent',
              flexBasis: '35%',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('where')}
>>>>>>> main
          >
            <FaMapMarkerAlt className="me-2 fs-6 mt-1" style={{ fill: 'url(#brand-gradient)' }} />
            <div className="text-start w-100 mt-1">
              <label className="text-uppercase fw-bold text-muted mb-0 d-block" style={{ fontSize: '0.55rem', letterSpacing: '0.5px', cursor: 'pointer' }}>Where</label>
              <input 
                type="text" 
                placeholder="Search destinations" 
                className="border-0 bg-transparent p-0 m-0 w-100 fw-medium"
                style={{ fontSize: '0.85rem', outline: 'none', color: '#333' }}
                value={searchData.location}
                onChange={(e) => setSearchData({...searchData, location: e.target.value})}
                onFocus={() => setActiveTab('where')}
              />
            </div>
          </div>

          {/* WHEN SECTION */}
          <div 
            className={`d-flex align-items-center px-4 flex-grow-1 border-end transition-all position-relative h-100`}
            style={{ 
              backgroundColor: activeTab === 'when' ? '#fcfcfc' : 'transparent',
              flexBasis: '35%',
              cursor: 'pointer'
            }}
            onClick={() => {
              setActiveTab('when');
              if (dateInputRef.current && typeof dateInputRef.current.showPicker === 'function') {
                dateInputRef.current.showPicker();
              }
            }}
          >
            <FaCalendarAlt className="me-2 fs-6 mt-1" style={{ color: '#764ba2' }} />
            <div className="text-start w-100 mt-1">
              <label className="text-uppercase fw-bold text-muted mb-0 d-block" style={{ fontSize: '0.55rem', letterSpacing: '0.5px', cursor: 'pointer' }}>When</label>
              <input 
                ref={dateInputRef}
                type="date" 
                className="border-0 bg-transparent p-0 m-0 w-100 fw-medium text-muted date-input-clean"
                style={{ 
                  fontSize: '0.8rem', 
                  outline: 'none',
                  color: searchData.date ? '#333' : 'transparent',
                  cursor: 'pointer'
                }}
                value={searchData.date}
                onChange={(e) => setSearchData({...searchData, date: e.target.value})}
                onFocus={() => setActiveTab('when')}
              />
            </div>
          </div>

          {/* WHO SECTION */}
          <div 
            className={`d-flex align-items-center px-4 flex-grow-1 transition-all position-relative h-100`}
            style={{ 
              backgroundColor: activeTab === 'who' ? '#fcfcfc' : 'transparent',
              flexBasis: '30%',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('who')}
          >
            <FaUser className="me-2 fs-6 mt-1" style={{ color: '#764ba2' }} />
            <div className="text-start w-100 mt-1">
              <label className="text-uppercase fw-bold text-muted mb-0 d-block" style={{ fontSize: '0.55rem', letterSpacing: '0.5px', cursor: 'pointer' }}>Who</label>
              <input 
                type="number" 
                min="1" 
                max="10"
                className="border-0 bg-transparent p-0 m-0 w-100 fw-medium"
                style={{ fontSize: '0.85rem', outline: 'none', color: '#333' }}
                value={searchData.guests}
                onChange={(e) => setSearchData({...searchData, guests: parseInt(e.target.value) || 1})}
                onFocus={() => setActiveTab('who')}
              />
            </div>
          </div>

          {/* THE GRADIENT SEARCH BUTTON */}
          <button 
            className="btn rounded-circle p-0 d-flex align-items-center justify-content-center shadow-lg ms-2 border-0 flex-shrink-0" 
            style={{ 
              width: '40px', 
              height: '40px', 
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              transition: 'all 0.3s ease',
              marginRight: '6px'
            }}
            onClick={handleSearch}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <FaSearch className="text-white fs-6" />
          </button>
        </div>
      </div>

      {/* SVG Gradient Definition for Icons (optional) */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </svg>
    </section>
  );
};

export default HeroSection;