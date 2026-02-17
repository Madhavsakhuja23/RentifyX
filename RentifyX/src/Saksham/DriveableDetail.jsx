import { useState } from 'react';
import PricingSection from './PricingSection';
import LicenseVerification from './LicenseVerification';
import CancellationPolicy from './CancellationPolicy';
import './Driveables.css';

const DriveableDetail = ({ driveable, onClose }) => {
  const [selectedHours, setSelectedHours] = useState(1);
  const [selectedDays, setSelectedDays] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [licenseVerified, setLicenseVerified] = useState(false);
  const [bookingType, setBookingType] = useState('hourly'); // 'hourly' or 'daily'

  if (!driveable) return null;

  const calculateTotalPrice = () => {
    if (bookingType === 'daily' && driveable.dayRate) {
      return selectedDays * driveable.dayRate;
    }
    return selectedHours * driveable.hourlyRate;
  };

  const handleBooking = () => {
    if (!licenseVerified) {
      alert('Please verify your driving license first!');
      return;
    }
    setShowBookingForm(true);
  };

  const confirmBooking = () => {
    alert('Booking confirmed! You will receive a confirmation email shortly.');
    setShowBookingForm(false);
    onClose();
  };

  return (
    <div className="detail-page">
      <button className="back-button" onClick={onClose}>
        ← Back to Listings
      </button>

      <div className="detail-container">
        {/* Image Gallery */}
        <div className="detail-image-section">
          <img src={driveable.image} alt="Vehicle rental image" className="detail-main-image" />
          <div className="image-gallery">
            <img src={driveable.image} alt="" className="gallery-thumb" />
            <img src={driveable.image} alt="" className="gallery-thumb" />
            <img src={driveable.image} alt="" className="gallery-thumb" />
          </div>
        </div>

        {/* Detail Info */}
        <div className="detail-info-section">
          <div className="detail-header">
            <h1>{driveable.name}</h1>
            <div className="detail-meta">
              <span className="rating">⭐ {driveable.rating}</span>
              <span className="location">📍 {driveable.location}</span>
            </div>
          </div>

          {/* Specifications */}
          <div className="specifications-section">
            <h3>Specifications</h3>
            <div className="specs-grid">
              {Object.entries(driveable.specifications).map(([key, value]) => (
                <div key={key} className="spec-detail">
                  <span className="spec-key">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="spec-value">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <PricingSection 
            hourlyRate={driveable.hourlyRate}
            dayRate={driveable.dayRate}
            selectedHours={selectedHours}
            selectedDays={selectedDays}
            bookingType={bookingType}
            onHoursChange={setSelectedHours}
            onDaysChange={setSelectedDays}
            onBookingTypeChange={setBookingType}
            calculateTotal={calculateTotalPrice}
          />

          {/* License Verification */}
          <LicenseVerification 
            isVerified={licenseVerified}
            onVerificationComplete={() => setLicenseVerified(true)}
          />

          {/* Features */}
          <div className="features-section">
            <h3>Features & Amenities</h3>
            <ul className="features-list">
              <li>✓ Comprehensive Insurance Coverage</li>
              <li>✓ 24/7 Roadside Assistance</li>
              <li>✓ GPS Navigation Included</li>
              <li>✓ Fuel/Charge Included (for EVs)</li>
              <li>✓ Regular Maintenance & Sanitization</li>
              <li>✓ Flexible Pick-up & Drop-off</li>
            </ul>
          </div>

          {/* Cancellation Policy */}
          <CancellationPolicy />

          {/* Booking Button */}
          <div className="booking-action">
            <button 
              className="book-now-btn"
              onClick={handleBooking}
              disabled={!licenseVerified}
            >
              {licenseVerified ? 'Book Now' : 'Verify License to Book'}
            </button>
            <p className="total-price">
              Total: <strong>${calculateTotalPrice()}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {showBookingForm && (
        <div className="modal-overlay">
          <div className="modal-content booking-modal">
            <h2>Confirm Your Booking</h2>
            <div className="booking-summary">
              <p><strong>Vehicle:</strong> {driveable.name}</p>
              <p><strong>Duration:</strong> {bookingType === 'daily' ? `${selectedDays} day(s)` : `${selectedHours} hour(s)`}</p>
              <p><strong>Total Amount:</strong> ${calculateTotalPrice()}</p>
              <p className="extra-charge-notice">
                * Extra charges of ${Math.ceil(driveable.hourlyRate * 1.5)}/hour apply for time exceeded
              </p>
            </div>
            <div className="booking-form">
              <input type="text" placeholder="Full Name" aria-label="Full Name" className="form-input" />
              <input type="email" placeholder="Email" aria-label="Email Address" className="form-input" />
              <input type="tel" placeholder="Phone Number" aria-label="Phone Number" className="form-input" />
              <input type="datetime-local" placeholder="Pick-up Time" aria-label="Pick-up Time" className="form-input" />
            </div>
            <div className="modal-actions">
              <button className="btn-confirm" onClick={confirmBooking}>Confirm Booking</button>
              <button className="btn-cancel" onClick={() => setShowBookingForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriveableDetail;
