import { useState, useCallback, useEffect } from 'react';
import { Star, MapPin, Heart } from 'lucide-react';
import api, { addToWishlistApi, removeFromWishlistApi } from '../api';
import './Driveables.css';



const DriveableCard = ({
  driveable,
  onViewDetails,
  index = 0,
  onToggleCompare,
  isSelectedForComparison,
  isCompareDisabled = false,
  isWishlisted = false,
}) => {
  const [liked, setLiked] = useState(isWishlisted);

  useEffect(() => {
    setLiked(isWishlisted);
  }, [isWishlisted]);

  const handleHeartClick = useCallback(
    async (e) => {
      e.stopPropagation();

      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        const id = driveable.id || driveable._id;
        if (liked) {
          await removeFromWishlistApi(id);
        } else {
          await addToWishlistApi(id);
        }
        
        const nowLiked = !liked;
        setLiked(nowLiked);

        // Update legacy localStorage for other components
        const favs = JSON.parse(localStorage.getItem('favourites') || '[]');
        if (nowLiked) {
          if (!favs.some(f => f.id === id)) {
            favs.push({
              id,
              name: driveable.name || driveable.title,
              image: driveable.image,
              location: driveable.location,
              price: driveable.hourlyRate || driveable.dayRate || 0,
              priceUnit: driveable.dayRate ? 'day' : 'hr',
              type: 'driveable',
              category: driveable.category,
            });
          }
        } else {
          const idx = favs.findIndex(f => f.id === id);
          if (idx !== -1) favs.splice(idx, 1);
        }
        localStorage.setItem('favourites', JSON.stringify(favs));
        window.dispatchEvent(new Event('storage'));
      } catch (err) {
        console.error("Error toggling wishlist:", err);
      }
    },
    [driveable, liked]
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