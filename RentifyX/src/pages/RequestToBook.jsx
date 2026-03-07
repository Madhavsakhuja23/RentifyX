import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* ── helpers ─────────────────────────────────── */
function fmt(n) { return "₹" + Number(n).toLocaleString("en-IN"); }
function StarIcon({ size = 13 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#FF385C">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

/* ── mock auth state ─────────────────────────── */
// In a real app this would come from your auth context.
// Set to `true` to simulate a logged-in user.
const IS_LOGGED_IN = false;

/* ── payment icons ───────────────────────────── */
function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}
function UpiIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}
function NetBankingIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="10" width="18" height="11" rx="1" />
      <path d="M3 10l9-7 9 7" />
      <line x1="9" y1="21" x2="9" y2="14" />
      <line x1="15" y1="21" x2="15" y2="14" />
    </svg>
  );
}

/* ── Step indicator ──────────────────────────── */
function StepBadge({ n, active, done }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: "50%",
      background: done ? "var(--primary)" : active ? "var(--foreground)" : "transparent",
      border: done || active ? "none" : "1.5px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      color: done || active ? "var(--primary-foreground)" : "var(--muted-foreground)",
      fontSize: 13, fontWeight: 700,
      transition: "all .3s",
    }}>
      {done
        ? <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        : n}
    </div>
  );
}

/* ── Login / Signup Step ─────────────────────── */
function LoginStep({ onDone }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!email.includes("@")) e.email = "Enter a valid email";
    if (password.length < 6)  e.password = "Password must be 6+ characters";
    if (mode === "signup" && !name.trim()) e.name = "Enter your name";
    if (mode === "signup" && phone.length < 10) e.phone = "Enter a valid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <div className="rtb-step-body">
      <div className="rtb-auth-tabs">
        <button
          className={`rtb-auth-tab${mode === "login" ? " active" : ""}`}
          onClick={() => { setMode("login"); setErrors({}); }}
        >Log in</button>
        <button
          className={`rtb-auth-tab${mode === "signup" ? " active" : ""}`}
          onClick={() => { setMode("signup"); setErrors({}); }}
        >Sign up</button>
      </div>

      <div className="rtb-form">
        {mode === "signup" && (
          <div className="rtb-field">
            <label>Full name</label>
            <input
              type="text"
              placeholder="Arjun Sharma"
              value={name}
              onChange={e => setName(e.target.value)}
              className={errors.name ? "error" : ""}
            />
            {errors.name && <span className="rtb-err">{errors.name}</span>}
          </div>
        )}
        <div className="rtb-field">
          <label>Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <span className="rtb-err">{errors.email}</span>}
        </div>
        {mode === "signup" && (
          <div className="rtb-field">
            <label>Phone number</label>
            <div className="rtb-phone-wrap">
              <span className="rtb-country-code">🇮🇳 +91</span>
              <input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0,10))}
                className={errors.phone ? "error" : ""}
              />
            </div>
            {errors.phone && <span className="rtb-err">{errors.phone}</span>}
          </div>
        )}
        <div className="rtb-field">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={errors.password ? "error" : ""}
          />
          {errors.password && <span className="rtb-err">{errors.password}</span>}
        </div>

        {mode === "login" && (
          <div style={{ textAlign: "right", marginTop: -8, marginBottom: 8 }}>
            <span className="rtb-link">Forgot password?</span>
          </div>
        )}

        <button className="rtb-cta-btn" onClick={() => validate() && onDone()}>
          {mode === "login" ? "Continue" : "Create account"}
        </button>

        <div className="rtb-divider-or"><span>or</span></div>

        <button className="rtb-social-btn">
          <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}

