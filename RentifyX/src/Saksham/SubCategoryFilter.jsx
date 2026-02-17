// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import './Driveables.css';

const SubCategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { id: 'all', label: 'All Vehicles', icon: '🚗' },
    { id: 'cars', label: 'Cars', icon: '🚗' },
    { id: 'bikes', label: 'Bikes & Scooters', icon: '🏍️' },
    { id: 'evs', label: 'EVs', icon: '⚡' },
    { id: 'bicycles', label: 'Bicycles', icon: '🚴' }
  ];

  return (
    <motion.div 
      className="subcategory-filter"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="filter-container">
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            className={`filter-button ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
          >
            <span className="filter-icon">{category.icon}</span>
            <span className="filter-label">{category.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default SubCategoryFilter;
