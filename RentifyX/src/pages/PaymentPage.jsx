import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import { createBookingApi, checkAvailabilityApi } from '../api';

/* ─────────────────────────────────────────────────────────────────────────────
 * 🔑 RAZORPAY PAYMENT LINK
 *
 * Replace the string below with your actual Razorpay payment link once you
 * receive API approval. The link looks like:
 *   https://rzp.io/l/XXXXXXXX
 *
 * When you get live API keys approved, switch to the full SDK flow by
 * using the useRazorpay hook from '../utils/useRazorpay'.
 * ─────────────────────────────────────────────────────────────────────────── */
const RAZORPAY_PAYMENT_LINK = "https://razorpay.me/@madhavsakhuja";

/* ── helpers ─────────────────────────────────── */
function fmt(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

/* ── Success Screen ───────────────────────────── */
function SuccessScreen({ vehicle, booking }) {
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
        <div className="dv-success-row">
          <span>Payment ID</span>
          <strong style={{ fontFamily: "monospace" }}>{booking.utr}</strong>
        </div>
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

/* ── Main Component ──────────────────────────── */
const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicle, bookingDetails } = location.state || {};

  const totalPrice = bookingDetails?.totalPrice || vehicle?.hourlyRate || 0;
  const grandTotal = Math.round(totalPrice * 1.18 + 50); // taxes + service fee

  // Step: "checkout" → user clicks pay → "confirm" → user enters payment ID
  const [step, setStep] = useState("checkout");

  const [paymentId, setPaymentId] = useState("");
  const [paymentIdError, setPaymentIdError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [availabilityError, setAvailabilityError] = useState("");

  useEffect(() => {
    if (!vehicle) navigate('/driveables');
  }, [vehicle, navigate]);

  if (!vehicle) return null;

  /* ── Step 1: Open Razorpay payment link ─── */
  async function handlePayNow() {
    setAvailabilityError("");

    if (bookingDetails?.startDate && bookingDetails?.endDate) {
      try {
        const availability = await checkAvailabilityApi(
          vehicle.id || vehicle._id,
          bookingDetails.startDate,
          bookingDetails.endDate
        );
        if (!availability.available) {
          setAvailabilityError(
            'Sorry, this vehicle was just booked by someone else for your dates. Please go back and choose different dates.'
          );
          return;
        }
      } catch (err) {
        setAvailabilityError(err.message || 'Could not check availability. Please try again.');
        return;
      }
    }

    // Open the Razorpay payment link in a new tab
    window.open(RAZORPAY_PAYMENT_LINK, "_blank", "noopener,noreferrer");
    // Advance to step 2 — let user enter Payment ID
    setStep("confirm");
  }

  /* ── Step 2: Confirm booking with Payment ID ─── */
  async function handleConfirmBooking() {
    const cleaned = paymentId.trim().replace(/\s/g, '');
    if (cleaned.length < 8) {
      setPaymentIdError('Please enter a valid Razorpay Payment ID (e.g. pay_XXXXXXXXXXXXXX).');
      return;
    }
    setPaymentIdError('');
    setConfirming(true);

    try {
      if (bookingDetails?.startDate && bookingDetails?.endDate) {
        const availability = await checkAvailabilityApi(
          vehicle.id || vehicle._id,
          bookingDetails.startDate,
          bookingDetails.endDate
        );
        if (!availability.available) {
          setPaymentIdError(
            'Sorry, this vehicle is no longer available. Please contact support with your Payment ID.'
          );
          setConfirming(false);
          return;
        }

        const res = await createBookingApi({
          listingId: vehicle.id || vehicle._id,
          checkIn: bookingDetails.startDate,
          checkOut: bookingDetails.endDate,
          guests: { adults: 1, children: 0, infants: 0 },
          totalPrice: grandTotal,
          utr: cleaned,
          paymentMethod: 'razorpay_link',
        });

        if (res.success) {
          const confirmedData = {
            ...res.booking,
            id: res.booking._id,
            amount: fmt(res.booking.totalPrice || grandTotal),
            title: vehicle.name,
            image: vehicle.image,
            utr: cleaned,
          };
          setConfirmedBooking(confirmedData);
          setConfirmed(true);

          const existing = JSON.parse(localStorage.getItem('bookings') || '[]');
          existing.push({
            ...confirmedData,
            type: 'driveable',
            duration: bookingDetails?.duration || '',
            category: vehicle.category || '',
          });
          localStorage.setItem('bookings', JSON.stringify(existing));
          window.dispatchEvent(new Event('storage'));
        } else {
          throw new Error(res.msg || "Booking failed");
        }
      }
    } catch (err) {
      console.error('Booking error:', err);
      setPaymentIdError(err.message || 'Failed to confirm booking. Please try again.');
    } finally {
      setConfirming(false);
    }
  }

  /* ── Success screen ─── */
  if (confirmed && confirmedBooking) {
    return (
      <div className="dv-root">
        <div className="dv-page">
          <SuccessScreen vehicle={vehicle} booking={confirmedBooking} />
        </div>
        <Footer />
        <style>{pageStyles}</style>
      </div>
    );
  }

  /* ── Main render ─── */
  return (
    <div className="dv-root">
      <div className="dv-page">

        {/* Topbar */}
        <div className="dv-topbar">
          <button className="dv-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <h1>Complete Your Booking</h1>
        </div>

        <div className="dv-layout">

          {/* LEFT — Vehicle summary */}
          <div className="dv-left">
            <div className="dv-summary-card">
              <div className="dv-vehicle-row">
                <img src={vehicle.image} alt={vehicle.name} className="dv-vehicle-img" />
                <div className="dv-vehicle-info">
                  <p className="dv-vehicle-cat">{vehicle.category}</p>
                  <p className="dv-vehicle-name">{vehicle.name}</p>
                  {vehicle.brand && <p className="dv-vehicle-brand">{vehicle.brand}</p>}
                </div>
              </div>

              <div className="dv-sc-divider" />

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
                    <strong>
                      {new Date(bookingDetails.startDate).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </strong>
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
            <div className="dv-pay-card">

              {/* ── STEP 1: Pay Now ── */}
              {step === "checkout" && (
                <>
                  <div className="dv-pay-header">
                    <div className="dv-pay-icon">
                      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="1" y="4" width="22" height="16" rx="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                        <line x1="5" y1="15" x2="9" y2="15" />
                      </svg>
                    </div>
                    <div>
                      <h3>Secure Online Payment</h3>
                      <p>Cards, UPI, Net Banking — Powered by Razorpay</p>
                    </div>
                  </div>

                  <div className="dv-amount-display">
                    <span>Amount to pay</span>
                    <strong>{fmt(grandTotal)}</strong>
                  </div>

                  <div className="dv-info-list">
                    <div className="dv-info-item">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#22c55e" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Pay via UPI, Credit/Debit Card, or Net Banking
                    </div>
                    <div className="dv-info-item">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#22c55e" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      After payment, return here to confirm your booking
                    </div>
                    <div className="dv-info-item">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#22c55e" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Keep your Payment ID ready from the success screen
                    </div>
                  </div>

                  {availabilityError && (
                    <div className="dv-error-box">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {availabilityError}
                    </div>
                  )}

                  <button
                    id="rzp-pay-now-btn"
                    className="dv-pay-btn"
                    onClick={handlePayNow}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Pay {fmt(grandTotal)} Securely
                  </button>

                  <p className="dv-secure-note">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    256-bit SSL encrypted. Your payment is 100% secure.
                  </p>
                </>
              )}

              {/* ── STEP 2: Enter Payment ID ── */}
              {step === "confirm" && (
                <>
                  <div className="dv-pay-header">
                    <div className="dv-pay-icon dv-pay-icon--green">
                      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <h3>Almost Done!</h3>
                      <p>Enter your Payment ID to confirm the booking</p>
                    </div>
                  </div>

                  <div className="dv-confirm-info">
                    <p>After completing payment on Razorpay, find your <strong>Payment ID</strong> in:</p>
                    <ul>
                      <li>The Razorpay payment success screen</li>
                      <li>Your email / SMS from Razorpay</li>
                      <li>It looks like: <code>pay_XXXXXXXXXXXXXX</code></li>
                    </ul>
                  </div>

                  <div className="dv-pid-section">
                    <label className="dv-pid-label" htmlFor="rzp-payment-id-input">
                      Razorpay Payment ID
                    </label>
                    <input
                      id="rzp-payment-id-input"
                      className={`dv-pid-input${paymentIdError ? " error" : ""}`}
                      type="text"
                      placeholder="e.g. pay_XXXXXXXXXXXXXX"
                      value={paymentId}
                      onChange={(e) => {
                        setPaymentId(e.target.value.trim());
                        setPaymentIdError('');
                      }}
                      maxLength={50}
                      autoFocus
                    />
                    {paymentIdError && <span className="dv-pid-error">{paymentIdError}</span>}
                  </div>

                  <button
                    id="rzp-confirm-booking-btn"
                    className="dv-pay-btn"
                    onClick={handleConfirmBooking}
                    disabled={confirming}
                  >
                    {confirming ? (
                      <><span className="dv-spinner" />Confirming Booking...</>
                    ) : (
                      <><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>Confirm &amp; Complete Booking</>
                    )}
                  </button>

                  <button
                    className="dv-retry-btn"
                    onClick={() => { setStep("checkout"); setPaymentIdError(''); setAvailabilityError(''); }}
                  >
                    ← Go back / Pay again
                  </button>

                  <p className="dv-secure-note">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Your booking is protected. Contact support if needed.
                  </p>
                </>
              )}

            </div>
          </div>

        </div>
      </div>
      <Footer />
      <style>{pageStyles}</style>
    </div>
  );
};

/* ── Page Styles ─────────────────────────────── */
const pageStyles = `
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

  /* Payment Card */
  .dv-pay-card {
    background: white;
    border: 1px solid #e5e5e5;
    border-radius: 16px;
    padding: 28px;
    box-shadow: 0 2px 12px rgba(0,0,0,.06);
    position: sticky;
    top: 100px;
  }

  .dv-pay-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 24px;
  }
  .dv-pay-icon {
    width: 52px; height: 52px;
    border-radius: 14px;
    background: linear-gradient(135deg, rgb(255,102,0), rgb(255,160,50));
    display: flex; align-items: center; justify-content: center;
    color: white;
    flex-shrink: 0;
  }
  .dv-pay-icon--green {
    background: linear-gradient(135deg, #22c55e, #16a34a);
  }
  .dv-pay-header h3 {
    font-size: 17px;
    font-weight: 700;
    color: #222;
    margin-bottom: 2px;
  }
  .dv-pay-header p { font-size: 12px; color: #888; }

  .dv-amount-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fafafa;
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #888;
  }
  .dv-amount-display strong {
    font-size: 22px;
    font-weight: 800;
    color: rgb(255,102,0);
  }

  .dv-info-list {
    display: flex;
    flex-direction: column;
    gap: 9px;
    margin-bottom: 22px;
    padding: 14px 16px;
    background: #f8f9ff;
    border: 1px solid #e8eeff;
    border-radius: 12px;
  }
  .dv-info-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 13px;
    color: #555;
    line-height: 1.45;
  }
  .dv-info-item svg { flex-shrink: 0; margin-top: 1px; }

  .dv-error-box {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    background: #fff5f5;
    border: 1px solid #fecaca;
    border-radius: 10px;
    padding: 12px 14px;
    margin-bottom: 16px;
    font-size: 13px;
    color: #c53030;
    line-height: 1.4;
  }

  .dv-pay-btn {
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
  .dv-pay-btn:hover:not(:disabled) {
    opacity: .92;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(255,102,0,.45);
  }
  .dv-pay-btn:disabled { opacity: .65; cursor: not-allowed; }

  .dv-retry-btn {
    width: 100%;
    padding: 11px;
    border: 1.5px solid #ddd;
    border-radius: 10px;
    background: white;
    color: #555;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    margin-bottom: 16px;
    transition: background .2s;
  }
  .dv-retry-btn:hover { background: #f5f5f5; }

  .dv-secure-note {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: #aaa;
    justify-content: center;
  }

  /* Confirm info */
  .dv-confirm-info {
    background: #f8f9ff;
    border: 1px solid #e8eeff;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 20px;
    font-size: 13px;
    color: #444;
    line-height: 1.6;
  }
  .dv-confirm-info p { margin-bottom: 8px; }
  .dv-confirm-info ul {
    padding-left: 18px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .dv-confirm-info code {
    font-family: monospace;
    background: #eef;
    padding: 1px 5px;
    border-radius: 4px;
    font-size: 12px;
    color: #3730a3;
  }

  /* Payment ID input */
  .dv-pid-section { margin-bottom: 20px; }
  .dv-pid-label {
    display: block;
    font-size: 13px;
    font-weight: 700;
    color: #333;
    margin-bottom: 8px;
  }
  .dv-pid-input {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid #ddd;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    font-family: monospace;
    color: #222;
    background: white;
    letter-spacing: 0.5px;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .dv-pid-input:focus {
    border-color: rgb(255,102,0);
    box-shadow: 0 0 0 3px rgba(255,102,0,.1);
  }
  .dv-pid-input.error { border-color: #e53e3e; }
  .dv-pid-error {
    display: block;
    margin-top: 6px;
    font-size: 12px;
    color: #e53e3e;
  }

  /* Spinner */
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
  .dv-success h2 { font-size: 26px; font-weight: 800; color: #222; margin-bottom: 10px; }
  .dv-success-sub { font-size: 15px; color: #666; line-height: 1.6; margin-bottom: 32px; }
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
  .dv-success-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
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
  .dv-success-home-btn:hover { background: #f5f5f5; }

  /* Responsive */
  @media (max-width: 900px) {
    .dv-layout { grid-template-columns: 1fr; gap: 24px; }
    .dv-pay-card { position: static; }
    .dv-page { padding: 20px 16px 60px; }
    .dv-topbar { margin-bottom: 24px; }
    .dv-topbar h1 { font-size: 20px; }
  }
`;

export default PaymentPage;
