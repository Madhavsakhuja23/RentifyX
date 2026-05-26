import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { useRazorpay } from '../utils/useRazorpay';
import api, { createBookingApi, checkAvailabilityApi } from '../api';

/* ── helpers ─────────────────────────────────── */
function fmt(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function getQRUrl(upiId, amount, name) {
  const upiStr = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiStr)}`;
}

/* ── Success Screen ───────────────────────────── */
function SuccessScreen({ vehicle, booking, onGoProfile }) {
  const navigate = useNavigate();
  return (
    <div className="dv-success">
      <div className="dv-success-icon">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="white" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2>Booking Confirmed! 🎉</h2>
      <p className="dv-success-sub">
        Your payment has been verified and your vehicle booking is confirmed.
      </p>
      <div className="dv-success-detail">
        <div className="dv-success-row"><span>Vehicle</span><strong>{vehicle?.name}</strong></div>
        <div className="dv-success-row"><span>Amount Paid</span><strong>{booking.amount}</strong></div>
        <div className="dv-success-row"><span>UTR ID</span><strong style={{ fontFamily: "monospace" }}>{booking.utr}</strong></div>
      </div>
      <div className="dv-success-actions">
        <button className="dv-success-profile-btn" onClick={() => navigate("/profile")}>
          View My Bookings
        </button>
        <button className="dv-success-home-btn" onClick={() => navigate("/driveables")}>
          Browse More
        </button>
      </div>
    </div>
  );
}

/* ── Success screen styles ─── */
const dvSuccessStyles = `
  .dv-root { font-family: var(--font-airbnb); background: #f5f5f5; min-height: 100vh; }
  .dv-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .dv-page { max-width: 1060px; margin: 0 auto; padding: 32px 24px 80px; }
  .dv-success { max-width: 520px; margin: 60px auto; text-align: center; background: white; border-radius: 20px; padding: 50px 40px; box-shadow: 0 8px 40px rgba(0,0,0,.1); border: 1px solid #eee; }
  .dv-success-icon { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, rgb(255,102,0), rgb(230,80,0)); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; box-shadow: 0 6px 20px rgba(255,102,0,.35); }
  .dv-success h2 { font-size: 26px; font-weight: 800; color: #222; margin-bottom: 10px; }
  .dv-success-sub { font-size: 15px; color: #666; line-height: 1.6; margin-bottom: 32px; }
  .dv-success-detail { background: #fafafa; border-radius: 12px; border: 1px solid #eee; padding: 20px; margin-bottom: 28px; text-align: left; }
  .dv-success-row { display: flex; justify-content: space-between; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
  .dv-success-row:last-child { border: none; }
  .dv-success-row span { color: #888; }
  .dv-success-row strong { color: #222; }
  .dv-success-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .dv-success-profile-btn { padding: 13px 24px; border: none; border-radius: 10px; background: linear-gradient(135deg, rgb(255,102,0), rgb(230,80,0)); color: white; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; box-shadow: 0 4px 14px rgba(255,102,0,.3); }
  .dv-success-profile-btn:hover { opacity: .9; }
  .dv-success-home-btn { padding: 13px 24px; border: 1.5px solid #ddd; border-radius: 10px; background: white; color: #333; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
  .dv-success-home-btn:hover { background: #f5f5f5; }
`;

/* ── Main Component ──────────────────────────── */
const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicle, bookingDetails } = location.state || {};

  const UPI_ID = "8295190177@ybl";
  const HOST_NAME = "RentifyX";

  const totalPrice = bookingDetails?.totalPrice || vehicle?.hourlyRate || 0;
  const grandTotal = Math.round(totalPrice * 1.18 + 50); // taxes + service fee

  const [utr, setUtr] = useState("");
  const [utrError, setUtrError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [payMethod, setPayMethod] = useState("razorpay"); // "razorpay" | "upi"

  const { openRazorpay, loading: rzpLoading, error: rzpError, setError: setRzpError } = useRazorpay();

  useEffect(() => {
    if (!vehicle) navigate('/driveables');
  }, [vehicle, navigate]);

  if (!vehicle) return null;

  async function handleRazorpayPay() {
    setRzpError(null);

    // Check availability first if dates are provided
    if (bookingDetails?.startDate && bookingDetails?.endDate) {
      try {
        const availability = await checkAvailabilityApi(vehicle.id || vehicle._id, bookingDetails.startDate, bookingDetails.endDate);
        if (!availability.available) {
          setUtrError('Sorry, this vehicle was just booked by someone else for your dates. Please go back and choose different dates.');
          return;
        }
      } catch (err) {
        setUtrError(err.message || 'Could not check availability.');
        return;
      }
    }

    const amountInPaise = grandTotal * 100;
    const shortId = (vehicle.id || vehicle._id).toString().slice(-6);
    openRazorpay({
      amountInPaise,
      receipt: `dv_${shortId}_${Date.now()}`,
      description: `Vehicle Booking: ${vehicle?.name || 'Vehicle'}`,
      onSuccess: async ({ paymentId, orderId, signature }) => {
        try {
          const res = await createBookingApi({
            listingId: vehicle.id || vehicle._id,
            checkIn: bookingDetails?.startDate,
            checkOut: bookingDetails?.endDate,
            guests: { adults: 1, children: 0, infants: 0 },
            totalPrice: grandTotal,
            utr: paymentId,
            paymentMethod: 'razorpay',
            razorpayOrderId: orderId,
            razorpaySignature: signature,
          });

          if (res.success) {
            const confirmedData = {
              ...res.booking,
              id: res.booking._id,
              amount: fmt(res.booking.totalPrice || grandTotal),
              title: vehicle.name,
              image: vehicle.image,
              utr: paymentId,
            };
            setConfirmedBooking(confirmedData);
            setConfirmed(true);

            // Update legacy localStorage for fallback
            const existing = JSON.parse(localStorage.getItem('bookings') || '[]');
            existing.push({ ...confirmedData, type: 'driveable', duration: bookingDetails?.duration || '', category: vehicle.category || '' });
            localStorage.setItem('bookings', JSON.stringify(existing));
            window.dispatchEvent(new Event('storage'));
          } else {
            setUtrError(res.msg || 'Booking failed after payment. Contact support.');
          }
        } catch (err) {
          setUtrError(err.message || 'Booking could not be saved. Contact support with payment ID: ' + paymentId);
        }
      },
      onFailure: (msg) => setUtrError(msg),
      onDismiss: () => {},
    });
  }

  async function handleConfirm() {
    const cleaned = utr.trim().replace(/\s/g, '');
    if (cleaned.length < 12) {
      setUtrError('Please enter a valid UTR ID (minimum 12 digits).');
      return;
    }
    setUtrError('');
    setConfirming(true);

    try {
      // ── 1. Register booking on backend (conflict-safe) ──────────────
      if (bookingDetails?.startDate && bookingDetails?.endDate) {
        // Double check availability before confirming
        const availability = await checkAvailabilityApi(vehicle.id || vehicle._id, bookingDetails.startDate, bookingDetails.endDate);
        
        if (!availability.available) {
          setUtrError('Sorry, this vehicle was just booked by someone else for your dates. Please go back and choose different dates.');
          setConfirming(false);
          return;
        }

        // Save booking to backend
        const res = await createBookingApi({
          listingId: vehicle.id || vehicle._id,
          checkIn: bookingDetails.startDate,
          checkOut: bookingDetails.endDate,
          guests: { adults: 1, children: 0, infants: 0 },
          totalPrice: grandTotal,
          utr: cleaned
        });

        if (res.success) {
          const confirmedData = {
            ...res.booking,
            id: res.booking._id,
            amount: fmt(res.booking.totalPrice || grandTotal),
            title: vehicle.name,
            image: vehicle.image
          };
          setConfirmedBooking(confirmedData);
          setConfirmed(true);

          // Update legacy localStorage for fallback
          const existing = JSON.parse(localStorage.getItem('bookings') || '[]');
          existing.push({
            ...confirmedData,
            type: 'driveable',
            duration: bookingDetails?.duration || '',
            category: vehicle.category || ''
          });
          localStorage.setItem('bookings', JSON.stringify(existing));
          window.dispatchEvent(new Event('storage'));
        } else {
          throw new Error(res.msg || "Booking failed");
        }
      }
    } catch (err) {
      console.error('Booking error:', err);
      setUtrError(err.message || 'Failed to process booking. Please try again.');
    } finally {
      setConfirming(false);
    }
  }

  if (confirmed && confirmedBooking) {
    return (
      <div className="dv-root">
        <div className="dv-page">
          <SuccessScreen vehicle={vehicle} booking={confirmedBooking} />
        </div>
        <style>{dvSuccessStyles}</style>
      </div>
    );
  }

  return (
    <div className="dv-root">
      <div className="dv-page">

        {/* Topbar */}
        <div className="dv-topbar">
          <button className="dv-back-btn" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <h1>Complete Your Booking</h1>
        </div>

        <div className="dv-layout">

          {/* LEFT — vehicle summary */}
          <div className="dv-left">
            <div className="dv-summary-card">

              {/* Vehicle */}
              <div className="dv-vehicle-row">
                <img src={vehicle.image} alt={vehicle.name} className="dv-vehicle-img" />
                <div className="dv-vehicle-info">
                  <p className="dv-vehicle-cat">{vehicle.category}</p>
                  <p className="dv-vehicle-name">{vehicle.name}</p>
                  {vehicle.brand && <p className="dv-vehicle-brand">{vehicle.brand}</p>}
                </div>
              </div>

              <div className="dv-sc-divider" />

              {/* Booking details */}
              <div className="dv-meta">
                {bookingDetails?.duration && (
                  <div className="dv-meta-row">
                    <span>Duration</span>
                    <strong>{bookingDetails.duration}</strong>
                  </div>
                )}
                {bookingDetails?.startDate && (
                  <div className="dv-meta-row">
                    <span>Pickup</span>
                    <strong>{new Date(bookingDetails.startDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</strong>
                  </div>
                )}
              </div>

              <div className="dv-sc-divider" />

              {/* Price breakdown */}
              <div className="dv-pr-section">
                <h4 style={{ marginBottom: 14, fontWeight: 700, fontSize: 15 }}>Price Breakdown</h4>
                <div className="dv-pr-row">
                  <span>Base price</span>
                  <span>{fmt(totalPrice)}</span>
                </div>
                <div className="dv-pr-row">
                  <span>Service fee</span>
                  <span>₹50</span>
                </div>
                <div className="dv-pr-row">
                  <span>GST (18%)</span>
                  <span>{fmt(Math.round(totalPrice * 0.18))}</span>
                </div>
                <div className="dv-pr-total">
                  <span>Total</span>
                  <strong>{fmt(grandTotal)}</strong>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT — Payment */}
          <div className="dv-right">
            <div className="dv-qr-card">

              {/* Payment Method Toggle */}
              <div className="dv-pay-tabs">
                <button
                  id="dv-tab-razorpay"
                  className={`dv-pay-tab${payMethod === "razorpay" ? " active" : ""}`}
                  onClick={() => { setPayMethod("razorpay"); setUtrError(""); }}
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                  Pay Online
                </button>
                <button
                  id="dv-tab-upi"
                  className={`dv-pay-tab${payMethod === "upi" ? " active" : ""}`}
                  onClick={() => { setPayMethod("upi"); setUtrError(""); }}
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                  UPI / QR
                </button>
              </div>

              {/* ── Razorpay tab ── */}
              {payMethod === "razorpay" && (
                <div className="dv-rzp-section">
                  <div className="dv-rzp-info">
                    <div className="dv-rzp-icon">
                      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /><line x1="5" y1="15" x2="9" y2="15" /></svg>
                    </div>
                    <div>
                      <h3>Secure Online Payment</h3>
                      <p>Cards, UPI, Net Banking, Wallets</p>
                    </div>
                  </div>

                  <div className="dv-rzp-amount-display">
                    <span>Amount to pay</span>
                    <strong>{fmt(grandTotal)}</strong>
                  </div>

                  {(rzpError || utrError) && (
                    <div className="dv-rzp-error">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                      {rzpError || utrError}
                    </div>
                  )}

                  <button
                    id="rzp-pay-btn-dv"
                    className="dv-rzp-pay-btn"
                    onClick={handleRazorpayPay}
                    disabled={rzpLoading}
                  >
                    {rzpLoading ? (
                      <><span className="dv-spinner" /> Processing...</>
                    ) : (
                      <><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> Pay {fmt(grandTotal)} Securely</>
                    )}
                  </button>

                  <p className="dv-secure-note">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    Powered by Razorpay. 100% secure checkout.
                  </p>
                </div>
              )}

              {/* ── UPI / QR tab ── */}
              {payMethod === "upi" && (
                <>
                  <div className="dv-qr-header">
                    <div className="dv-qr-badge">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" /><rect x="11" y="11" width="3" height="3" />
                        <rect x="11" y="18" width="3" height="3" /><rect x="18" y="11" width="3" height="3" />
                        <rect x="15" y="15" width="6" height="6" />
                      </svg>
                    </div>
                    <div>
                      <h3>Scan &amp; Pay via UPI</h3>
                      <p>Use GPay, PhonePe, Paytm or any UPI app</p>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="dv-qr-wrap">
                    <img
                      src={getQRUrl(UPI_ID, grandTotal, HOST_NAME)}
                      alt="UPI QR Code"
                      className="dv-qr-img"
                    />
                    <p className="dv-qr-amount">Pay {fmt(grandTotal)}</p>
                  </div>

                  {/* UPI ID */}
                  <div className="dv-upi-info">
                    <span className="dv-upi-label">UPI ID</span>
                    <div className="dv-upi-id-wrap">
                      <span className="dv-upi-id">{UPI_ID}</span>
                      <button
                        className="dv-copy-btn"
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

                  <div className="dv-qr-divider" />

                  {/* UTR Input */}
                  <div className="dv-utr-section">
                    <label className="dv-utr-label">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Enter UTR / Transaction Reference ID
                    </label>
                    <p className="dv-utr-hint">
                      After payment, find your UTR ID in your UPI app under transaction details.
                    </p>
                    <input
                      className={`dv-utr-input${utrError ? " error" : ""}`}
                      type="text"
                      placeholder="e.g. 123456789012"
                      value={utr}
                      onChange={(e) => {
                        setUtr(e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase());
                        setUtrError("");
                      }}
                      maxLength={25}
                    />
                    {utrError && <span className="dv-utr-error">{utrError}</span>}
                  </div>

                  <button
                    className="dv-confirm-btn"
                    onClick={handleConfirm}
                    disabled={confirming}
                  >
                    {confirming ? (
                      <><span className="dv-spinner" />Verifying Payment...</>
                    ) : (
                      <><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>Confirm &amp; Complete Booking</>
                    )}
                  </button>

                  <p className="dv-secure-note">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    Secured by UPI. Your transaction is protected.
                  </p>
                </>
              )}

            </div>
          </div>


        </div>
      </div>
      <Footer />

      <style>{`
        .dv-root {
          font-family: var(--font-sans, 'Inter', -apple-system, sans-serif);
          background: var(--bg-secondary, #f5f5f5);
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }
        .dv-root * { box-sizing: border-box; }

        .dv-page {
          max-width: 1060px;
          margin: 0 auto;
          padding: 32px 24px 80px;
        }

        .dv-topbar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 36px;
        }
        .dv-topbar h1 {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary, #222);
        }
        .dv-back-btn {
          width: 38px; height: 38px;
          border-radius: 50%;
          border: 1.5px solid #ddd;
          background: white;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: #222;
          transition: background .2s;
          flex-shrink: 0;
        }
        .dv-back-btn:hover { background: #f0f0f0; }

        .dv-layout {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 40px;
          align-items: start;
        }

        /* Summary Card */
        .dv-summary-card {
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,.06);
        }
        .dv-vehicle-row {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-bottom: 20px;
        }
        .dv-vehicle-img {
          width: 100px; height: 72px;
          border-radius: 10px;
          object-fit: cover;
          flex-shrink: 0;
        }
        .dv-vehicle-cat {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .5px;
          color: #888;
          margin-bottom: 2px;
        }
        .dv-vehicle-name {
          font-size: 16px;
          font-weight: 700;
          color: #222;
          margin-bottom: 2px;
        }
        .dv-vehicle-brand { font-size: 13px; color: #888; }

        .dv-sc-divider { border: none; border-top: 1px solid #f0f0f0; margin: 16px 0; }

        .dv-meta { display: flex; flex-direction: column; gap: 10px; }
        .dv-meta-row { display: flex; justify-content: space-between; font-size: 14px; }
        .dv-meta-row span { color: #888; }
        .dv-meta-row strong { color: #222; }

        .dv-pr-section { margin-top: 4px; }
        .dv-pr-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          padding: 6px 0;
          color: #333;
        }
        .dv-pr-total {
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          font-weight: 700;
          padding: 14px 0 0;
          border-top: 1.5px solid #e5e5e5;
          margin-top: 8px;
          color: #222;
        }

        /* QR Card */
        .dv-qr-card {
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 2px 12px rgba(0,0,0,.06);
          position: sticky;
          top: 100px;
        }
        .dv-qr-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
        }
        .dv-qr-badge {
          width: 48px; height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgb(255,102,0), rgb(255,160,50));
          display: flex; align-items: center; justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        .dv-qr-header h3 {
          font-size: 17px;
          font-weight: 700;
          color: #222;
          margin-bottom: 2px;
        }
        .dv-qr-header p { font-size: 12px; color: #888; }

        .dv-qr-wrap {
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
        .dv-qr-img {
          width: 200px; height: 200px;
          border-radius: 8px;
          border: 4px solid white;
          box-shadow: 0 4px 14px rgba(0,0,0,.1);
        }
        .dv-qr-amount {
          font-size: 20px;
          font-weight: 800;
          color: rgb(255, 102, 0);
        }

        .dv-upi-info { margin-bottom: 18px; }
        .dv-upi-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .5px;
          color: #888;
          display: block;
          margin-bottom: 6px;
        }
        .dv-upi-id-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8f8f8;
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 10px 14px;
        }
        .dv-upi-id {
          font-size: 14px;
          font-weight: 600;
          color: #222;
          font-family: monospace;
        }
        .dv-copy-btn {
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
        .dv-copy-btn:hover { background: rgba(255,102,0,.06); }

        .dv-qr-divider { border: none; border-top: 1px solid #f0f0f0; margin: 18px 0; }

        .dv-utr-section { margin-bottom: 20px; }
        .dv-utr-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 700;
          color: #222;
          margin-bottom: 6px;
        }
        .dv-utr-hint {
          font-size: 12px;
          color: #888;
          margin-bottom: 10px;
          line-height: 1.5;
        }
        .dv-utr-input {
          width: 100%;
          padding: 13px 16px;
          border: 1.5px solid #ddd;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          font-family: monospace;
          color: #222;
          background: white;
          letter-spacing: 1px;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .dv-utr-input:focus {
          border-color: rgb(255, 102, 0);
          box-shadow: 0 0 0 3px rgba(255,102,0,.1);
        }
        .dv-utr-input.error { border-color: #e53e3e; }
        .dv-utr-error {
          display: block;
          margin-top: 6px;
          font-size: 12px;
          color: #e53e3e;
        }

        .dv-confirm-btn {
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
        .dv-confirm-btn:hover:not(:disabled) {
          opacity: .92;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(255,102,0,.45);
        }
        .dv-confirm-btn:disabled { opacity: .65; cursor: not-allowed; }

        .dv-secure-note {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #aaa;
          justify-content: center;
        }

        .dv-spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,.3);
          border-top-color: white;
          border-radius: 50%;
          animation: dv-spin .8s linear infinite;
          display: inline-block;
        }
        @keyframes dv-spin { to { transform: rotate(360deg); } }

        /* Success */
        .dv-success {
          max-width: 520px;
          margin: 60px auto;
          text-align: center;
          background: white;
          border-radius: 20px;
          padding: 50px 40px;
          box-shadow: 0 8px 40px rgba(0,0,0,.1);
          border: 1px solid #eee;
        }
        .dv-success-icon {
          width: 80px; height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(255,102,0), rgb(230,80,0));
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          box-shadow: 0 6px 20px rgba(255,102,0,.35);
        }
        .dv-success h2 {
          font-size: 26px;
          font-weight: 800;
          color: #222;
          margin-bottom: 10px;
        }
        .dv-success-sub {
          font-size: 15px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 32px;
        }
        .dv-success-detail {
          background: #fafafa;
          border-radius: 12px;
          border: 1px solid #eee;
          padding: 20px;
          margin-bottom: 28px;
          text-align: left;
        }
        .dv-success-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .dv-success-row:last-child { border: none; }
        .dv-success-row span { color: #888; }
        .dv-success-row strong { color: #222; }
        .dv-success-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        .dv-success-profile-btn {
          padding: 13px 24px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, rgb(255,102,0), rgb(230,80,0));
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          box-shadow: 0 4px 14px rgba(255,102,0,.3);
        }
        .dv-success-profile-btn:hover { opacity: .9; }
        .dv-success-home-btn {
          padding: 13px 24px;
          border: 1.5px solid #ddd;
          border-radius: 10px;
          background: white;
          color: #333;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
        }
        @media (max-width: 900px) {
          .dv-layout { grid-template-columns: 1fr; gap: 24px; }
          .dv-qr-card { position: static; }
          .dv-page { padding: 20px 16px 60px; }
          .dv-topbar { margin-bottom: 24px; }
          .dv-topbar h1 { font-size: 20px; }
        }

        /* Payment Tabs */
        .dv-pay-tabs {
          display: flex; gap: 8px; margin-bottom: 24px;
        }
        .dv-pay-tab {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 10px; border: 1.5px solid #e0e0e0; border-radius: 10px;
          background: white; font-size: 13px; font-weight: 600; color: #666;
          cursor: pointer; transition: all .2s; font-family: inherit;
        }
        .dv-pay-tab.active {
          border-color: rgb(255,102,0); color: rgb(255,102,0);
          background: rgba(255,102,0,.05);
        }
        .dv-pay-tab:hover:not(.active) { background: #f8f8f8; }

        /* Razorpay Section */
        .dv-rzp-section { padding: 4px 0; }
        .dv-rzp-info {
          display: flex; align-items: center; gap: 14px; margin-bottom: 24px;
        }
        .dv-rzp-icon {
          width: 52px; height: 52px; border-radius: 14px;
          background: linear-gradient(135deg, rgb(255,102,0), rgb(255,160,50));
          display: flex; align-items: center; justify-content: center;
          color: white; flex-shrink: 0;
        }
        .dv-rzp-info h3 { font-size: 17px; font-weight: 700; color: #222; margin-bottom: 2px; }
        .dv-rzp-info p { font-size: 12px; color: #888; }
        .dv-rzp-amount-display {
          display: flex; justify-content: space-between; align-items: center;
          background: #fafafa; border: 1px solid #eee; border-radius: 12px;
          padding: 16px 20px; margin-bottom: 20px;
          font-size: 14px; color: #888;
        }
        .dv-rzp-amount-display strong { font-size: 22px; font-weight: 800; color: rgb(255,102,0); }
        .dv-rzp-error {
          display: flex; align-items: flex-start; gap: 8px;
          background: #fff5f5; border: 1px solid #fecaca; border-radius: 10px;
          padding: 12px 14px; margin-bottom: 16px;
          font-size: 13px; color: #c53030; line-height: 1.4;
        }
        .dv-rzp-pay-btn {
          width: 100%; padding: 15px; border: none; border-radius: 12px;
          background: linear-gradient(135deg, rgb(255,102,0), rgb(230,80,0));
          color: white; font-size: 16px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: opacity .2s, transform .15s, box-shadow .2s;
          box-shadow: 0 4px 14px rgba(255,102,0,.35);
          margin-bottom: 14px; font-family: inherit;
        }
        .dv-rzp-pay-btn:hover:not(:disabled) {
          opacity: .92; transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(255,102,0,.45);
        }
        .dv-rzp-pay-btn:disabled { opacity: .65; cursor: not-allowed; }
      `}</style>
    </div>
  );
};

export default PaymentPage;
