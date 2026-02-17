import './Driveables.css';

const PricingSection = ({ 
  hourlyRate, 
  dayRate, 
  selectedHours, 
  selectedDays, 
  bookingType,
  onHoursChange, 
  onDaysChange,
  onBookingTypeChange,
  calculateTotal 
}) => {
  const extraChargeRate = Math.ceil(hourlyRate * 1.5);

  return (
    <div className="pricing-section">
      <h3>Pricing Details</h3>
      
      {/* Booking Type Selection */}
      <div className="booking-type-selector">
        <button 
          className={`type-btn ${bookingType === 'hourly' ? 'active' : ''}`}
          onClick={() => onBookingTypeChange('hourly')}
        >
          Hourly Basis
        </button>
        {dayRate && (
          <button 
            className={`type-btn ${bookingType === 'daily' ? 'active' : ''}`}
            onClick={() => onBookingTypeChange('daily')}
          >
            Daily Basis
          </button>
        )}
      </div>

      {/* Hourly Pricing */}
      {bookingType === 'hourly' && (
        <div className="pricing-option">
          <div className="price-info">
            <div className="price-row">
              <span className="price-label">Base Rate (Hourly)</span>
              <span className="price-amount">${hourlyRate}/hour</span>
            </div>
            <div className="price-row subtitle">
              <span className="price-label">Extra charge for time exceeded</span>
              <span className="price-amount">${extraChargeRate}/hour</span>
            </div>
          </div>
          
          <div className="duration-selector">
            <label htmlFor="hours">Select Hours:</label>
            <div className="input-group">
              <button 
                className="quantity-btn"
                onClick={() => onHoursChange(Math.max(1, selectedHours - 1))}
              >
                -
              </button>
              <input 
                id="hours"
                type="number" 
                min="1" 
                max="24"
                value={selectedHours}
                onChange={(e) => onHoursChange(Math.max(1, parseInt(e.target.value) || 1))}
                className="quantity-input"
              />
              <button 
                className="quantity-btn"
                onClick={() => onHoursChange(Math.min(24, selectedHours + 1))}
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daily Pricing */}
      {bookingType === 'daily' && dayRate && (
        <div className="pricing-option">
          <div className="price-info">
            <div className="price-row">
              <span className="price-label">Base Rate (Daily)</span>
              <span className="price-amount">${dayRate}/day</span>
            </div>
            <div className="price-row subtitle">
              <span className="price-label">Extra charge for time exceeded</span>
              <span className="price-amount">${extraChargeRate}/hour</span>
            </div>
          </div>
          
          <div className="duration-selector">
            <label htmlFor="days">Select Days:</label>
            <div className="input-group">
              <button 
                className="quantity-btn"
                onClick={() => onDaysChange(Math.max(1, selectedDays - 1))}
              >
                -
              </button>
              <input 
                id="days"
                type="number" 
                min="1" 
                max="30"
                value={selectedDays || 1}
                onChange={(e) => onDaysChange(Math.max(1, parseInt(e.target.value) || 1))}
                className="quantity-input"
              />
              <button 
                className="quantity-btn"
                onClick={() => onDaysChange(Math.min(30, (selectedDays || 1) + 1))}
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="price-breakdown">
        <div className="breakdown-row">
          <span>Subtotal</span>
          <span>${calculateTotal()}</span>
        </div>
        <div className="breakdown-row">
          <span>Service Fee (5%)</span>
          <span>${(calculateTotal() * 0.05).toFixed(2)}</span>
        </div>
        <div className="breakdown-row">
          <span>Insurance</span>
          <span>${(calculateTotal() * 0.10).toFixed(2)}</span>
        </div>
        <div className="breakdown-row total">
          <span><strong>Total</strong></span>
          <span><strong>${(calculateTotal() * 1.15).toFixed(2)}</strong></span>
        </div>
      </div>

      <div className="pricing-note">
        <p>💡 <strong>Note:</strong> If you exceed your booking time, additional charges of <strong>${extraChargeRate}/hour</strong> will apply automatically.</p>
      </div>
    </div>
  );
};

export default PricingSection;
