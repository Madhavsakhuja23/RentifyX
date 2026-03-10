import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// You can keep this import if you have any specific overrides, 
// but the layout is now primarily handled by Bootstrap.
import './Driveables.css'; 

const DriveableCard = ({ driveable, onViewDetails, index = 0, onToggleCompare, isSelectedForComparison }) => {
  const navigate = useNavigate();

  const handleRentNow = (e) => {
    e.stopPropagation();
    navigate('/payment', { state: { vehicle: driveable } });
  };

  return (
    <motion.div 
      className={`card h-100 shadow-sm border-0 overflow-hidden ${isSelectedForComparison ? 'ring-2 ring-primary' : ''}`}
      style={{ cursor: 'pointer', borderColor: isSelectedForComparison ? '#FF4D00' : 'transparent', borderWidth: isSelectedForComparison ? '2px' : '0' }}
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
        boxShadow: "0 10px 20px rgba(0,0,0,0.1)", // Enhances the lift effect
        transition: { duration: 0.2 }
      }}
      layout
      onClick={onViewDetails}
    >
      {/* Image Container */}
      <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
        <motion.img 
          src={driveable.image} 
          alt={`${driveable.name} rental vehicle`} 
          className="w-100 h-100"
          style={{ objectFit: 'cover' }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Category Badge */}
        <span className="position-absolute top-0 start-0 m-3 badge bg-dark bg-opacity-75 fs-6 shadow-sm">
          {driveable.category.charAt(0).toUpperCase() + driveable.category.slice(1)}
        </span>
        
        {/* Rating Badge */}
        {driveable.rating && (
          <div className="position-absolute top-0 end-0 m-3 badge bg-warning text-dark fw-bold shadow-sm">
            ★ {driveable.rating}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold mb-1">{driveable.name}</h5>
        <p className="card-text text-muted small mb-3">
          📍 {driveable.location}
        </p>

        {/* Specifications Tags */}
        <div className="d-flex flex-wrap gap-2 mb-3 mt-auto">
          {driveable.specifications.fuelType && (
            <span className="badge bg-light border text-dark fw-normal">{driveable.specifications.fuelType}</span>
          )}
          {driveable.specifications.transmission && (
            <span className="badge bg-light border text-dark fw-normal">{driveable.specifications.transmission}</span>
          )}
          {driveable.specifications.seatingCapacity && (
            <span className="badge bg-light border text-dark fw-normal">{driveable.specifications.seatingCapacity} seats</span>
          )}
          {driveable.specifications.range && (
            <span className="badge bg-light border text-dark fw-normal">{driveable.specifications.range}</span>
          )}
          {driveable.specifications.type && (
            <span className="badge bg-light border text-dark fw-normal">{driveable.specifications.type}</span>
          )}
          {driveable.specifications.gears && (
            <span className="badge bg-light border text-dark fw-normal">{driveable.specifications.gears}</span>
          )}
        </div>
      </div>

      {/* Card Footer with Pricing and Actions */}
      <div className="card-footer bg-white border-top py-2 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
        {/* 1. Left - Rate */}
        <div className="text-center text-sm-start order-1 order-sm-1">
          <span className="text-muted small d-block" style={{ lineHeight: '1' }}>From</span>
          <span className="fs-6 fw-bold text-primary">
            ₹{driveable.hourlyRate}<span className="small text-muted fw-normal">/hr</span>
          </span>
        </div>
        
        {/* 2. Middle - Button */}
        <div className="text-center order-2 order-sm-2 my-1 my-sm-0 d-flex gap-2">
          <motion.button 
            className="btn btn-outline-primary btn-sm px-3 rounded-pill shadow-sm"
            onClick={(e) => { 
              e.stopPropagation(); 
              onViewDetails(); 
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Details
          </motion.button>
          
          <motion.button 
            className="btn btn-primary btn-sm px-3 rounded-pill shadow-sm"
            onClick={handleRentNow}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Rent
          </motion.button>
        </div>

        {/* 3. Right - Compare */}
        <div className="d-flex align-items-center text-center text-sm-end order-3 order-sm-3" onClick={(e) => e.stopPropagation()}>
          <div className="form-check d-flex align-items-center m-0">
            <input 
              className="form-check-input me-2 shadow-sm" 
              type="checkbox" 
              id={`compare-${driveable.id}`}
              checked={isSelectedForComparison || false}
              onChange={() => onToggleCompare && onToggleCompare(driveable)}
              style={{ cursor: 'pointer', marginTop: 0 }}
            />
            <label className="form-check-label small user-select-none mb-0 text-muted fw-medium" htmlFor={`compare-${driveable.id}`} style={{ cursor: 'pointer', fontSize: '0.85rem' }}>
              Compare
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DriveableCard;