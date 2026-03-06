import { useState, useEffect } from 'react';
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
      className={`sticky-top w-100 transition-all ${scrolled ? 'bg-white shadow-sm py-2' : 'bg-transparent py-3'}`}
      style={{ zIndex: 1020, transition: 'background-color 0.3s ease, padding 0.3s ease' }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="container d-flex flex-wrap justify-content-between align-items-center">
        
        {/* Brand/Logo */}
        <div className={`fw-bold fs-4 mb-2 mb-md-0 ${scrolled ? 'text-dark' : 'text-white'}`}>
          RentifyX
        </div>

        {/* Filter Buttons */}
        <div className="d-flex flex-wrap gap-2">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              className={`btn rounded-pill px-3 fw-medium ${
                selectedCategory === cat.id 
                  ? 'btn-primary' 
                  : scrolled ? 'btn-outline-dark' : 'btn-outline-light'
              }`}
              onClick={() => onCategoryChange(cat.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Empty div to balance flex spacing if you add actions later */}
        <div className="d-none d-lg-block" style={{ width: '80px' }}></div>
      </div>
    </motion.nav>
  );
};

export default Navbar;