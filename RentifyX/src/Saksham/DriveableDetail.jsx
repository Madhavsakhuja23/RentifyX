import { useState } from 'react';
import PricingSection from './PricingSection';
import LicenseVerification from './LicenseVerification';
import CancellationPolicy from './CancellationPolicy';
import BookingConfirmationModal from './BookingConfirmationModal';
// import './Driveables.css'; // Removed custom CSS

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

  return (
    <div className="container py-4">
      {/* Back Button */}
      <button className="btn btn-link text-decoration-none text-dark mb-4 ps-0" onClick={onClose}>
        &larr; Back to Listings
      </button>

      <div className="row g-5">
        {/* Left Column: Image Gallery */}
        <div className="col-lg-6">
          <img 
            src={driveable.image} 
            alt={`${driveable.name} rental`} 
            className="img-fluid rounded shadow-sm w-100 mb-3" 
            style={{ objectFit: 'cover', maxHeight: '400px' }} 
          />
          <div className="d-flex gap-2 overflow-auto pb-2">
            {[1, 2, 3].map((_, i) => (
              <img 
                key={i} 
                src={driveable.image} 
                alt="thumbnail" 
                className="rounded border" 
                style={{ width: '80px', height: '60px', objectFit: 'cover', cursor: 'pointer' }} 
              />
            ))}
          </div>
        </div>

        {/* Right Column: Detail Info */}
        <div className="col-lg-6">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h1 className="h2 fw-bold mb-0">{driveable.name}</h1>
            <span className="badge bg-warning text-dark fs-6 shadow-sm">⭐ {driveable.rating}</span>
          </div>
          <p className="text-muted mb-4">📍 {driveable.location}</p>

          {/* Specifications */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title border-bottom pb-2 mb-3">Specifications</h5>
              <div className="row g-2">
                {Object.entries(driveable.specifications).map(([key, value]) => (
                  <div key={key} className="col-6 col-md-4">
                    <span className="text-muted small d-block">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="fw-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Section (Assuming you will also update PricingSection.jsx to use Bootstrap) */}
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

          {/* License Verification (Assuming you will also update LicenseVerification.jsx to use Bootstrap) */}
          <div className="mb-4">
            <LicenseVerification 
              isVerified={licenseVerified}
              onVerificationComplete={() => setLicenseVerified(true)}
            />
          </div>

          {/* Features */}
          <div className="mb-4">
            <h5 className="border-bottom pb-2 mb-3">Features & Amenities</h5>
            <ul className="list-unstyled row g-2">
              <li className="col-md-6"><span className="text-success me-2">✓</span>Comprehensive Insurance Coverage</li>
              <li className="col-md-6"><span className="text-success me-2">✓</span>24/7 Roadside Assistance</li>
              <li className="col-md-6"><span className="text-success me-2">✓</span>GPS Navigation Included</li>
              <li className="col-md-6"><span className="text-success me-2">✓</span>Fuel/Charge Included (for EVs)</li>
              <li className="col-md-6"><span className="text-success me-2">✓</span>Regular Maintenance & Sanitization</li>
              <li className="col-md-6"><span className="text-success me-2">✓</span>Flexible Pick-up & Drop-off</li>
            </ul>
          </div>

          {/* Cancellation Policy */}
          <CancellationPolicy />

          {/* Booking Action Bottom Bar */}
          <div className="bg-light p-4 rounded shadow-sm d-flex justify-content-between align-items-center mt-4 border">
            <div>
              <span className="text-muted d-block small">Total Estimated Price</span>
              <span className="h3 fw-bold text-primary mb-0">${calculateTotalPrice()}</span>
            </div>
            <button 
              className={`btn btn-lg ${licenseVerified ? 'btn-primary' : 'btn-secondary'}`}
              onClick={handleBooking}
            >
              {licenseVerified ? 'Book Now' : 'Verify License to Book'}
            </button>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      <BookingConfirmationModal
        show={showBookingForm}
        onClose={() => setShowBookingForm(false)}
        vehicle={driveable}
        totalPrice={calculateTotalPrice()}
        bookingType={bookingType}
        duration={bookingType === 'daily' ? selectedDays : selectedHours}
      />
    </div>
  );
};

export default DriveableDetail;