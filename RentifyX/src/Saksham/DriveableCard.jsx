import { useState, useCallback } from 'react';
import { Star, MapPin, Heart } from 'lucide-react';
import './Driveables.css';

// ── Wishlist helpers (same localStorage key used by Profile > Favourites) ──
const getFavourites = () => {
  try { return JSON.parse(localStorage.getItem('favourites') || '[]'); }
  catch { return []; }
};

const isInFavourites = (id) => getFavourites().some((f) => f.id === id);

const toggleFavourite = (vehicle) => {
  const favs = getFavourites();
  const idx = favs.findIndex((f) => f.id === vehicle.id);
  if (idx !== -1) {
    favs.splice(idx, 1);
  } else {
    favs.push({
      id: vehicle.id,
      name: vehicle.name || vehicle.title,
      image: vehicle.image,
      location: vehicle.location,
      price: vehicle.hourlyRate || vehicle.dayRate || 0,
      priceUnit: vehicle.dayRate ? 'day' : 'hr',
      type: 'driveable',
      category: vehicle.category,
    });
  }
  localStorage.setItem('favourites', JSON.stringify(favs));
  // Notify other tabs / Profile page
  window.dispatchEvent(new Event('storage'));
  return idx === -1; // returns true if NOW added
};

const DriveableCard = ({
  driveable,
  onViewDetails,
  index = 0,
  onToggleCompare,
  isSelectedForComparison,
  isCompareDisabled = false,
}) => {
  const [liked, setLiked] = useState(() => isInFavourites(driveable.id));

  const handleHeartClick = useCallback(
    (e) => {
      e.stopPropagation();

      // Require auth
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        window.location.href = '/login';
        return;
      }

      const nowLiked = toggleFavourite(driveable);
      setLiked(nowLiked);
    },
    [driveable]
  );

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
        <button onClick={handleHeartClick} className="drv-like-button" title={liked ? 'Remove from wishlist' : 'Add to wishlist'}>
          <Heart
            className={`drv-heart-icon ${liked ? 'liked' : ''}`}
            fill={liked ? 'currentColor' : 'none'}
            size={16}
          />
        </button>
        <div className="drv-badge drv-badge-category">
          {driveable.category
            ? driveable.category.charAt(0).toUpperCase() + driveable.category.slice(1)
            : 'Vehicle'}
        </div>
        {driveable.rating && (
          <div className="drv-badge drv-badge-rating">★ {driveable.rating}</div>
        )}
      </div>

      <div className="drv-listing-content">
        <div className="drv-listing-header">
          <h3 className="drv-listing-title">{driveable.name || driveable.title}</h3>
          <div className="drv-listing-rating">
            <Star className="drv-star-icon" fill="currentColor" size={14} />
            <span className="drv-rating-score">{driveable.rating || 4.5}</span>
          </div>
        </div>

        <div className="drv-listing-location">
          <MapPin className="drv-location-icon" size={14} />
          <span>{driveable.location || 'Bangalore, Karnataka'}</span>
        </div>

        {/* Specs tags */}
        <div className="drv-specs-tags">
          {(driveable.specifications?.fuelType ||
            (driveable.subcategory === 'EV' ? 'Electric' : null)) && (
            <span className="drv-spec-tag">
              {driveable.specifications?.fuelType || 'Electric'}
            </span>
          )}
          {driveable.tagline && (
            <span className="drv-spec-tag bg-light text-dark border-0">
              {driveable.tagline}
            </span>
          )}
          {driveable.specifications?.transmission && (
            <span className="drv-spec-tag">
              {driveable.specifications.transmission}
            </span>
          )}
        </div>

        <div className="drv-listing-footer">
          <div>
            <span className="drv-listing-price">
              ₹{driveable.hourlyRate
                  || parseInt(String(driveable.price || '0').replace(/[^0-9]/g, ''), 10)
                  || 0}
            </span>
            <span className="drv-listing-price-unit">/hr</span>
          </div>
          <div className="drv-card-actions">
            {/* Compare checkbox */}
            <label
              className="drv-compare-label"
              onClick={(e) => e.stopPropagation()}
              style={{
                opacity: isCompareDisabled ? 0.6 : 1,
                cursor: isCompareDisabled ? 'not-allowed' : 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={isSelectedForComparison || false}
                disabled={isCompareDisabled}
                onChange={() => onToggleCompare && onToggleCompare(driveable)}
                className="drv-compare-checkbox"
                title={
                  isCompareDisabled
                    ? 'Compare vehicles of the same category only'
                    : 'Add to comparison'
                }
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