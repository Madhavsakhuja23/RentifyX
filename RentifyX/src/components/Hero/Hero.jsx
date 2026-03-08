import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import { motion } from "framer-motion";
import FilterBar from "../dwellings/FilterBar";
import "./Hero.css";

const Hero = () => {
  const [filters, setFilters] = useState({
    location: "",
    checkIn: undefined,
    checkOut: undefined,
    guests: 1,
    pets: false,
  });

  return (
    <section className="hero-new">
      <div className="hero-content-wrapper">
        {/* Text on left */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-text"
        >
          <span className="hero-badge">Welcome to RentifyX</span>
          <h1>Manage Your Property</h1>
          <p>
            Find the perfect rental or list your own property easily.
          </p>

          <Link to="/listings">
            <Button className="hero-cta">
              Explore Listings
            </Button>
          </Link>
        </motion.div>

        {/* Image on right */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hero-image-container"
        >
          <img
            src="https://assets.allurausa.com/web/general-images/_749xAUTO_crop_center-center_none/16-Green-Exterior-House-Design-Ideas04.jpg"
            alt="Beautiful Exterior House"
            className="hero-bg-image"
          />
        </motion.div>
      </div>

      {/* Floating Search Bar (like dwellings) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="hero-search-floating"
      >
        <FilterBar
          filters={filters}
          onChange={(newFilters) => setFilters(newFilters)}
        />
      </motion.div>
    </section>
  );
};

export default Hero;