/* ── Payment Step ────────────────────────────── */
function PaymentStep({ onDone, total }) {
  const [method, setMethod] = useState("card");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("");
  const [errors, setErrors] = useState({});

  function formatCard(v) {
    return v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  }
  function formatExpiry(v) {
    const d = v.replace(/\D/g,"").slice(0,4);
    return d.length > 2 ? d.slice(0,2) + "/" + d.slice(2) : d;
  }

  function validate() {
    const e = {};
    if (method === "card") {
      if (cardNum.replace(/\s/g,"").length < 16) e.cardNum = "Enter a valid 16-digit card number";
      if (expiry.length < 5) e.expiry = "Enter expiry MM/YY";
      if (cvv.length < 3) e.cvv = "Enter CVV";
      if (!cardName.trim()) e.cardName = "Enter name on card";
    }
    if (method === "upi") {
      if (!upiId.includes("@")) e.upiId = "Enter a valid UPI ID (e.g. name@upi)";
    }
    if (method === "netbanking") {
      if (!bank) e.bank = "Select your bank";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const methods = [
    { id: "card", label: "Credit / Debit Card", icon: <CardIcon /> },
    { id: "upi", label: "UPI", icon: <UpiIcon /> },
    { id: "netbanking", label: "Net Banking", icon: <NetBankingIcon /> },
  ];

  const banks = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "Punjab National Bank", "Bank of Baroda", "Yes Bank"];

  return (
    <div className="rtb-step-body">
      <div className="rtb-pay-methods">
        {methods.map(m => (
          <button
            key={m.id}
            className={`rtb-pay-method${method === m.id ? " active" : ""}`}
            onClick={() => { setMethod(m.id); setErrors({}); }}
          >
            {m.icon}
            <span>{m.label}</span>
            <div className="rtb-pm-radio">
              <div className={`rtb-pm-dot${method === m.id ? " active" : ""}`} />
            </div>
          </button>
        ))}
      </div>

      <div className="rtb-form" style={{ marginTop: 20 }}>
        {method === "card" && (
          <>
            <div className="rtb-field">
              <label>Card number</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="1234 5678 9012 3456"
                  value={cardNum}
                  onChange={e => setCardNum(formatCard(e.target.value))}
                  className={errors.cardNum ? "error" : ""}
                />
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 4 }}>
                  <svg viewBox="0 0 38 24" width="32" height="20"><rect width="38" height="24" rx="4" fill="#1434CB"/><text x="19" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">VISA</text></svg>
                </span>
              </div>
              {errors.cardNum && <span className="rtb-err">{errors.cardNum}</span>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="rtb-field">
                <label>Expiry date</label>
                <input type="text" placeholder="MM/YY" value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} className={errors.expiry ? "error" : ""} />
                {errors.expiry && <span className="rtb-err">{errors.expiry}</span>}
              </div>
              <div className="rtb-field">
                <label>CVV</label>
                <input type="password" placeholder="•••" maxLength={4} value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g,"").slice(0,4))} className={errors.cvv ? "error" : ""} />
                {errors.cvv && <span className="rtb-err">{errors.cvv}</span>}
              </div>
            </div>
            <div className="rtb-field">
              <label>Name on card</label>
              <input type="text" placeholder="Arjun Sharma" value={cardName} onChange={e => setCardName(e.target.value)} className={errors.cardName ? "error" : ""} />
              {errors.cardName && <span className="rtb-err">{errors.cardName}</span>}
            </div>
          </>
        )}

        {method === "upi" && (
          <div className="rtb-field">
            <label>UPI ID</label>
            <input type="text" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} className={errors.upiId ? "error" : ""} />
            {errors.upiId && <span className="rtb-err">{errors.upiId}</span>}
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 6 }}>You'll receive a payment request on your UPI app</p>
          </div>
        )}

        {method === "netbanking" && (
          <div className="rtb-field">
            <label>Select your bank</label>
            <select value={bank} onChange={e => setBank(e.target.value)} className={errors.bank ? "error" : ""} style={{ width: "100%", padding: "12px 14px", borderRadius: "var(--radius)", border: "1.5px solid var(--input)", background: "var(--card)", color: "var(--foreground)", fontSize: 14, cursor: "pointer" }}>
              <option value="">— Choose bank —</option>
              {banks.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            {errors.bank && <span className="rtb-err">{errors.bank}</span>}
          </div>
        )}

        <div className="rtb-secure-note">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Your payment info is encrypted and secure. Dwellings never stores your full card details.
        </div>

        <button className="rtb-cta-btn" onClick={() => validate() && onDone()}>
          Add payment method
        </button>
      </div>
    </div>
  );
}

