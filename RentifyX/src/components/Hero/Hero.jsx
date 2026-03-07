import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import Input from "../common/Input";
import { motion } from "framer-motion";
import "./Hero.css";

const Hero = () => {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(1);

  return (
    <section className="hero-new">
      {/* Hero Image */}
      <div className="hero-image-container">
        <img
          src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
          alt="Property"
          className="hero-bg-image"
        />

        {/* Overlay Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
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
      </div>

      {/* Floating Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hero-search-floating"
      >
        <div className="row g-2 align-items-end">
          <div className="col-12 col-md-3">
            <Input
              placeholder="Where to"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-3">
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-2">
            <Input
              type="number"
              min="1"
              placeholder="Guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-2">
            <Link to="/listings">
              <Button className="w-100">
                Search
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;