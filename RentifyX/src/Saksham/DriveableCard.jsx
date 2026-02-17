// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import './Driveables.css';

const DriveableCard = ({ driveable, onViewDetails, index = 0 }) => {
  return (
    <motion.div 
      className="driveable-card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100 
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      layout
      onClick={onViewDetails}
    >
      <motion.div className="card-image-container">
        <motion.img 
          src={driveable.image} 
          alt={`${driveable.name} rental vehicle`} 
          className="card-image"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
        />
        <span className="category-badge">
          {driveable.category.charAt(0).toUpperCase() + driveable.category.slice(1)}
        </span>
        {driveable.rating && (
          <div className="rating-badge">{driveable.rating}</div>
        )}
      </motion.div>

      <div className="card-content">
        <h3 className="card-title">{driveable.name}</h3>
        <p className="card-location">{driveable.location}</p>

        <div className="card-specs">
          {driveable.specifications.fuelType && (
            <span className="spec-item">{driveable.specifications.fuelType}</span>
          )}
          {driveable.specifications.transmission && (
            <span className="spec-item">{driveable.specifications.transmission}</span>
          )}
          {driveable.specifications.seatingCapacity && (
            <span className="spec-item">{driveable.specifications.seatingCapacity} seats</span>
          )}
          {driveable.specifications.range && (
            <span className="spec-item">{driveable.specifications.range}</span>
          )}
          {driveable.specifications.type && (
            <span className="spec-item">{driveable.specifications.type}</span>
          )}
          {driveable.specifications.gears && (
            <span className="spec-item">{driveable.specifications.gears}</span>
          )}
        </div>

        <div className="card-footer">
          <div className="card-pricing">
            <div className="price-item">
              <span className="price-label">From</span>
              <span className="price-value">${driveable.hourlyRate}/hr</span>
            </div>
          </div>
          <motion.button 
            className="view-details-btn"
            onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Details →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default DriveableCard;
