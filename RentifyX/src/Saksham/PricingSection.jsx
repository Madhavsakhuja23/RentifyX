// Removed import './Driveables.css';

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
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title border-bottom pb-2 mb-3">Pricing Details</h5>
        
        {/* Booking Type Selection */}
        <div className="btn-group w-100 mb-4" role="group">
          <button 
            className={`btn ${bookingType === 'hourly' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => onBookingTypeChange('hourly')}
          >
            Hourly Basis
          </button>
          {dayRate && (
            <button 
              className={`btn ${bookingType === 'daily' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => onBookingTypeChange('daily')}
            >
              Daily Basis
            </button>
          )}
        </div>

        {/* Hourly Pricing Container */}
        {bookingType === 'hourly' && (
          <div className="bg-light p-3 rounded mb-4">
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted fw-medium">Base Rate (Hourly)</span>
              <span className="fw-bold">${hourlyRate}/hour</span>
            </div>
            <div className="d-flex justify-content-between mb-3 border-bottom pb-3">
              <span className="text-muted small">Extra charge for time exceeded</span>
              <span className="text-danger small">${extraChargeRate}/hour</span>
            </div>
            
            <div className="d-flex justify-content-between align-items-center">
              <label htmlFor="hours" className="form-label mb-0 fw-medium">Select Hours:</label>
              <div className="input-group w-auto" style={{ maxWidth: '140px' }}>
                <button 
                  className="btn btn-outline-secondary"
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
                  className="form-control text-center px-1"
                />
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => onHoursChange(Math.min(24, selectedHours + 1))}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Daily Pricing Container */}
        {bookingType === 'daily' && dayRate && (
          <div className="bg-light p-3 rounded mb-4">
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted fw-medium">Base Rate (Daily)</span>
              <span className="fw-bold">${dayRate}/day</span>
            </div>
            <div className="d-flex justify-content-between mb-3 border-bottom pb-3">
              <span className="text-muted small">Extra charge for time exceeded</span>
              <span className="text-danger small">${extraChargeRate}/hour</span>
            </div>
            
            <div className="d-flex justify-content-between align-items-center">
              <label htmlFor="days" className="form-label mb-0 fw-medium">Select Days:</label>
              <div className="input-group w-auto" style={{ maxWidth: '140px' }}>
                <button 
                  className="btn btn-outline-secondary"
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
                  className="form-control text-center px-1"
                />
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => onDaysChange(Math.min(30, (selectedDays || 1) + 1))}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="mt-3">
          <div className="d-flex justify-content-between text-muted mb-2">
            <span>Subtotal</span>
            <span>${calculateTotal()}</span>
          </div>
          <div className="d-flex justify-content-between text-muted mb-2">
            <span>Service Fee (5%)</span>
            <span>${(calculateTotal() * 0.05).toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between text-muted mb-3">
            <span>Insurance</span>
            <span>${(calculateTotal() * 0.10).toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between fw-bold fs-5 border-top pt-3">
            <span>Total</span>
            <span className="text-primary">${(calculateTotal() * 1.15).toFixed(2)}</span>
          </div>
        </div>

        {/* Note Alert */}
        <div className="alert alert-info d-flex align-items-start mt-4 mb-0 py-2" role="alert">
          <span className="me-2">💡</span>
          <p className="mb-0 small">
            <strong>Note:</strong> If you exceed your booking time, additional charges of <strong>${extraChargeRate}/hour</strong> will apply automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;