/* ── Review Step ─────────────────────────────── */
function ReviewStep({ listing, booking, onConfirm, confirming }) {
  const { checkIn, checkOut, nights, guests, sub, svc, total } = booking;

  const checkInDate  = new Date(checkIn).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  const checkOutDate = new Date(checkOut).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="rtb-step-body">
      <div className="rtb-review-section">
        <h4>Trip details</h4>
        <div className="rtb-review-row">
          <div>
            <strong>Dates</strong>
            <p>{checkInDate} → {checkOutDate}</p>
          </div>
          <span className="rtb-link">Edit</span>
        </div>
        <div className="rtb-review-row">
          <div>
            <strong>Guests</strong>
            <p>{guests.adults} adult{guests.adults > 1 ? "s" : ""}{guests.children ? `, ${guests.children} child${guests.children > 1 ? "ren" : ""}` : ""}{guests.infants ? `, ${guests.infants} infant${guests.infants > 1 ? "s" : ""}` : ""}</p>
          </div>
          <span className="rtb-link">Edit</span>
        </div>
      </div>

      <div className="rtb-review-section">
        <h4>Cancellation policy</h4>
        <p style={{ fontSize: 14, color: "var(--foreground)", lineHeight: 1.65 }}>
          <strong>Free cancellation within 48 hours.</strong> After that, cancel before check-in and get a 50% refund, minus the first night and service fee.
        </p>
        <span className="rtb-link" style={{ fontSize: 13, marginTop: 6, display: "inline-block" }}>Full policy ›</span>
      </div>

      <div className="rtb-review-section">
        <h4>Ground rules</h4>
        <p style={{ fontSize: 14, color: "var(--muted-foreground)", lineHeight: 1.7 }}>
          We ask every guest to remember a few simple things about what makes a great host and guest.
        </p>
        <ul style={{ fontSize: 14, color: "var(--foreground)", paddingLeft: 20, lineHeight: 2, margin: "8px 0 0" }}>
          <li>Follow the house rules</li>
          <li>Treat your Host's home like your own</li>
          <li>Communicate openly and honestly</li>
        </ul>
      </div>

      <p style={{ fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.6, marginTop: 8 }}>
        By selecting the button below, I agree to the <span className="rtb-link">Host's House Rules</span>, <span className="rtb-link">Dwellings Rebooking & Refund Policy</span>, and that Dwellings can charge my payment method.
      </p>

      <button className="rtb-cta-btn rtb-confirm-btn" onClick={onConfirm} disabled={confirming}>
        {confirming
          ? <span className="rtb-spinner" />
          : `Confirm and pay · ${fmt(total)}`
        }
      </button>
    </div>
  );
}

