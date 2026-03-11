import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PricingSection from './PricingSection';
import LicenseVerification from './LicenseVerification';
import CancellationPolicy from './CancellationPolicy';
import '../pages/ListingDetails.css'; // Use Dwellings ListingDetails CSS

function StarIcon({ size = 14 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#FF385C">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

const RATING_CATS = [
  { label: "Cleanliness", pct: 96, score: "4.8" },
  { label: "Accuracy", pct: 98, score: "4.9" },
  { label: "Communication", pct: 100, score: "5.0" },
  { label: "Location", pct: 90, score: "4.5" },
  { label: "Check-in", pct: 100, score: "5.0" },
  { label: "Value", pct: 88, score: "4.4" },
];

const DriveableDetail = ({ driveable, onClose }) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [selectedHours, setSelectedHours] = useState(1);
  const [selectedDays, setSelectedDays] = useState(0);
  const [licenseVerified, setLicenseVerified] = useState(false);
  const [bookingType, setBookingType] = useState('hourly'); // 'hourly' or 'daily'

  if (!driveable) return null;

  // We need 5 images for the gallery. If we only have 1, we duplicate it for visual matching.
  const allImages = driveable.images && driveable.images.length >= 5
    ? driveable.images
    : [driveable.image, driveable.image, driveable.image, driveable.image, driveable.image];

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

    // Calculate final price and duration for the payment page
    const totalPrice = calculateTotalPrice();
    const durationValue = bookingType === 'daily' ? selectedDays : selectedHours;
    const durationLabel = bookingType === 'daily' ? 'Days' : 'Hours';

    navigate('/payment', {
      state: {
        vehicle: driveable,
        bookingDetails: {
          totalPrice: totalPrice,
          duration: `${durationValue} ${durationLabel}`,
          bookingType: bookingType
        }
      }
    });
  };

  function fmt(n) {
    return "₹" + Number(n).toLocaleString("en-IN");
  }

  return (
    <div className="ld-root pb-5">
      <div className="ld-page" style={{ paddingTop: '28px' }}>

        {/* Back Button */}
        <button className="ld-back-btn" onClick={onClose}>
          ← Back to Listings
        </button>

        <nav className="ld-breadcrumb">
          <span className="ld-bc-link" onClick={onClose}>Driveables</span>
          <span className="ld-bc-sep">›</span>
          <span className="ld-bc-link">{driveable.location}</span>
          <span className="ld-bc-sep">›</span>
          <span className="ld-bc-link" style={{ textTransform: "capitalize" }}>{driveable.category}</span>
          <span className="ld-bc-sep">›</span>
          <span>{driveable.name}</span>
        </nav>

        <div className="ld-header-row">
          <div className="ld-header-left">
            <h1>{driveable.name}</h1>
            <div className="ld-header-meta">
              <span className="ld-star"><StarIcon /> {driveable.rating}</span>
              <span className="ld-dot">·</span>
              <span className="ld-ul">124 reviews</span>
              <span className="ld-dot">·</span>
              <span>🏅 Superhost</span>
              <span className="ld-dot">·</span>
              <span className="ld-ul">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ verticalAlign: "middle", marginRight: 2 }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                {driveable.location}, India
              </span>
            </div>
          </div>
          <div className="ld-header-actions">
            <button className="ld-act-btn" onClick={() => setSaved((s) => !s)}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill={saved ? "#FF385C" : "none"} stroke={saved ? "#FF385C" : "currentColor"} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {saved ? "Saved" : "Save"}
            </button>
            <button className="ld-act-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Share
            </button>
          </div>
        </div>

        // ...existing code...
<div className="ld-gallery">
  <img
    className="ld-gal-main"
    src={allImages[0]}
    alt={`${driveable.name} - main view`}
    style={{ objectFit: 'cover' }}
  />
  <div className="ld-gal-side">
    {allImages.slice(1, 5).map((img, i) => (
      <div key={i} className="ld-g-cell">
        <img
          src={img}
          alt={i < 3 ? `${driveable.name} - gallery view ${i + 2}` : ""}
          style={{ objectFit: 'cover' }}
        />
        {i === 3 && (
          <button className="ld-show-all-btn">
// ...existing code...
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                    </svg>
                    Show all photos
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="ld-layout">
          <div className="ld-left">

            <div className="ld-host-row">
              <div>
                <h2>Premium {driveable.category.replace(/s$/, "")} provided by RentifyX</h2>
                <p>
                  {driveable.specifications.seatingCapacity} seats &nbsp;·&nbsp;
                  {driveable.specifications.transmission} &nbsp;·&nbsp;
                  {driveable.specifications.fuelType || driveable.specifications.type}
                </p>
              </div>
              <div className="ld-av-wrap">
                <div className="ld-host-row-av" style={{ background: '#FF4D00', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                  R
                </div>
                <div className="ld-sh-dot">★</div>
              </div>
            </div>

            <div className="ld-divider" />

            <div className="ld-highlights">
              <div className="ld-hi">
                <span className="ld-hi-icon">🛡️</span>
                <div><strong>Comprehensive Insurance</strong><p>Drive with peace of mind. Full insurance coverage included in all our premium rentals.</p></div>
              </div>
              <div className="ld-hi">
                <span className="ld-hi-icon">🏆</span>
                <div><strong>Top Rated Vehicle</strong><p>This vehicle is highly rated by previous renters for its condition and performance.</p></div>
              </div>
              <div className="ld-hi">
                <span className="ld-hi-icon">🗓️</span>
                <div><strong>Free cancellation for 48 hours</strong><p>Cancel within 48 hours of booking for a full refund.</p></div>
              </div>
            </div>

            <div className="ld-divider" />

            <div className="ld-sec">
              <h2>About this vehicle</h2>
              <p className="ld-desc-txt">Experience the thrill of the open road with this premium {driveable.name}. Perfectly maintained and fully loaded with features, it's ready for your next adventure in {driveable.location}.</p>
            </div>

            <div className="ld-divider" />

            <div className="ld-sec">
              <h2>Specifications</h2>
              <div className="row g-3 mt-2">
                {Object.entries(driveable.specifications).map(([key, value]) => (
                  <div key={key} className="col-6 col-md-4">
                    <span className="text-muted small d-block" style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="fw-medium text-dark">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="ld-divider" />

            {/* License Verification */}
            <div className="mb-4">
              <LicenseVerification
                isVerified={licenseVerified}
                onVerificationComplete={() => setLicenseVerified(true)}
              />
            </div>

            {/* Cancellation Policy */}
            <CancellationPolicy />

          </div>

          <div className="ld-right">
            <div className="ld-sticky-box">
              <div className="ld-box-header">
                <span className="ld-box-price">{fmt(driveable.dayRate || driveable.hourlyRate * 10)}</span>
                <span className="ld-box-unit"> {driveable.dayRate ? '/ day' : '/ hr'}</span>
              </div>

              {/* Using the PricingSection directly in the box for continuity */}
              <div style={{ marginTop: '20px' }}>
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
              </div>

              <button
                className={`ld-reserve-btn mt-3`}
                onClick={handleBooking}
                style={{
                  background: licenseVerified ? 'var(--accent-gradient-btn)' : '#ccc',
                  pointerEvents: licenseVerified ? 'auto' : 'none',
                  cursor: licenseVerified ? 'pointer' : 'not-allowed'
                }}
              >
                {licenseVerified ? 'Book Now' : 'Verify License First'}
              </button>

              <div className="ld-breakdown mt-4">
                <div className="ld-br-row">
                  <span>Base Rate</span>
                  <span>{fmt(calculateTotalPrice())}</span>
                </div>
                <div className="ld-br-row">
                  <span>Service fee</span>
                  <span>{fmt(Math.round(calculateTotalPrice() * 0.05))}</span>
                </div>
                <div className="ld-br-total">
                  <span>Total</span>
                  <span>{fmt(calculateTotalPrice() + Math.round(calculateTotalPrice() * 0.05))}</span>
                </div>
              </div>

              <p className="ld-no-charge">You won't be charged yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriveableDetail;