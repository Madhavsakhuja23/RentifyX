import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";
import "./Hero.css";

const Hero = () => {
  const [location, setLocation] = useState("");

  return (
    <section className="hero-section">
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
    </section >
  );
};

export default Hero;