/* ── Success Screen ──────────────────────────── */
function SuccessScreen({ listing, booking, onBack }) {
  const checkInDate = new Date(booking.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const checkOutDate = new Date(booking.checkOut).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="rtb-success">
      <div className="rtb-success-icon">
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="var(--primary-foreground)" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h2>Booking confirmed!</h2>
      <p className="rtb-success-sub">You're all set. A confirmation has been sent to your email.</p>

      <div className="rtb-success-card">
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 20 }}>
          <img
            src={listing?.images?.[0] || listing?.image}
            alt={listing?.name}
            style={{ width: 72, height: 72, borderRadius: "var(--radius)", objectFit: "cover", flexShrink: 0 }}
          />
          <div>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 4 }}>Your stay</p>
            <strong style={{ fontSize: 16, lineHeight: 1.3 }}>{listing?.name}</strong>
            <p style={{ fontSize: 13, color: "var(--muted-foreground)", marginTop: 4 }}>{listing?.location}, India</p>
          </div>
        </div>

        <div className="rtb-success-details">
          <div className="rtb-sd-row"><span>Check-in</span><strong>{checkInDate}</strong></div>
          <div className="rtb-sd-row"><span>Check-out</span><strong>{checkOutDate}</strong></div>
          <div className="rtb-sd-row"><span>Guests</span><strong>{booking.guests.adults + booking.guests.children} guest(s)</strong></div>
          <div className="rtb-sd-row" style={{ borderTop: "1px solid var(--border)", marginTop: 8, paddingTop: 12 }}>
            <span>Total paid</span><strong style={{ color: "var(--primary)" }}>{fmt(booking.total)}</strong>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 28 }}>
        <button className="rtb-outline-btn" onClick={onBack}>Back to listing</button>
        <button className="rtb-cta-btn" style={{ width: "auto", padding: "13px 28px" }}>View my bookings</button>
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────── */
export default function RequestToBook() {
  const location = useLocation();
  const navigate = useNavigate();

  // Pull booking state passed via router state from BookingCard
  const booking = location.state || {
    checkIn: "2026-03-13",
    checkOut: "2026-03-15",
    nights: 2,
    guests: { adults: 1, children: 0, infants: 0 },
    sub: 9357,
    svc: 1122,
    total: 9979,
  };

  const listing = booking.listing || null;

  // Steps: 0 = auth, 1 = payment, 2 = review
  const startStep = IS_LOGGED_IN ? 1 : 0;
  const [step, setStep] = useState(startStep);
  const [done, setDone] = useState({ 0: IS_LOGGED_IN, 1: false, 2: false });
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const stepLabels = IS_LOGGED_IN
    ? ["Add a payment method", "Review your request"]
    : ["Log in or sign up", "Add a payment method", "Review your request"];

  const totalSteps = stepLabels.length;
  const stepOffset = IS_LOGGED_IN ? 1 : 0;

  function markDone(s) {
    setDone(d => ({ ...d, [s]: true }));
    setStep(s + 1);
  }

  function handleConfirm() {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      setConfirmed(true);
    }, 2000);
  }

  if (confirmed) {
    return (
      <div className="rtb-root">
        <SuccessScreen listing={listing} booking={booking} onBack={() => navigate(-1)} />
      </div>
    );
  }

  // dates
  const checkInDate  = new Date(booking.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const checkOutDate = new Date(booking.checkOut).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="rtb-root">
      <div className="rtb-page">

        {/* Header */}
        <div className="rtb-topbar">
          <button className="rtb-back-btn" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <h1>Request to book</h1>
        </div>

        <div className="rtb-layout">

          {/* LEFT — steps */}
          <div className="rtb-left">

            {stepLabels.map((label, idx) => {
              const globalStep = idx + stepOffset;
              const isActive   = step === globalStep;
              const isDone     = done[globalStep];
              const isLocked   = !isDone && !isActive;

              return (
                <div key={globalStep} className={`rtb-step${isActive ? " active" : ""}${isDone ? " done" : ""}${isLocked ? " locked" : ""}`}>

                  <div className="rtb-step-head" onClick={() => isDone && setStep(globalStep)}>
                    <StepBadge n={idx + 1} active={isActive} done={isDone} />
                    <span className="rtb-step-label">{label}</span>
                    {isDone && !isActive && (
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" style={{ marginLeft: "auto" }}>
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    )}
                  </div>

                  {isActive && (
                    <div className="rtb-step-content">
                      {!IS_LOGGED_IN && globalStep === 0 && <LoginStep onDone={() => markDone(0)} />}
                      {globalStep === 1 && <PaymentStep onDone={() => markDone(1)} total={booking.total} />}
                      {globalStep === 2 && (
                        <ReviewStep
                          listing={listing}
                          booking={booking}
                          onConfirm={handleConfirm}
                          confirming={confirming}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}

          </div>

          {/* RIGHT — booking summary */}
          <div className="rtb-right">
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
                  <p className="rtb-sc-name">{listing?.name || "Luxury 2BHK · BTM Layout"}</p>
                  <div className="rtb-sc-rating">
                    <StarIcon />
                    <strong>{listing?.rating || "5.0"}</strong>
                    <span>· {listing?.reviews || 6} reviews</span>
                    <span className="rtb-sc-fav">
                      <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      Guest favourite
                    </span>
                  </div>
                </div>
              </div>

              <div className="rtb-sc-divider" />

              {/* free cancel */}
              <div className="rtb-sc-free-cancel">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--forest, #2d6a4f)" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <strong>Free cancellation</strong>
                  <p>Cancel before check-in date for a full refund.</p>
                </div>
              </div>

              <div className="rtb-sc-divider" />

              {/* dates & guests */}
              <div className="rtb-sc-meta">
                <div className="rtb-sc-meta-row">
                  <span>Dates</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <strong>{checkInDate} – {checkOutDate}</strong>
                    <button className="rtb-change-btn">Change</button>
                  </div>
                </div>
                <div className="rtb-sc-meta-row">
                  <span>Guests</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <strong>
                      {booking.guests.adults} adult{booking.guests.adults > 1 ? "s" : ""}
                      {booking.guests.children ? `, ${booking.guests.children} child` : ""}
                    </strong>
                    <button className="rtb-change-btn">Change</button>
                  </div>
                </div>
              </div>

              <div className="rtb-sc-divider" />

              {/* price breakdown */}
              <div className="rtb-sc-price">
                <h4>Price details</h4>
                <div className="rtb-pr-row">
                  <span className="rtb-ul">{fmt(listing?.price || booking.sub / booking.nights)} × {booking.nights} night{booking.nights > 1 ? "s" : ""}</span>
                  <span>{fmt(booking.sub)}</span>
                </div>
                <div className="rtb-pr-row">
                  <span className="rtb-ul">Cleaning fee</span>
                  <span>₹500</span>
                </div>
                <div className="rtb-pr-row">
                  <span className="rtb-ul">Dwellings service fee</span>
                  <span>{fmt(booking.svc)}</span>
                </div>
                <div className="rtb-pr-row">
                  <span className="rtb-ul">Taxes</span>
                  <span>₹410</span>
                </div>
              </div>

              <div className="rtb-sc-divider" />

              <div className="rtb-pr-total">
                <span>Total <span className="rtb-ul">INR</span></span>
                <strong>{fmt(booking.total)}</strong>
              </div>

              <button className="rtb-price-breakdown-link">Price breakdown ›</button>

            </div>
          </div>

        </div>
      </div>

      <style>{`
        .rtb-root {
          font-family: var(--font-sans, 'Circular', -apple-system, BlinkMacSystemFont, sans-serif);
          color: var(--foreground);
          background: var(--background);
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }
        .rtb-root * { box-sizing: border-box; margin: 0; padding: 0; }

        /* Page */
        .rtb-page {
          max-width: 1100px;
          margin: 0 auto;
          padding: 28px 24px 80px;
        }

        /* Topbar */
        .rtb-topbar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 36px;
        }
        .rtb-topbar h1 {
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -.3px;
          color: var(--foreground);
        }
        .rtb-back-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          background: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: var(--foreground);
          transition: background .2s, box-shadow .2s;
          flex-shrink: 0;
        }
        .rtb-back-btn:hover {
          background: var(--secondary);
          box-shadow: 0 2px 8px hsla(20,20%,12%,.1);
        }

        /* Layout */
        .rtb-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 80px;
          align-items: start;
        }

        /* Steps */
        .rtb-step {
          border: 1px solid var(--border);
          border-radius: calc(var(--radius, 8px) * 1.5);
          margin-bottom: 16px;
          background: var(--card);
          overflow: hidden;
          transition: box-shadow .25s;
        }
        .rtb-step.active {
          box-shadow: 0 4px 20px hsla(20,20%,12%,.1);
        }
        .rtb-step.locked {
          opacity: .6;
        }
        .rtb-step-head {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 20px 22px;
          cursor: default;
        }
        .rtb-step.done .rtb-step-head { cursor: pointer; }
        .rtb-step-label {
          font-size: 16px;
          font-weight: 600;
          color: var(--foreground);
          flex: 1;
        }
        .rtb-step-content { border-top: 1px solid var(--border); }
        .rtb-step-body { padding: 22px; }

        /* Auth tabs */
        .rtb-auth-tabs {
          display: flex;
          border-bottom: 1px solid var(--border);
          margin-bottom: 22px;
        }
        .rtb-auth-tab {
          flex: 1;
          padding: 10px;
          border: none;
          background: none;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          color: var(--muted-foreground);
          border-bottom: 2px solid transparent;
          transition: color .2s, border-color .2s;
          font-family: inherit;
        }
        .rtb-auth-tab.active {
          color: var(--foreground);
          border-bottom-color: var(--foreground);
        }

        /* Form */
        .rtb-form { display: flex; flex-direction: column; gap: 14px; }
        .rtb-field { display: flex; flex-direction: column; gap: 6px; }
        .rtb-field label { font-size: 13px; font-weight: 600; color: var(--foreground); }
        .rtb-field input {
          padding: 12px 14px;
          border: 1.5px solid var(--input, var(--border));
          border-radius: var(--radius, 8px);
          background: var(--card);
          color: var(--foreground);
          font-size: 14px;
          font-family: inherit;
          transition: border-color .2s, box-shadow .2s;
          outline: none;
          width: 100%;
        }
        .rtb-field input:focus {
          border-color: var(--foreground);
          box-shadow: 0 0 0 3px hsla(20,20%,12%,.06);
        }
        .rtb-field input.error { border-color: #e53e3e; }
        .rtb-err { font-size: 12px; color: #e53e3e; margin-top: 2px; }

        /* Phone */
        .rtb-phone-wrap { display: flex; align-items: center; border: 1.5px solid var(--input, var(--border)); border-radius: var(--radius, 8px); overflow: hidden; }
        .rtb-phone-wrap input { border: none; border-radius: 0; padding-left: 8px; }
        .rtb-phone-wrap input:focus { box-shadow: none; }
        .rtb-phone-wrap:focus-within { border-color: var(--foreground); box-shadow: 0 0 0 3px hsla(20,20%,12%,.06); }
        .rtb-country-code { padding: 12px 12px; font-size: 14px; border-right: 1px solid var(--border); white-space: nowrap; color: var(--foreground); background: var(--secondary); }

        /* Buttons */
        .rtb-cta-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: var(--radius, 8px);
          background: var(--primary);
          color: var(--primary-foreground);
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: opacity .2s, transform .15s, box-shadow .2s;
          box-shadow: 0 4px 14px hsla(16,80%,54%,.32);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .rtb-cta-btn:hover:not(:disabled) {
          opacity: .9;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px hsla(16,80%,54%,.42);
        }
        .rtb-cta-btn:disabled { opacity: .65; cursor: not-allowed; transform: none; }
        .rtb-confirm-btn { margin-top: 8px; }

        .rtb-outline-btn {
          padding: 12px 22px;
          border: 1.5px solid var(--foreground);
          border-radius: var(--radius, 8px);
          background: none;
          color: var(--foreground);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background .2s;
        }
        .rtb-outline-btn:hover { background: var(--secondary); }

        /* Spinner */
        .rtb-spinner {
          width: 18px; height: 18px;
          border: 2px solid hsla(0,0%,100%,.3);
          border-top-color: white;
          border-radius: 50%;
          animation: rtbSpin .7s linear infinite;
          display: inline-block;
        }
        @keyframes rtbSpin { to { transform: rotate(360deg); } }

        /* Divider OR */
        .rtb-divider-or {
          display: flex; align-items: center; gap: 12px;
          color: var(--muted-foreground); font-size: 13px;
        }
        .rtb-divider-or::before, .rtb-divider-or::after {
          content: ""; flex: 1; height: 1px; background: var(--border);
        }

        /* Social btn */
        .rtb-social-btn {
          width: 100%; padding: 12px;
          border: 1.5px solid var(--border);
          border-radius: var(--radius, 8px);
          background: var(--card);
          color: var(--foreground);
          font-size: 14px; font-weight: 500;
          cursor: pointer; font-family: inherit;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: background .2s, box-shadow .2s;
        }
        .rtb-social-btn:hover { background: var(--secondary); box-shadow: 0 2px 8px hsla(20,20%,12%,.08); }

        /* Secure note */
        .rtb-secure-note {
          display: flex; align-items: flex-start; gap: 8px;
          font-size: 12px; color: var(--muted-foreground);
          background: var(--muted, var(--secondary));
          padding: 10px 12px; border-radius: var(--radius, 8px);
          line-height: 1.5;
        }
        .rtb-secure-note svg { flex-shrink: 0; margin-top: 1px; }

        /* Pay methods */
        .rtb-pay-methods { display: flex; flex-direction: column; gap: 8px; }
        .rtb-pay-method {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px;
          border: 1.5px solid var(--border);
          border-radius: var(--radius, 8px);
          background: var(--card);
          color: var(--foreground);
          font-size: 14px; font-weight: 500;
          cursor: pointer; font-family: inherit;
          transition: border-color .2s, background .2s;
          text-align: left; width: 100%;
        }
        .rtb-pay-method.active { border-color: var(--foreground); background: var(--secondary); }
        .rtb-pm-radio { width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid var(--border); display: flex; align-items: center; justify-content: center; margin-left: auto; flex-shrink: 0; }
        .rtb-pm-dot { width: 9px; height: 9px; border-radius: 50%; background: transparent; transition: background .2s; }
        .rtb-pm-dot.active { background: var(--foreground); }

        /* Review sections */
        .rtb-review-section { margin-bottom: 22px; padding-bottom: 22px; border-bottom: 1px solid var(--border); }
        .rtb-review-section:last-of-type { border-bottom: none; }
        .rtb-review-section h4 { font-size: 17px; font-weight: 600; margin-bottom: 14px; color: var(--foreground); }
        .rtb-review-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 10px; }
        .rtb-review-row strong { display: block; font-size: 14px; font-weight: 600; margin-bottom: 3px; color: var(--foreground); }
        .rtb-review-row p { font-size: 13px; color: var(--muted-foreground); }
        .rtb-link { font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: underline; text-underline-offset: 2px; color: var(--foreground); white-space: nowrap; }
        .rtb-link:hover { color: var(--primary); }

        /* Summary card */
        .rtb-right { position: sticky; top: 100px; height: fit-content; }
        .rtb-summary-card {
          border: 1px solid var(--border);
          border-radius: calc(var(--radius, 8px) * 1.5);
          padding: 24px;
          background: var(--card);
          box-shadow: 0 6px 24px hsla(20,20%,12%,.1);
        }
        .rtb-sc-prop { display: flex; gap: 14px; }
        .rtb-sc-img { width: 100px; height: 80px; border-radius: var(--radius, 8px); object-fit: cover; flex-shrink: 0; }
        .rtb-sc-info { flex: 1; min-width: 0; }
        .rtb-sc-type { font-size: 11px; text-transform: uppercase; letter-spacing: .6px; color: var(--muted-foreground); margin-bottom: 4px; }
        .rtb-sc-name { font-size: 14px; font-weight: 600; color: var(--foreground); line-height: 1.3; margin-bottom: 8px; }
        .rtb-sc-rating { display: flex; align-items: center; gap: 4px; font-size: 12px; }
        .rtb-sc-rating strong { font-weight: 600; color: var(--foreground); }
        .rtb-sc-rating span { color: var(--muted-foreground); }
        .rtb-sc-fav { display: flex; align-items: center; gap: 3px; background: var(--secondary); padding: 2px 7px; border-radius: 10px; font-size: 11px; color: var(--foreground); border: 1px solid var(--border); margin-left: 4px; }

        .rtb-sc-divider { height: 1px; background: var(--border); margin: 18px 0; }

        .rtb-sc-free-cancel { display: flex; gap: 10px; }
        .rtb-sc-free-cancel svg { flex-shrink: 0; margin-top: 2px; }
        .rtb-sc-free-cancel strong { display: block; font-size: 14px; font-weight: 600; margin-bottom: 3px; }
        .rtb-sc-free-cancel p { font-size: 12px; color: var(--muted-foreground); line-height: 1.5; }

        .rtb-sc-meta { display: flex; flex-direction: column; gap: 12px; }
        .rtb-sc-meta-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; font-size: 13px; }
        .rtb-sc-meta-row > span { color: var(--muted-foreground); font-weight: 500; }
        .rtb-sc-meta-row strong { font-size: 13px; font-weight: 600; color: var(--foreground); }

        .rtb-change-btn {
          background: var(--secondary); border: none;
          border-radius: 6px; padding: 3px 8px;
          font-size: 11px; font-weight: 600;
          cursor: pointer; color: var(--foreground);
          font-family: inherit;
          transition: background .2s;
          text-decoration: underline; text-underline-offset: 2px;
        }
        .rtb-change-btn:hover { background: var(--border); }

        .rtb-sc-price h4 { font-size: 15px; font-weight: 600; margin-bottom: 12px; color: var(--foreground); }
        .rtb-pr-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; color: var(--foreground); }
        .rtb-ul { text-decoration: underline; text-underline-offset: 2px; cursor: pointer; }
        .rtb-pr-total { display: flex; justify-content: space-between; align-items: center; font-size: 15px; }
        .rtb-pr-total span { font-weight: 500; }
        .rtb-pr-total strong { font-size: 17px; font-weight: 700; }

        .rtb-price-breakdown-link {
          background: none; border: none;
          font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          text-decoration: underline; text-underline-offset: 2px;
          color: var(--foreground); margin-top: 8px;
          display: block;
          transition: color .15s;
        }
        .rtb-price-breakdown-link:hover { color: var(--primary); }

        /* Success */
        .rtb-success {
          max-width: 560px;
          margin: 60px auto;
          text-align: center;
          padding: 0 24px 80px;
        }
        .rtb-success-icon {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: var(--primary);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
          box-shadow: 0 8px 24px hsla(16,80%,54%,.35);
          animation: rtbPop .5s cubic-bezier(.34,1.56,.64,1) both;
        }
        @keyframes rtbPop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .rtb-success h2 { font-size: 28px; font-weight: 700; margin-bottom: 10px; color: var(--foreground); }
        .rtb-success-sub { font-size: 15px; color: var(--muted-foreground); margin-bottom: 32px; }
        .rtb-success-card {
          border: 1px solid var(--border);
          border-radius: calc(var(--radius, 8px) * 1.5);
          padding: 24px;
          background: var(--card);
          text-align: left;
          box-shadow: 0 4px 16px hsla(20,20%,12%,.08);
        }
        .rtb-success-details { display: flex; flex-direction: column; gap: 10px; }
        .rtb-sd-row { display: flex; justify-content: space-between; font-size: 14px; }
        .rtb-sd-row span { color: var(--muted-foreground); }
        .rtb-sd-row strong { font-weight: 600; color: var(--foreground); }

        /* Responsive */
        @media (max-width: 900px) {
          .rtb-layout { grid-template-columns: 1fr; gap: 32px; }
          .rtb-right { position: static; }
        }
        @media (max-width: 560px) {
          .rtb-page { padding: 16px 16px 60px; }
          .rtb-topbar h1 { font-size: 21px; }
        }
      `}</style>
    </div>
  );
}
