import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'cars', label: 'Cars' },
  { id: 'bikes', label: 'Bikes' },
  { id: 'evs', label: 'EVs' },
  { id: 'bicycles', label: 'Bicycles' }
];

const Navbar = ({ selectedCategory, onCategoryChange }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="nav-logo">
        {/* <div className="logo-icon"></div> */}
        <span>RentifyX</span>
      </div>

      <div className="nav-filters">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            className={`nav-filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>

      <div className="nav-actions">
        {/* <motion.button
          className="nav-signup-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sign Up
        </motion.button> */}
      </div>
    </motion.nav>
  );
};

export default Navbar;
