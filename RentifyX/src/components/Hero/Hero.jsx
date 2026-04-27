import { Link } from "react-router-dom";
import Button from "../common/Button";
import { motion } from "framer-motion";
import "./Hero.css";

const Hero = () => {
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

          <Link to="/listing">
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
            src="https://www.architectureideas.info/wp-content/uploads/2019/05/modern-house.jpg"
            alt="Beautiful Exterior House"
            className="hero-bg-image"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;