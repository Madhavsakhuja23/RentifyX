import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header/Header";
import { getListingById, checkAvailabilityApi, createBookingApi } from "../api";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

/* ── helpers ─────────────────────────────────── */
function fmt(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function calculatePrice(listing, booking) {
  const CLEANING_FEE = 5;
  const SERVICE_RATE = 0.12;
  const TAX_RATE = 0.05;
  let sub = 0;
  if (listing?.timespan === "month" || listing?.pricingType === "monthly") {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const perDayPrice = listing.price / 30;
    sub = Math.round(perDayPrice * days);
  } else if (listing?.timespan === "week") {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const perDayPrice = listing.price / 7;
    sub = Math.round(perDayPrice * days);
  } else {
    sub = Math.round(listing.price * (booking.nights || 0));
  }
  const svc = Math.round(sub * SERVICE_RATE);
  const taxes = Math.round(sub * TAX_RATE);
  const total = sub + svc + taxes + CLEANING_FEE;
  return { sub, svc, taxes, cleaning: CLEANING_FEE, total };
}

function StarIcon({ size = 13 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#FF385C">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

/* ── QR Code URL (api.qrserver.com) ─────────── */
function getQRUrl(upiId, amount, name) {
  const upiStr = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiStr)}`;
}

/* ── Success Screen ───────────────────────────── */
function SuccessScreen({ booking, listing, onBack }) {
  const navigate = useNavigate();
  return (
    <div className="rtb-success">
      <div className="rtb-success-icon">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="white" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2>Booking Confirmed! 🎉</h2>
      <p className="rtb-success-sub">
        Your payment has been verified and your booking is confirmed.
      </p>
      <div className="rtb-success-detail">
        <div className="rtb-success-row"><span>Property</span><strong>{listing?.name || "Your Booked Property"}</strong></div>
        <div className="rtb-success-row"><span>Check-in</span><strong>{new Date(booking.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</strong></div>
        <div className="rtb-success-row"><span>Check-out</span><strong>{new Date(booking.checkOut).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</strong></div>
        <div className="rtb-success-row"><span>UTR ID</span><strong>{booking.utr}</strong></div>
      </div>
      <div className="rtb-success-actions">
        <button className="rtb-success-profile-btn" onClick={() => navigate("/profile")}>
          View My Bookings
        </button>
        <button className="rtb-success-home-btn" onClick={() => navigate("/dwellings")}>
          Browse More
        </button>
      </div>
    </div>
  );
}

/* ── Success screen styles (injected into early-return branch) ─── */
const successStyles = `
  .rtb-root { font-family: var(--font-airbnb); background: #f5f5f5; min-height: 100vh; }
  .rtb-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .rtb-page { max-width: 1060px; margin: 0 auto; padding: 32px 24px 80px; }
  .rtb-success { max-width: 520px; margin: 60px auto; text-align: center; background: white; border-radius: 20px; padding: 50px 40px; box-shadow: 0 8px 40px rgba(0,0,0,.1); border: 1px solid #eee; }
  .rtb-success-icon { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, rgb(255,102,0), rgb(230,80,0)); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; box-shadow: 0 6px 20px rgba(255,102,0,.35); }
  .rtb-success h2 { font-size: 26px; font-weight: 800; color: #222; margin-bottom: 10px; }
  .rtb-success-sub { font-size: 15px; color: #666; line-height: 1.6; margin-bottom: 32px; }
  .rtb-success-detail { background: #fafafa; border-radius: 12px; border: 1px solid #eee; padding: 20px; margin-bottom: 28px; text-align: left; }
  .rtb-success-row { display: flex; justify-content: space-between; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
  .rtb-success-row:last-child { border: none; }
  .rtb-success-row span { color: #888; }
  .rtb-success-row strong { color: #222; }
  .rtb-success-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .rtb-success-profile-btn { padding: 13px 24px; border: none; border-radius: 10px; background: linear-gradient(135deg, rgb(255,102,0), rgb(230,80,0)); color: white; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; box-shadow: 0 4px 14px rgba(255,102,0,.3); }
  .rtb-success-profile-btn:hover { opacity: .9; }
  .rtb-success-home-btn { padding: 13px 24px; border: 1.5px solid #ddd; border-radius: 10px; background: white; color: #333; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
  .rtb-success-home-btn:hover { background: #f5f5f5; }
`;

/* ── Main Component ──────────────────────────── */
export default function RequestToBook() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [listing, setListing] = useState(location.state?.listing || null);
  const [booking, setBooking] = useState(location.state || {
    checkIn: "",
    checkOut: "",
    nights: 0,
    guests: { adults: 1, children: 0, infants: 0 },
  });

  const [loading, setLoading] = useState(!listing);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(null);
  const [utr, setUtr] = useState("");
  const [utrError, setUtrError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  // Fetch listing details if not provided in state
  useEffect(() => {
    if (!listing && id) {
      const fetchListing = async () => {
        try {
          const data = await getListingById(id);
          setListing(data.listing || data);
        } catch (err) {
          console.error("Failed to fetch listing:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchListing();
    }
  }, [id, listing]);

  // If no dates, redirect back (this should ideally be handled by ListingDetails)
  useEffect(() => {
    if (!booking.checkIn || !booking.checkOut) {
      // If we don't even have basic info, redirect to dwellings
      if (!id) navigate("/dwellings");
    }
  }, [booking, id, navigate]);

  const price = listing ? calculatePrice(listing, booking) : { total: 0 };

  const UPI_ID = "8295190177@ybl";
  const HOST_NAME = "RentifyX";
  async function handleConfirm() {
    const cleaned = utr.trim().replace(/\s/g, "");
    if (cleaned.length < 12) {
      setUtrError("Please enter a valid UTR ID (minimum 12 digits).");
      return;
    }
    setUtrError("");
    setConfirming(true);

    try {
      // Step 1: Double check availability
      const availability = await checkAvailabilityApi(listing._id || listing.id, booking.checkIn, booking.checkOut);
      
      if (!availability.available) {
        setAvailabilityError(true);
        setConfirming(false);
        return;
      }

      // Step 2: Save booking to backend
      const res = await createBookingApi({
        listingId: listing._id || listing.id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        totalPrice: price.total,
        utr: cleaned
      });

      if (res.success) {
        setConfirmedBooking(res.booking);
        setConfirmed(true);
      }
    } catch (err) {
      setUtrError(err.message || "Failed to process booking. Please try again.");
    } finally {
      setConfirming(false);
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="animate-spin" size={48} color="rgb(255,102,0)" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: "sans-serif" }}>
        <p style={{ fontSize: 18, color: "#666" }}>Listing not found.</p>
        <button onClick={() => navigate("/dwellings")} style={{ padding: "12px 24px", background: "rgb(255,102,0)", color: "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
          Browse Dwellings
        </button>
      </div>
    );
  }

  const checkInDate = booking.checkIn ? new Date(booking.checkIn).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  }) : "Not selected";
  
  const checkOutDate = booking.checkOut ? new Date(booking.checkOut).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  }) : "Not selected";

  if (confirmed && confirmedBooking) {
    return (
      <div className="rtb-root">
        <div className="rtb-page">
          <SuccessScreen booking={confirmedBooking} listing={listing} onBack={() => navigate(-1)} />
        </div>
        <style>{successStyles}</style>
      </div>
    );
  }


  return (
    <div className="rtb-root">
      <div className="rtb-page">

        {/* Availability Error Modal */}
        {availabilityError && (
          <div className="rtb-modal-overlay">
            <div className="rtb-modal">
              <div className="rtb-modal-icon error">
                <AlertCircle size={40} />
              </div>
              <h2>Dates Unavailable</h2>
              <p>❌ This place is already booked for the selected dates. Please select different dates.</p>
              <button className="rtb-modal-btn" onClick={() => navigate(-1)}>
                Choose Other Dates
              </button>
            </div>
          </div>
        )}

        {/* Topbar */}
        <div className="rtb-topbar">
          <button className="rtb-back-btn" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <h1>Complete Your Booking</h1>
        </div>

        <div className="rtb-layout">

          {/* LEFT — booking summary */}
          <div className="rtb-left">
            <div className="rtb-summary-card">

              {/* property */}
              <div className="rtb-sc-prop">
                <img
                  src={listing?.images?.[0] || listing?.image || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"}
                  alt={listing?.name || "Property"}
                  className="rtb-sc-img"
                />
                <div className="rtb-sc-info">
                  <p className="rtb-sc-type">{listing?.type === "pgs" ? "PG" : listing?.type || "Apartment"}</p>
                  <p className="rtb-sc-name">{listing?.name || "Booked Property"}</p>
                  <div className="rtb-sc-rating">
                    <StarIcon />
                    <strong>{listing?.rating || "5.0"}</strong>
                    <span style={{ fontSize: 12, color: "#888", marginLeft: 4 }}>({listing?.reviews || 0} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="rtb-sc-divider" />

              {/* dates & guests */}
              <div className="rtb-sc-meta">
                <div className="rtb-sc-meta-row">
                  <span>Check-in</span>
                  <strong>{checkInDate}</strong>
                </div>
                <div className="rtb-sc-meta-row">
                  <span>Check-out</span>
                  <strong>{checkOutDate}</strong>
                </div>
                <div className="rtb-sc-meta-row">
                  <span>Guests</span>
                  <strong>
                    {booking.guests?.adults || 1} adult{(booking.guests?.adults || 1) > 1 ? "s" : ""}
                    {booking.guests?.children ? `, ${booking.guests.children} child` : ""}
                  </strong>
                </div>
              </div>

              <div className="rtb-sc-divider" />

              {/* price breakdown */}
              <div className="rtb-pr-section">
                <h4 style={{ marginBottom: 14, fontWeight: 700, fontSize: 15 }}>Price Breakdown</h4>
                <div className="rtb-pr-row">
                  <span className="rtb-ul">
                    {fmt(listing?.price || 0)} ×{" "}
                    {listing?.pricingType === "monthly"
                      ? "per month"
                      : `${booking.nights || 0} night${(booking.nights || 0) > 1 ? "s" : ""}`}
                  </span>
                  <span>{fmt(price.sub)}</span>
                </div>
                <div className="rtb-pr-row">
                  <span className="rtb-ul">Cleaning fee</span>
                  <span>{fmt(price.cleaning)}</span>
                </div>
                <div className="rtb-pr-row">
                  <span className="rtb-ul">Service fee (12%)</span>
                  <span>{fmt(price.svc)}</span>
                </div>
                <div className="rtb-pr-row">
                  <span className="rtb-ul">Taxes (5%)</span>
                  <span>{fmt(price.taxes)}</span>
                </div>
                <div className="rtb-pr-total">
                  <span>Total</span>
                  <strong>{fmt(price.total)}</strong>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT — Payment */}
          <div className="rtb-right">
            <div className="rtb-qr-card">
                  <div className="rtb-qr-header">
                    <div className="rtb-qr-badge">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" /><rect x="11" y="11" width="3" height="3" />
                        <rect x="11" y="18" width="3" height="3" /><rect x="18" y="11" width="3" height="3" />
                        <rect x="15" y="15" width="6" height="6" />
                      </svg>
                    </div>
                    <div>
                      <h3>Scan &amp; Pay via UPI</h3>
                      <p>Use any UPI app — GPay, PhonePe, Paytm</p>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="rtb-qr-wrap">
                    <img
                      src={getQRUrl(UPI_ID, price.total, HOST_NAME)}
                      alt="UPI QR Code"
                      className="rtb-qr-img"
                    />
                    <p className="rtb-qr-amount">Pay {fmt(price.total)}</p>
                  </div>

                  {/* UPI ID */}
                  <div className="rtb-upi-info">
                    <span className="rtb-upi-label">UPI ID</span>
                    <div className="rtb-upi-id-wrap">
                      <span className="rtb-upi-id">{UPI_ID}</span>
                      <button
                        className="rtb-copy-btn"
                        onClick={() => navigator.clipboard.writeText(UPI_ID)}
                        title="Copy UPI ID"
                      >
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="rtb-qr-divider" />

                  {/* UTR Input */}
                  <div className="rtb-utr-section">
                    <label className="rtb-utr-label">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Enter UTR / Transaction Reference ID
                    </label>
                    <p className="rtb-utr-hint">
                      After payment, find your UTR ID in the payment app under transaction details.
                    </p>
                    <input
                      className={`rtb-utr-input${utrError ? " error" : ""}`}
                      type="text"
                      placeholder="e.g. 123456789012"
                      value={utr}
                      onChange={(e) => {
                        setUtr(e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase());
                        setUtrError("");
                      }}
                      maxLength={25}
                    />
                    {utrError && <span className="rtb-utr-error">{utrError}</span>}
                  </div>

                  <button
                    className="rtb-confirm-pay-btn"
                    onClick={handleConfirm}
                    disabled={confirming}
                  >
                    {confirming ? (
                      <><span className="rtb-spinner" />Verifying Payment...</>
                    ) : (
                      <><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>Confirm &amp; Complete Booking</>
                    )}
                  </button>

                  <p className="rtb-secure-note">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    Secured by UPI. Your transaction is protected.
                  </p>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .rtb-root {
          font-family: var(--font-sans, 'Inter', -apple-system, sans-serif);
          background: var(--bg-secondary, #f5f5f5);
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }
        .rtb-root * { box-sizing: border-box; }

        .rtb-page {
          max-width: 1060px;
          margin: 0 auto;
          padding: 32px 24px 80px;
        }

        .rtb-topbar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 36px;
        }
        .rtb-topbar h1 {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary, #222);
        }
        .rtb-back-btn {
          width: 38px; height: 38px;
          border-radius: 50%;
          border: 1.5px solid var(--border-color, #ddd);
          background: white;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: var(--text-primary, #222);
          transition: background .2s, box-shadow .2s;
          flex-shrink: 0;
        }
        .rtb-back-btn:hover {
          background: #f0f0f0;
          box-shadow: 0 2px 8px rgba(0,0,0,.1);
        }

        /* Layout */
        .rtb-layout {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 40px;
          align-items: start;
        }

        /* Summary Card */
        .rtb-summary-card {
          background: white;
          border: 1px solid var(--border-color, #e5e5e5);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,.06);
        }

        .rtb-sc-prop {
          display: flex;
          gap: 14px;
          align-items: center;
          margin-bottom: 20px;
        }
        .rtb-sc-img {
          width: 90px; height: 70px;
          border-radius: 10px;
          object-fit: cover;
          flex-shrink: 0;
        }
        .rtb-sc-info { flex: 1; }
        .rtb-sc-type {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .5px;
          color: #888;
          margin-bottom: 2px;
        }
        .rtb-sc-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary, #222);
          margin-bottom: 4px;
          line-height: 1.3;
        }
        .rtb-sc-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
        }

        .rtb-sc-divider { border: none; border-top: 1px solid #f0f0f0; margin: 16px 0; }

        .rtb-sc-meta { display: flex; flex-direction: column; gap: 10px; }
        .rtb-sc-meta-row { display: flex; justify-content: space-between; font-size: 14px; }
        .rtb-sc-meta-row span { color: #888; }
        .rtb-sc-meta-row strong { color: var(--text-primary, #222); }

        .rtb-pr-section { margin-top: 4px; }
        .rtb-pr-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          padding: 6px 0;
          color: var(--text-primary, #333);
        }
        .rtb-ul { text-decoration: underline; text-underline-offset: 2px; }
        .rtb-pr-total {
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          font-weight: 700;
          padding: 14px 0 0;
          border-top: 1.5px solid #e5e5e5;
          margin-top: 8px;
          color: var(--text-primary, #222);
        }

        /* QR Card */
        .rtb-qr-card {
          background: white;
          border: 1px solid var(--border-color, #e5e5e5);
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 2px 12px rgba(0,0,0,.06);
          position: sticky;
          top: 100px;
        }

        .rtb-qr-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
        }
        .rtb-qr-badge {
          width: 48px; height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgb(255,102,0), rgb(255,160,50));
          display: flex; align-items: center; justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        .rtb-qr-header h3 {
          font-size: 17px;
          font-weight: 700;
          color: var(--text-primary, #222);
          margin-bottom: 2px;
        }
        .rtb-qr-header p {
          font-size: 12px;
          color: #888;
        }

        .rtb-qr-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding: 20px;
          background: #fafafa;
          border-radius: 12px;
          border: 1px solid #f0f0f0;
        }
        .rtb-qr-img {
          width: 200px; height: 200px;
          border-radius: 8px;
          border: 4px solid white;
          box-shadow: 0 4px 14px rgba(0,0,0,.1);
        }
        .rtb-qr-amount {
          font-size: 20px;
          font-weight: 800;
          color: rgb(255, 102, 0);
        }

        .rtb-upi-info { margin-bottom: 18px; }
        .rtb-upi-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .5px;
          color: #888;
          display: block;
          margin-bottom: 6px;
        }
        .rtb-upi-id-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8f8f8;
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 10px 14px;
        }
        .rtb-upi-id {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary, #222);
          font-family: monospace;
        }
        .rtb-copy-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
          color: rgb(255, 102, 0);
          border: 1px solid rgb(255, 102, 0);
          background: none;
          border-radius: 6px;
          padding: 4px 10px;
          cursor: pointer;
          transition: background .2s;
        }
        .rtb-copy-btn:hover { background: rgba(255,102,0,.06); }

        .rtb-qr-divider { border: none; border-top: 1px solid #f0f0f0; margin: 18px 0; }

        /* UTR Section */
        .rtb-utr-section { margin-bottom: 20px; }
        .rtb-utr-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary, #222);
          margin-bottom: 6px;
        }
        .rtb-utr-hint {
          font-size: 12px;
          color: #888;
          margin-bottom: 10px;
          line-height: 1.5;
        }
        .rtb-utr-input {
          width: 100%;
          padding: 13px 16px;
          border: 1.5px solid #ddd;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          font-family: monospace;
          color: var(--text-primary, #222);
          background: white;
          letter-spacing: 1px;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .rtb-utr-input:focus {
          border-color: rgb(255, 102, 0);
          box-shadow: 0 0 0 3px rgba(255,102,0,.1);
        }
        .rtb-utr-input.error { border-color: #e53e3e; }
        .rtb-utr-error {
          display: block;
          margin-top: 6px;
          font-size: 12px;
          color: #e53e3e;
        }

        /* Confirm button */
        .rtb-confirm-pay-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, rgb(255,102,0), rgb(230,80,0));
          color: white;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: opacity .2s, transform .15s, box-shadow .2s;
          box-shadow: 0 4px 14px rgba(255,102,0,.35);
          margin-bottom: 14px;
          font-family: inherit;
        }
        .rtb-confirm-pay-btn:hover:not(:disabled) {
          opacity: .92;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(255,102,0,.45);
        }
        .rtb-confirm-pay-btn:disabled { opacity: .65; cursor: not-allowed; }

        .rtb-secure-note {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #aaa;
          justify-content: center;
        }

        /* Spinner */
        .rtb-spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin .8s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Success Screen */
        .rtb-success {
          max-width: 520px;
          margin: 60px auto;
          text-align: center;
          background: white;
          border-radius: 20px;
          padding: 50px 40px;
          box-shadow: 0 8px 40px rgba(0,0,0,.1);
          border: 1px solid #eee;
        }
        .rtb-success-icon {
          width: 80px; height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(255,102,0), rgb(230,80,0));
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          box-shadow: 0 6px 20px rgba(255,102,0,.35);
        }
        .rtb-success h2 {
          font-size: 26px;
          font-weight: 800;
          color: var(--text-primary, #222);
          margin-bottom: 10px;
        }
        .rtb-success-sub {
          font-size: 15px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 32px;
        }
        .rtb-success-detail {
          background: #fafafa;
          border-radius: 12px;
          border: 1px solid #eee;
          padding: 20px;
          margin-bottom: 28px;
          text-align: left;
        }
        .rtb-success-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .rtb-success-row:last-child { border: none; }
        .rtb-success-row span { color: #888; }
        .rtb-success-row strong { color: #222; }
        .rtb-success-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        .rtb-success-profile-btn {
          padding: 13px 24px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, rgb(255,102,0), rgb(230,80,0));
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity .2s;
          font-family: inherit;
          box-shadow: 0 4px 14px rgba(255,102,0,.3);
        }
        .rtb-success-profile-btn:hover { opacity: .9; }
        .rtb-success-home-btn {
          padding: 13px 24px;
          border: 1.5px solid #ddd;
          border-radius: 10px;
          background: white;
          color: #333;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background .2s;
        }
        .rtb-success-home-btn:hover { background: #f5f5f5; }

        @media (max-width: 900px) {
          .rtb-layout {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .rtb-qr-card { position: static; }
        }
        /* Modals */
        .rtb-modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 2000; padding: 20px;
          backdrop-filter: blur(4px);
        }
        .rtb-modal {
          background: white; border-radius: 20px;
          padding: 40px; max-width: 440px; width: 100%;
          text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,.2);
          animation: modalIn .3s ease-out;
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .rtb-modal-icon {
          width: 72px; height: 72px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
        }
        .rtb-modal-icon.error { background: #fee2e2; color: #ef4444; }
        .rtb-modal h2 { font-size: 24px; font-weight: 800; margin-bottom: 12px; color: #222; }
        .rtb-modal p { color: #666; line-height: 1.6; margin-bottom: 28px; }
        .rtb-modal-btn {
          width: 100%; padding: 14px; border: none;
          border-radius: 10px; background: #222;
          color: white; font-weight: 700; cursor: pointer;
          font-family: inherit; font-size: 15px;
        }
        .rtb-modal-btn:hover { background: #000; }

        /* Payment Tabs */
        .rtb-pay-tabs {
          display: flex; gap: 8px; margin-bottom: 24px;
        }
        .rtb-pay-tab {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 10px; border: 1.5px solid #e0e0e0; border-radius: 10px;
          background: white; font-size: 13px; font-weight: 600; color: #666;
          cursor: pointer; transition: all .2s; font-family: inherit;
        }
        .rtb-pay-tab.active {
          border-color: rgb(255,102,0); color: rgb(255,102,0);
          background: rgba(255,102,0,.05);
        }
        .rtb-pay-tab:hover:not(.active) { background: #f8f8f8; }

        /* Razorpay Section */
        .rtb-rzp-section { padding: 4px 0; }
        .rtb-rzp-info {
          display: flex; align-items: center; gap: 14px; margin-bottom: 24px;
        }
        .rtb-rzp-icon {
          width: 52px; height: 52px; border-radius: 14px;
          background: linear-gradient(135deg, rgb(255,102,0), rgb(255,160,50));
          display: flex; align-items: center; justify-content: center;
          color: white; flex-shrink: 0;
        }
        .rtb-rzp-info h3 { font-size: 17px; font-weight: 700; color: #222; margin-bottom: 2px; }
        .rtb-rzp-info p { font-size: 12px; color: #888; }
        .rtb-rzp-amount-display {
          display: flex; justify-content: space-between; align-items: center;
          background: #fafafa; border: 1px solid #eee; border-radius: 12px;
          padding: 16px 20px; margin-bottom: 20px;
          font-size: 14px; color: #888;
        }
        .rtb-rzp-amount-display strong { font-size: 22px; font-weight: 800; color: rgb(255,102,0); }
        .rtb-rzp-error {
          display: flex; align-items: flex-start; gap: 8px;
          background: #fff5f5; border: 1px solid #fecaca; border-radius: 10px;
          padding: 12px 14px; margin-bottom: 16px;
          font-size: 13px; color: #c53030; line-height: 1.4;
        }
        .rtb-rzp-pay-btn {
          width: 100%; padding: 15px; border: none; border-radius: 12px;
          background: linear-gradient(135deg, rgb(255,102,0), rgb(230,80,0));
          color: white; font-size: 16px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: opacity .2s, transform .15s, box-shadow .2s;
          box-shadow: 0 4px 14px rgba(255,102,0,.35);
          margin-bottom: 14px; font-family: inherit;
        }
        .rtb-rzp-pay-btn:hover:not(:disabled) {
          opacity: .92; transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(255,102,0,.45);
        }
        .rtb-rzp-pay-btn:disabled { opacity: .65; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
