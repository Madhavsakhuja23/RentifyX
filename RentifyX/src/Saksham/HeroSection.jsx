// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import toyotaFortunerImg from '../assets/toyota-fortuner.webp';

const HeroSection = ({ onExplore }) => {
  return (
    <section className="hero-section" id="home">
      {/* Background elements */}
      <div className="hero-bg-elements">
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />
        <div className="hero-circle" />
        <div className="hero-circle-inner" />
      </div>

      {/* Hero Content */}
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
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
          >
            Browse Fleet
          </motion.button>
          <motion.button
            className="hero-btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Know More
          </motion.button>
        </motion.div>

        <motion.div
          className="hero-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="hero-stat">
            <span className="hero-stat-value">20+</span>
            <span className="hero-stat-label">Vehicles</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">4.7★</span>
            <span className="hero-stat-label">Avg. Rating</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">1K+</span>
            <span className="hero-stat-label">Happy Riders</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">24/7</span>
            <span className="hero-stat-label">Support</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Hero Car Image */}
      <motion.div
        className="hero-car-container"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.9, ease: 'easeOut' }}
      >
        <motion.img
          src={toyotaFortunerImg}
          alt="Premium rental vehicle"
          className="hero-car-img"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
