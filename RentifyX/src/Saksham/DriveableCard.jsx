import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Heart } from 'lucide-react';
import './Driveables.css';

const DriveableCard = ({ driveable, onViewDetails, index = 0, onToggleCompare, isSelectedForComparison, isCompareDisabled = false }) => {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className={`drv-listing-card ${isSelectedForComparison ? 'drv-card-selected' : ''}`}
      onClick={onViewDetails}
    >
      <div className="drv-listing-image-container">
        <img
          src={driveable.image}
          alt={driveable.name}
          className="drv-listing-image"
          loading="lazy"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="drv-like-button"
        >
          <Heart
            className={`drv-heart-icon ${liked ? 'liked' : ''}`}
            fill={liked ? 'currentColor' : 'none'}
            size={16}
          />
        </button>
        <div className="drv-badge drv-badge-category">
          {driveable.category.charAt(0).toUpperCase() + driveable.category.slice(1)}
        </div>
        {driveable.rating && (
          <div className="drv-badge drv-badge-rating">
            ★ {driveable.rating}
          </div>
        )}
      </div>

      <div className="drv-listing-content">
        <div className="drv-listing-header">
          <h3 className="drv-listing-title">{driveable.name}</h3>
          <div className="drv-listing-rating">
            <Star className="drv-star-icon" fill="currentColor" size={14} />
            <span className="drv-rating-score">{driveable.rating}</span>
          </div>
        </div>

        <div className="drv-listing-location">
          <MapPin className="drv-location-icon" size={14} />
          <span>{driveable.location}</span>
        </div>

        {/* Specs tags */}
        <div className="drv-specs-tags">
          {driveable.specifications?.fuelType && (
            <span className="drv-spec-tag">{driveable.specifications.fuelType}</span>
          )}
          {driveable.specifications?.transmission && (
            <span className="drv-spec-tag">{driveable.specifications.transmission}</span>
          )}
          {driveable.specifications?.seatingCapacity && (
            <span className="drv-spec-tag">{driveable.specifications.seatingCapacity} seats</span>
          )}
          {driveable.specifications?.type && (
            <span className="drv-spec-tag">{driveable.specifications.type}</span>
          )}
        </div>

        <div className="drv-listing-footer">
          <div>
            <span className="drv-listing-price">₹{driveable.price || driveable.hourlyRate}</span>
            <span className="drv-listing-price-unit">/{driveable.timespan || 'hr'}</span>
          </div>
          <div className="drv-card-actions">
            {/* Compare checkbox */}
            <label
              className="drv-compare-label"
              onClick={(e) => e.stopPropagation()}
              style={{ opacity: isCompareDisabled ? 0.6 : 1, cursor: isCompareDisabled ? 'not-allowed' : 'pointer' }}
            >
              <input
                type="checkbox"
                checked={isSelectedForComparison || false}
                disabled={isCompareDisabled}
                onChange={() => onToggleCompare && onToggleCompare(driveable)}
                className="drv-compare-checkbox"
                title={isCompareDisabled ? 'Compare vehicles of the same category only' : 'Add to comparison'}
              />
              Compare
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriveableCard;