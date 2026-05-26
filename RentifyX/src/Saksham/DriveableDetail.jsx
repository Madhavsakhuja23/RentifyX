import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PricingSection from './PricingSection';
import LicenseVerification from './LicenseVerification';
import CancellationPolicy from './CancellationPolicy';
import { getWishlistApi, addToWishlistApi, removeFromWishlistApi } from '../api';
import toast from 'react-hot-toast';
import '../pages/ListingDetails.css';

// ── tiny helpers ──────────────────────────────────────────────────────────────
function StarIcon({ size = 14 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#FF385C">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

const RATING_CATS = [
  { label: 'Cleanliness',    pct: 96,  score: '4.8' },
  { label: 'Accuracy',       pct: 98,  score: '4.9' },
  { label: 'Communication',  pct: 100, score: '5.0' },
  { label: 'Location',       pct: 90,  score: '4.5' },
  { label: 'Check-in',       pct: 100, score: '5.0' },
  { label: 'Value',          pct: 88,  score: '4.4' },
];

const BASE_URL = 'https://rentifyx-ff33.onrender.com/api';

const DriveableDetail = ({ driveable, onClose }) => {
  const navigate = useNavigate();

  // ── UI state ──────────────────────────────────────────────────────────────
  const [saved,            setSaved]            = useState(false);
  const [selectedHours,    setSelectedHours]    = useState(1);
  const [selectedDays,     setSelectedDays]     = useState(1);
  const [licenseVerified,  setLicenseVerified]  = useState(false);
  const [bookingType,      setBookingType]      = useState('hourly');
  const [lbIndex,          setLbIndex]          = useState(null);

  // ── Date / availability state ─────────────────────────────────────────────
  const [startDate,        setStartDate]        = useState('');
  const [endDate,          setEndDate]          = useState('');
  const [availability,     setAvailability]     = useState(null);
  //  availability shape: { checking: bool, conflict: bool } | null
  const debounceRef = useRef(null);

  // ── Lightbox scroll-lock ──────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = lbIndex !== null ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [lbIndex]);

  // ── Check wishlist status ───────────────────────────────────────────────
  useEffect(() => {
    const checkWishlist = async () => {
      const token = localStorage.getItem('token');
      if (!token || !driveable) return;
      try {
        const wRes = await getWishlistApi();
        const isSaved = (wRes.listings || []).some(l => (l._id || l.id) === (driveable.id || driveable._id));
        setSaved(isSaved);
      } catch (err) {
        console.error("Error checking wishlist:", err);
      }
    };
    checkWishlist();
  }, [driveable]);

  // ── Availability check (debounced 600 ms) ────────────────────────────────
  useEffect(() => {
    if (!startDate || !endDate || new Date(endDate) <= new Date(startDate)) {
      setAvailability(null);
      return;
    }

    setAvailability({ checking: true, conflict: false });

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        // GET all bookings for this vehicle and check client-side for overlap
        const res = await fetch(`${BASE_URL}/listings`);
        const all = await res.json();
        const vehicle = Array.isArray(all)
          ? all.find((v) => v._id === driveable.id || v._id === driveable._id)
          : null;

        if (!vehicle) {
          setAvailability({ checking: false, conflict: false });
          return;
        }

        const reqStart = new Date(startDate);
        const reqEnd   = new Date(endDate);

        const hasConflict = (vehicle.bookings || []).some((b) => {
          const bStart = new Date(b.startDate);
          const bEnd   = new Date(b.endDate);
          return reqStart < bEnd && reqEnd > bStart;
        });

        setAvailability({ checking: false, conflict: hasConflict });
      } catch {
        // If check fails, let user proceed (backend will still enforce on book)
        setAvailability({ checking: false, conflict: false });
      }
    }, 600);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [startDate, endDate, driveable.id, driveable._id]);

  if (!driveable) return null;

  // ── Gallery images ────────────────────────────────────────────────────────
  const allImages =
    driveable.images && driveable.images.length > 0
      ? typeof driveable.images[0] === 'string'
        ? driveable.images
        : driveable.images.map((img) => img.url)
      : [driveable.image, driveable.image, driveable.image, driveable.image, driveable.image];

  const lbNav = (delta) =>
    setLbIndex((prev) => (prev + delta + allImages.length) % allImages.length);

  // ── Price calculation ─────────────────────────────────────────────────────
  // driveable.hourlyRate / dayRate are set by normalizeListing in DriveablesMain
  const calculateTotalPrice = () => {
    // If dates are set, derive price from actual duration
    if (startDate && endDate) {
      const diffHours = (new Date(endDate) - new Date(startDate)) / 3_600_000;
      if (diffHours <= 0) return 0;
      if (bookingType === 'daily' && driveable.dayRate) {
        return Math.ceil(diffHours / 24) * driveable.dayRate;
      }
      return Math.ceil(diffHours) * (driveable.hourlyRate || 0);
    }
    // Fallback to manual selector
    if (bookingType === 'daily' && driveable.dayRate) {
      return selectedDays * driveable.dayRate;
    }
    const rate = driveable.hourlyRate
      || (typeof driveable.price === 'string'
            ? parseInt(driveable.price.replace(/[^0-9]/g, ''), 10)
            : Number(driveable.price))
      || 0;
    return selectedHours * rate;
  };

  // ── Auth guard ────────────────────────────────────────────────────────────
  const checkAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('currentUser');
    if (!token) { window.location.href = '/login'; return false; }
    return true;
  };

  // ── Can book? ─────────────────────────────────────────────────────────────
  // Requires: license verified + both dates filled + end > start + no conflict
  const datesValid = startDate && endDate && new Date(endDate) > new Date(startDate);
  const canBook =
    licenseVerified &&
    datesValid &&
    availability &&
    !availability.checking &&
    !availability.conflict;

  // ── Booking handler ───────────────────────────────────────────────────────
  const handleBooking = () => {
    if (!checkAuth()) return;
    if (!licenseVerified) {
      toast.error('Please verify your driving license first!');
      return;
    }
    if (availability?.conflict) {
      toast.error('This vehicle is already booked for the selected period. Please choose different dates.');
      return;
    }

    const totalPrice   = calculateTotalPrice();
    const durationHrs  = startDate && endDate
      ? (new Date(endDate) - new Date(startDate)) / 3_600_000
      : bookingType === 'daily' ? selectedDays * 24 : selectedHours;
    const durationLabel = durationHrs >= 24
      ? `${Math.ceil(durationHrs / 24)} Day(s)`
      : `${Math.ceil(durationHrs)} Hour(s)`;

    navigate('/payment', {
      state: {
        vehicle: driveable,
        bookingDetails: {
          totalPrice,
          duration:    durationLabel,
          bookingType,
          startDate:   startDate || null,
          endDate:     endDate   || null,
        },
      },
    });
  };

  function fmt(n) { return '₹' + Number(n).toLocaleString('en-IN'); }

  function Lightbox({ images, index, onClose, onNav }) {
    return (
      <div className="ld-lb" onClick={onClose}>
        <button className="ld-lb-close" onClick={onClose}>✕</button>
        <button className="ld-lb-arrow ld-lb-prev" onClick={(e) => { e.stopPropagation(); onNav(-1); }}>&#8249;</button>
        <img src={images[index]} alt="" onClick={(e) => e.stopPropagation()} />
        <button className="ld-lb-arrow ld-lb-next" onClick={(e) => { e.stopPropagation(); onNav(1); }}>&#8250;</button>
        <div className="ld-lb-counter">{index + 1} / {images.length}</div>
      </div>
    );
  }

  return (
    <div className="ld-root pb-5">
      {lbIndex !== null && (
        <Lightbox images={allImages} index={lbIndex} onClose={() => setLbIndex(null)} onNav={lbNav} />
      )}

      <div className="ld-page" style={{ paddingTop: 28 }}>

        {/* Back */}
        <button className="ld-back-btn" onClick={onClose}>← Back to Listings</button>

        {/* Breadcrumb */}
        <nav className="ld-breadcrumb">
          <span className="ld-bc-link" onClick={onClose}>Driveables</span>
          <span className="ld-bc-sep">›</span>
          <span className="ld-bc-link">{driveable.location}</span>
          <span className="ld-bc-sep">›</span>
          <span className="ld-bc-link" style={{ textTransform: 'capitalize' }}>{driveable.category}</span>
          <span className="ld-bc-sep">›</span>
          <span>{driveable.name}</span>
        </nav>

        {/* Header row */}
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
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ verticalAlign: 'middle', marginRight: 2 }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                {driveable.location}, India
              </span>
            </div>
          </div>
          <div className="ld-header-actions">
            {/* Save / Wishlist */}
            <button
              className="ld-act-btn"
              onClick={async () => {
                const token = localStorage.getItem('token');
                if (!token) { window.location.href = '/login'; return; }
                
                try {
                  const id = driveable.id || driveable._id;
                  if (saved) {
                    await removeFromWishlistApi(id);
                  } else {
                    await addToWishlistApi(id);
                  }
                  
                  const next = !saved;
                  setSaved(next);

                  // Sync legacy localStorage
                  const favs = JSON.parse(localStorage.getItem('favourites') || '[]');
                  if (next) {
                    if (!favs.some((f) => f.id === id)) {
                      favs.push({
                        id, name: driveable.name, image: driveable.image,
                        location: driveable.location,
                        price: driveable.hourlyRate || driveable.dayRate || 0,
                        priceUnit: driveable.dayRate ? 'day' : 'hr',
                        type: 'driveable', category: driveable.category,
                      });
                    }
                  } else {
                    const idx = favs.findIndex((f) => f.id === id);
                    if (idx !== -1) favs.splice(idx, 1);
                  }
                  localStorage.setItem('favourites', JSON.stringify(favs));
                  window.dispatchEvent(new Event('storage'));
                } catch (err) {
                  console.error("Error toggling wishlist:", err);
                }
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16"
                fill={saved ? '#FF385C' : 'none'}
                stroke={saved ? '#FF385C' : 'currentColor'}
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {saved ? 'Saved' : 'Save'}
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

        {/* Gallery */}
        <div className="ld-gallery">
          <img className="ld-gal-main" src={allImages[0]} alt={`${driveable.name} - main view`}
            style={{ objectFit: 'cover' }} onClick={() => setLbIndex(0)} />
          <div className="ld-gal-side">
            {allImages.slice(1, 5).map((img, i) => (
              <div key={i} className="ld-g-cell">
                <img src={img} alt={i < 3 ? `${driveable.name} - gallery view ${i + 2}` : ''}
                  style={{ objectFit: 'cover' }} onClick={() => setLbIndex(i + 1)} />
                {i === 3 && (
                  <button className="ld-show-all-btn" onClick={() => setLbIndex(0)}>
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

        {/* Main layout */}
        <div className="ld-layout">
          <div className="ld-left">

            {/* Host row */}
            <div className="ld-host-row">
              <div>
                <h2>{driveable.tagline || `Premium ${driveable.category?.replace(/s$/, '')} provided by RentifyX`}</h2>
                <p>
                  {driveable.specifications?.seatingCapacity || 2} seats &nbsp;·&nbsp;
                  {driveable.specifications?.transmission || 'Manual'} &nbsp;·&nbsp;
                  {driveable.specifications?.fuelType || driveable.specifications?.type || (driveable.subcategory === 'EV' ? 'Electric' : 'Petrol')}
                </p>
              </div>
              <div className="ld-av-wrap">
                <div className="ld-host-row-av" style={{ background: '#FF4D00', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 'bold' }}>
                  {driveable.sellerName?.charAt(0) || 'R'}
                </div>
                <div className="ld-sh-dot">★</div>
              </div>
            </div>

            <div className="ld-divider" />

            {/* Highlights */}
            <div className="ld-highlights">
              <div className="ld-hi"><span className="ld-hi-icon">🛡️</span><div><strong>Comprehensive Insurance</strong><p>Drive with peace of mind. Full insurance coverage included in all our premium rentals.</p></div></div>
              <div className="ld-hi"><span className="ld-hi-icon">🏆</span><div><strong>Top Rated Vehicle</strong><p>This vehicle is highly rated by previous renters for its condition and performance.</p></div></div>
              <div className="ld-hi"><span className="ld-hi-icon">🗓️</span><div><strong>Free cancellation for 48 hours</strong><p>Cancel within 48 hours of booking for a full refund.</p></div></div>
            </div>

            <div className="ld-divider" />

            {/* Description */}
            <div className="ld-sec">
              <h2>About this vehicle</h2>
              <p className="ld-desc-txt">
                {driveable.description ||
                  `Experience the thrill of the open road with this premium ${driveable.name}. Perfectly maintained and fully loaded with features, it's ready for your next adventure in ${driveable.location}.`}
              </p>
            </div>

            {/* Specifications */}
            {driveable.specifications && Object.keys(driveable.specifications).length > 0 && (
              <>
                <div className="ld-divider" />
                <div className="ld-sec">
                  <h2>Specifications</h2>
                  <div className="row g-3 mt-2">
                    {Object.entries(driveable.specifications).map(([key, value]) => (
                      <div key={key} className="col-6 col-md-4">
                        <span className="text-muted small d-block" style={{ textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="fw-medium text-dark">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

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

          {/* ── Sticky Booking Box ─────────────────────────────────────── */}
          <div className="ld-right">
            <div className="ld-sticky-box">
              <div className="ld-box-header">
                <span className="ld-box-price">
                  {fmt(driveable.hourlyRate || driveable.dayRate || 0)}
                </span>
                <span className="ld-box-unit"> {driveable.hourlyRate ? '/ hr' : '/ day'}</span>
              </div>

              <div style={{ marginTop: 20 }}>
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
                  startDate={startDate}
                  endDate={endDate}
                  onDatesChange={(s, e) => { setStartDate(s); setEndDate(e); }}
                  availability={availability}
                />
              </div>

              <button
                className="ld-reserve-btn mt-3"
                onClick={handleBooking}
                disabled={!canBook}
                style={{
                  background: canBook ? 'var(--accent-gradient-btn)' : '#ccc',
                  cursor: canBook ? 'pointer' : 'not-allowed',
                  opacity: canBook ? 1 : 0.7,
                }}
              >
                {!licenseVerified
                  ? '🪪 Verify License First'
                  : !startDate
                    ? '📅 Select Pickup Date'
                    : !endDate
                      ? '🏁 Select Return Date'
                      : !datesValid
                        ? '⚠️ Return must be after Pickup'
                        : availability?.checking
                          ? '⏳ Checking Availability…'
                          : availability?.conflict
                            ? '❌ Not Available — Change Dates'
                            : '✅ Book Now'}
              </button>

              {/* Price summary */}
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