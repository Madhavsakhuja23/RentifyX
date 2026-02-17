import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Home, Car, Zap, Building2, Bike, Percent, Sofa, Wifi, Shield } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";
import "./Hero.css";

const Hero = () => {
  const [location, setLocation] = useState("");

  // Floating animation variants
  const floatingVariants = {
    animate: (i) => ({
      y: [0, -20, 0],
      x: [0, 10, -10, 0],
      transition: {
        duration: 3 + i * 0.3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <section className="hero-section">
      {/* Animated Background Elements */}
      <motion.div className="hero-gradient-overlay"></motion.div>
      
      {/* Floating Icons Background */}
      <motion.div
        className="floating-icon-1"
        custom={0}
        animate="animate"
        variants={floatingVariants}
      >
        <Home size={150} strokeWidth={1} />
      </motion.div>
      
      <motion.div
        className="floating-icon-2"
        custom={1}
        animate="animate"
        variants={floatingVariants}
      >
        <Car size={130} strokeWidth={1} />
      </motion.div>
      
      <motion.div
        className="floating-icon-3"
        custom={2}
        animate="animate"
        variants={floatingVariants}
      >
        <Zap size={120} strokeWidth={1} />
      </motion.div>

      <motion.div
        className="floating-icon-4"
        custom={1.5}
        animate="animate"
        variants={floatingVariants}
      >
        <Building2 size={140} strokeWidth={1} />
      </motion.div>

      <motion.div
        className="floating-icon-5"
        custom={0.5}
        animate="animate"
        variants={floatingVariants}
      >
        <Bike size={110} strokeWidth={1} />
      </motion.div>

      <motion.div
        className="floating-icon-6"
        custom={2.5}
        animate="animate"
        variants={floatingVariants}
      >
        <Percent size={100} strokeWidth={1} />
      </motion.div>

      <motion.div
        className="floating-icon-7"
        custom={1.2}
        animate="animate"
        variants={floatingVariants}
      >
        <Sofa size={125} strokeWidth={1} />
      </motion.div>

      <motion.div
        className="floating-icon-8"
        custom={0.8}
        animate="animate"
        variants={floatingVariants}
      >
        <Wifi size={115} strokeWidth={1} />
      </motion.div>

      <motion.div
        className="floating-icon-9"
        custom={2}
        animate="animate"
        variants={floatingVariants}
      >
        <Shield size={110} strokeWidth={1} />
      </motion.div>

      <div className="container text-center position-relative">

        {/* Animated Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hero-title"
        >
          Rent Homes & Vehicles – Anytime, Anywhere
        </motion.h1>

        {/* Animated Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hero-subtitle"
        >
          Houses, Flats, PGs, Cars, Bikes & EVs in one place
        </motion.p>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hero-search-container"
        >
          <div className="hero-search">
            <div className="row g-3 g-md-2 justify-content-center">
              <div className="col-12 col-md-4">
                <div className="search-input-wrapper">
                  <MapPin size={18} className="search-icon" />
                  <Input
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              <div className="col-12 col-md-3">
                <div className="search-input-wrapper">
                  <Calendar size={18} className="search-icon" />
                  <Input type="date" className="search-input" aria-label="Select date" />
                </div>
              </div>

              <div className="col-12 col-md-2">
                <Button className="w-100 search-btn">
                  <Search size={18} className="me-2" />
                  <Link to="/listings" className="text-white text-decoration-none">
                    Search
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
