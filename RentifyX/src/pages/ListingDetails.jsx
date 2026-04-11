import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { listings } from "../data/dwellings";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "./ListingDetails.css";
import emailjs from "@emailjs/browser";

/* ── static data ─────────────────────────────── */
function AmenityIcon({ name }) {
  const props = { width: 20, height: 20, fill: "none", stroke: "currentColor", strokeWidth: 1.6, viewBox: "0 0 24 24", strokeLinecap: "round", strokeLinejoin: "round" };
  const n = name?.toLowerCase() || "";
  if (n.includes("wifi") || n.includes("internet"))
    return <svg {...props}><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>;
  if (n.includes("kitchen") || n.includes("cook"))
    return <svg {...props}><path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /><rect x="8" y="3" width="8" height="4" rx="1" /><path d="M15 13h6m-3-3v6" /></svg>;
  if (n.includes("park"))
    return <svg {...props}><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
  if (n.includes("air") || n.includes("ac") || n.includes("cool"))
    return <svg {...props}><path d="M8 16a4 4 0 0 1 8 0" /><path d="M12 3v1m0 16v1M3 12h1m16 0h1" /><path d="m5.6 5.6.7.7m11.4 11.4.7.7M5.6 18.4l.7-.7M17.7 6.3l.7-.7" /><circle cx="12" cy="12" r="3" /></svg>;
  if (n.includes("tv") || n.includes("television") || n.includes("netflix"))
    return <svg {...props}><rect x="2" y="7" width="20" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></svg>;
  if (n.includes("wash") || n.includes("laundry"))
    return <svg {...props}><rect x="2" y="3" width="20" height="18" rx="2" /><circle cx="12" cy="13" r="4" /><path d="M8 7h.01M11 7h.01M14 7h.01" /></svg>;
  if (n.includes("elevator") || n.includes("lift"))
    return <svg {...props}><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M9 9l3-3 3 3M9 15l3 3 3-3" /></svg>;
  if (n.includes("meal") || n.includes("food") || n.includes("breakfast") || n.includes("coffee"))
    return <svg {...props}><path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" /></svg>;
  if (n.includes("study") || n.includes("desk") || n.includes("workspace") || n.includes("work"))
    return <svg {...props}><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>;
  if (n.includes("beach") || n.includes("ocean") || n.includes("sea"))
    return <svg {...props}><path d="M17 11.5a4 4 0 0 0-5.5-1L3 16" /><path d="m5 17 2.5-2.5" /><path d="M3 21c1.5-1.5 5-3 9-1s7 .5 9-1" /><path d="M15.5 6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /></svg>;
  if (n.includes("pool") || n.includes("swim"))
    return <svg {...props}><path d="M2 12h2a2 2 0 0 1 2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 1 2-2h2" /><path d="M2 19h2a2 2 0 0 1 2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 1 2-2h2" /><circle cx="8" cy="5" r="2" /><path d="M10 5c0 2 5 4 5 8" /></svg>;
  if (n.includes("garden") || n.includes("yard") || n.includes("outdoor"))
    return <svg {...props}><path d="M12 22v-7" /><path d="M9 8c0 3.5 3 5 3 7" /><path d="M15 8c0 3.5-3 5-3 7" /><path d="M6 12c0 3.5 3 5.5 6 5.5s6-2 6-5.5" /><path d="M3 12c0 5 4 9 9 9" /><path d="M21 12c0 5-4 9-9 9" /></svg>;
  if (n.includes("fireplace") || n.includes("fire"))
    return <svg {...props}><path d="M12 12c0-3-2-5-2-8 0 5-4 6-4 10a6 6 0 0 0 12 0c0-3-2-4-2-7-1 3-4 4-4 5z" /></svg>;
  if (n.includes("safe") || n.includes("security") || n.includes("lock"))
    return <svg {...props}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /><circle cx="12" cy="16" r="1" /></svg>;
  return <svg {...props}><polyline points="20 6 9 17 4 12" /></svg>;
}

const HIGHLIGHT_ICONS = {
  "Outdoor entertainment": "🏊", "Designed for staying cool": "❄️",
  "Self check-in": "🔑", "City view": "🏙️", "Central location": "📍",
  "Fast WiFi": "⚡", "Student friendly": "🎓", "Meals included": "🍽️",
  "Safe environment": "🛡️", "Beachfront": "🏖️", "Sunset view": "🌅",
  "Resort amenities": "🏨", "Nature stay": "🌿", "Private garden": "🌱",
  "Quiet location": "🤫", "Metro access": "🚇", "Modern building": "🏢",
  "Work friendly": "💼",
};

const LOCATION_COORDS = {
  Mumbai: { lat: 19.056, lng: 72.8477, bbox: "72.7977,19.006,72.8977,19.106", label: "Bandra West, Mumbai" },
  Delhi: { lat: 28.6139, lng: 77.209, bbox: "77.159,28.564,77.259,28.664", label: "New Delhi" },
  Bangalore: { lat: 12.9716, lng: 77.5946, bbox: "77.545,12.922,77.645,13.022", label: "Bangalore" },
  Hyderabad: { lat: 17.385, lng: 78.4867, bbox: "78.437,17.335,78.537,17.435", label: "Hyderabad" },
  Pune: { lat: 18.5204, lng: 73.8567, bbox: "73.807,18.470,73.907,18.570", label: "Pune" },
  Chennai: { lat: 13.0827, lng: 80.2707, bbox: "80.221,13.033,80.321,13.133", label: "Chennai" },
  Goa: { lat: 15.2993, lng: 74.124, bbox: "74.074,15.249,74.174,15.349", label: "Goa" },
  Jaipur: { lat: 26.9124, lng: 75.7873, bbox: "75.737,26.862,75.837,26.962", label: "Jaipur" },
};

const NEIGHBORHOOD = {
  Mumbai: { desc: "Nestled in Bandra West — Mumbai's most vibrant neighbourhood — walking distance from the best cafes, restaurants, and the iconic Bandstand promenade.", pills: ["🚇 Bandra Station · 8 min", "☕ Cafes · 3 min walk", "🏖️ Bandstand · 10 min", "🛒 Linking Road · 5 min", "✈️ Airport · 25 min drive", "🍽️ Restaurants · 2 min"] },
  Delhi: { desc: "Located in the heart of New Delhi with excellent metro connectivity and proximity to major landmarks, markets, and cultural sites.", pills: ["🚇 Metro · 5 min walk", "🏛️ India Gate · 15 min", "🛒 Connaught Place · 10 min", "✈️ Airport · 30 min drive"] },
  Bangalore: { desc: "Situated in central Bangalore close to tech parks, trendy cafes, and vibrant nightlife. Perfect for professionals and explorers alike.", pills: ["🚇 Metro · 8 min walk", "💼 Tech Park · 15 min", "☕ Cafes · 2 min walk", "✈️ Airport · 45 min drive"] },
  Hyderabad: { desc: "Well-located in Hyderabad with easy access to tech corridors, the old city, and great local food.", pills: ["🚇 Metro · 10 min", "🍗 Local Food · 5 min walk", "💼 Cyberabad · 20 min", "✈️ Airport · 35 min drive"] },
  Pune: { desc: "Modern apartment near Pune's metro, IT hubs, and the best restaurants the city has to offer.", pills: ["🚇 Metro · 5 min walk", "💼 IT Hub · 15 min", "🛒 Market · 10 min", "✈️ Airport · 30 min drive"] },
  Chennai: { desc: "Calm and well-connected neighbourhood in Chennai with easy access to the beach, temples, and business districts.", pills: ["🏖️ Marina Beach · 15 min", "🚇 Metro · 8 min", "🍛 Restaurants · 3 min", "✈️ Airport · 25 min drive"] },
  Goa: { desc: "Steps from the beach, surrounded by seafood shacks and tropical vibes — the perfect base for exploring North Goa.", pills: ["🏖️ Beach · 2 min walk", "🍹 Beach shacks · 5 min", "🛵 Bike rental · nearby", "✈️ Airport · 40 min drive"] },
  Jaipur: { desc: "Set near the old city forts and vibrant bazaars, with easy access to Rajasthan's royal heritage.", pills: ["🏰 Amber Fort · 20 min", "🛒 Bazaar · 10 min", "☕ Cafes · 5 min walk", "✈️ Airport · 20 min drive"] },
  default: { desc: "A well-located property with easy access to local attractions, dining, and transport links.", pills: ["📍 City centre · nearby", "🚗 Easy road access", "✈️ Airport · accessible"] },
};

const RATING_CATS = [
  { label: "Cleanliness", pct: 96, score: "4.8" },
  { label: "Accuracy", pct: 98, score: "4.9" },
  { label: "Communication", pct: 100, score: "5.0" },
  { label: "Location", pct: 90, score: "4.5" },
  { label: "Check-in", pct: 100, score: "5.0" },
  { label: "Value", pct: 88, score: "4.4" },
];

const SAMPLE_REVIEWS = [
  { name: "Komal", date: "January 2025", text: "Beautiful place with amazing surroundings. The host was incredibly welcoming and made sure everything was perfect for our arrival." },
  { name: "Dipen", date: "February 2025", text: "Very cozy and well-maintained. Everything worked flawlessly and the location couldn't be better for exploring the city." },
  { name: "Jai", date: "March 2025", text: "Perfect escape from city life. Every detail was thoughtful — from the welcome basket to the local restaurant recommendations." },
  { name: "Anika", date: "March 2025", text: "The photos don't do it justice — even better in person. Stunning views and a supremely comfortable stay. Will return!" },
];


/* ── helpers ─────────────────────────────────── */
function fmt(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

/**
 * Canonical rental-type detection.
 * Priority: pricingType field → priceUnit string fallback.
 * Returns "monthly" | "perNight"
 */
function getRentalType(listing) {
  if (listing.pricingType === "monthly") return "monthly";
  if (listing.pricingType === "perNight") return "perNight";
  // Legacy fallback: infer from priceUnit string
  const unit = listing.priceUnit?.toLowerCase() || "";
  if (unit.includes("month") || unit.includes("mo")) return "monthly";
  return "perNight";
}

function getMonthDiff(start, end) {
  const s = new Date(start);
  const e = new Date(end);

  let months =
    (e.getFullYear() - s.getFullYear()) * 12 +
    (e.getMonth() - s.getMonth());

  if (e.getDate() < s.getDate()) {
    months--;
  }

  return Math.max(1, months);
}
function StarIcon({ size = 14 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#FF385C">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

/* ── Lightbox ────────────────────────────────── */
function Lightbox({ images, index, onClose, onNav }) {
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, onNav]);

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
/* ── Message Host Modal ───────────────────────── */
function MessageHostModal({ host, listing, onClose }) {
  const formRef = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
       "service_z6wavoa",
       "template_jhv1w9k",
        formRef.current,
        "Utoi2SbtmtWx2iJjf"
      )
      .then(
        () => {
          alert("Message sent successfully!");
          onClose();
        },
        (error) => {
          alert("Failed to send message");
          console.error(error);
        }
      );
  };

  return (
    <div className="ld-modal-overlay" onClick={onClose}>
      <div
        className="ld-message-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="ld-modal-close" onClick={onClose}>
          ✕
        </button>

        <h2>Message {host}</h2>
        <p>Regarding: <strong>{listing}</strong></p>

        <form ref={formRef} onSubmit={sendEmail}>
          <input
            type="text"
            name="user_name"
            placeholder="Your name"
            required
          />

          <input
            type="email"
            name="user_email"
            placeholder="Your email"
            required
          />

          <textarea
            name="message"
            placeholder="Write your message to the host..."
            required
          />

          <button type="submit" className="ld-send-btn">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
/* ── Map ─────────────────────────────────────── */
function MapEmbed({ location }) {
  const info = LOCATION_COORDS[location] || LOCATION_COORDS.Mumbai;
  const nb = NEIGHBORHOOD[location] || NEIGHBORHOOD.default;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${info.bbox}&layer=mapnik&marker=${info.lat},${info.lng}`;
  return (
    <>
      <div className="ld-map-wrap">
        <iframe title={`Map of ${location}`} src={src} loading="lazy" />
        <div className="ld-map-pin">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#FF385C" strokeWidth="2.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {info.label}
        </div>
      </div>
      <p className="ld-nb-desc">{nb.desc}</p>
      <div className="ld-nb-pills">
        {nb.pills.map((p, i) => <div key={i} className="ld-nb-pill">{p}</div>)}
      </div>
    </>
  );
}

/* ── Guest Selector ──────────────────────────── */
function GuestSelector({ guests, onChange, max }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  function change(type, delta) {
    const total = guests.adults + guests.children;
    if (delta > 0 && type !== "infants" && total >= max) return;
    const next = { ...guests, [type]: Math.max(type === "adults" ? 1 : 0, guests[type] + delta) };
    onChange(next);
  }

  const parts = [];
  if (guests.adults) parts.push(`${guests.adults} ${guests.adults === 1 ? "guest" : "guests"}`);
  if (guests.children) parts.push(`${guests.children} ${guests.children === 1 ? "child" : "children"}`);
  if (guests.infants) parts.push(`${guests.infants} ${guests.infants === 1 ? "infant" : "infants"}`);

  const GuestRow = ({ type, title, subtitle }) => (
    <div className="ld-gt">
      <div className="ld-gt-lbl"><strong>{title}</strong><span>{subtitle}</span></div>
      <div className="ld-gt-ctrl">
        <button className="ld-gt-btn" onClick={() => change(type, -1)} disabled={guests[type] <= (type === "adults" ? 1 : 0)}>−</button>
        <span className="ld-gt-n">{guests[type]}</span>
        <button className="ld-gt-btn" onClick={() => change(type, 1)}>+</button>
      </div>
    </div>
  );

  return (
    <div className="ld-guest-row" ref={ref} onClick={() => setOpen((o) => !o)}>
      <div>
        <div className="ld-g-label">GUESTS</div>
        <div className="ld-g-val">{parts.join(", ")}</div>
      </div>
      <svg className={`ld-g-chev${open ? " open" : ""}`} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 9 12 15 18 9" />
      </svg>
      {open && (
        <div className="ld-guest-drop" onClick={(e) => e.stopPropagation()}>
          <GuestRow type="adults" title="Adults" subtitle="Age 13+" />
          <GuestRow type="children" title="Children" subtitle="Ages 2–12" />
          <GuestRow type="infants" title="Infants" subtitle="Under 2" />
        </div>
      )}
    </div>
  );
}

/* ── Booking Card ────────────────────────────── */
function BookingCard({ listing }) {
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });

  const today = new Date().toISOString().split("T")[0];
  const rentalType = getRentalType(listing);           // "monthly" | "perNight"
  const isMonthly = rentalType === "monthly";

  /* ── Step 1: raw day count ─────────────────── */
  const nights =
    checkIn && checkOut
      ? Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000))
      : 0;

  /* ── Step 2: validation ────────────────────── */
  // Monthly: user must span at least 30 days
  const isBelowMinStay = isMonthly && nights > 0 && nights < 30;
  // Price is calculable only when dates are chosen AND validation passes
  const canCalculate = nights > 0 && !isBelowMinStay;

  /* ── Step 3: price calculation ─────────────── */
  const months = isMonthly && canCalculate ? getMonthDiff(checkIn, checkOut) : 0;
  let sub = 0;
  let displayUnit = "";

  if (canCalculate) {
    if (isMonthly) {
      sub = months * listing.price;
      displayUnit = `× ${months} month${months > 1 ? "s" : ""}`;
    } else {
      sub = nights * listing.price;
      displayUnit = `× ${nights} night${nights > 1 ? "s" : ""}`;
    }
  }


  const total = sub;

  /* ── Min checkout enforced by the date input ── */
  const getMinCheckout = () => {
    if (!checkIn) return today;
    const d = new Date(checkIn);
    d.setDate(d.getDate() + (isMonthly ? 30 : 1));
    return d.toISOString().split("T")[0];
  };

  /* ── Reserve handler ───────────────────────── */
  function handleReserve() {

  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  if (!checkIn || !checkOut) return;
  if (isBelowMinStay) return;

  navigate(`/book/${listing.id}`, {
    state: { listing, checkIn, checkOut, nights, guests, sub, total },
  });
}

  /* ── Button label ──────────────────────────── */
  const btnLabel = () => {
    if (!checkIn || !checkOut) return "Check availability";
    if (isBelowMinStay) return "Min. 1-month rental required";
    return `Reserve · ${fmt(total)}`;
  };

  return (
    <div className="ld-book-card">

      {/* Price header */}
      <div className="ld-book-price">
        <span className="ld-price-big">{fmt(listing.price)}</span>
        <span className="ld-price-unit">/ {listing.priceUnit}</span>
      </div>

      {/* Monthly info badge */}
      {isMonthly && (
        <div className="ld-monthly-badge">
          🗓️ Monthly rental · Minimum 30-day stay
        </div>
      )}

      <div className="ld-book-rating">
        <StarIcon size={14} />
        <strong>{listing.rating}</strong>
        <span>({listing.reviews} reviews)</span>
      </div>

      {listing.instant && (
        <div className="ld-rare-badge">⚡ Instant booking available</div>
      )}

      {/* Date inputs */}
      <div className="ld-date-grid">
        <div className="ld-date-cell ld-date-checkin">
          <label htmlFor="checkin">CHECK-IN</label>
          <input
            id="checkin"
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => {
              setCheckIn(e.target.value);
              // Reset checkout if it's now before the new minimum
              if (checkOut) {
                const newMin = new Date(e.target.value);
                newMin.setDate(newMin.getDate() + (isMonthly ? 30 : 1));
                if (new Date(checkOut) < newMin) setCheckOut("");
              }
            }}
          />
        </div>
        <div className="ld-date-cell">
          <label htmlFor="checkout">CHECKOUT</label>
          <input
            id="checkout"
            type="date"
            value={checkOut}
            min={getMinCheckout()}
            onChange={(e) => setCheckOut(e.target.value)}
            disabled={!checkIn}
          />
        </div>
      </div>

      {/* Guest selector */}
      <GuestSelector guests={guests} onChange={setGuests} max={listing.guests} />

      {/* ── Validation error (only reachable if user bypasses min on desktop) ── */}
      {isBelowMinStay && (
        <div className="ld-min-stay-warning">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <span>
            Minimum 1-month rental required.
            {checkIn && <> Checkout must be on or after <strong>{getMinCheckout()}</strong>.</>}
          </span>
        </div>
      )}

      {/* Reserve button */}
      <button
        className={`ld-reserve-btn${isBelowMinStay ? " ld-reserve-btn--error" : ""}`}
        onClick={() => {
          if (!checkIn || !checkOut || isBelowMinStay) return; // prevent click
          handleReserve();
        }}
      >
        {btnLabel()}
      </button>

      {/* Price breakdown — hidden unless dates are valid */}
      <div className="ld-breakdown">
        <div className="ld-br-row">
          <span>{fmt(listing.price)} {displayUnit}</span>
          <span>{fmt(sub)}</span>
        </div>

        <div className="ld-br-total">
          <span>Total</span>
          <span>{fmt(total)}</span>
        </div>
      </div>

      <p className="ld-no-charge">You won't be charged yet</p>
    </div>
  );
}

/* ── TTK Row helpers ─────────────────────────── */
function InfoIcon() {
  return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
}
function ShieldIcon() {
  return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function CheckIcon() {
  return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>;
}
function XIcon() {
  return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
}

/* ── Main Component ──────────────────────────── */
export default function ListingDetails() {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const listing = listings.find((l) => l.id === id);

  const [lbIndex, setLbIndex] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("Photos");
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showAllAm, setShowAllAm] = useState(false);

  // Favourites — persist to localStorage
  const [saved, setSaved] = useState(() => {
    const favs = JSON.parse(localStorage.getItem("favourites") || "[]");
    return favs.some((f) => f.id === id);
  });

  function toggleSaved() {
    const favs = JSON.parse(localStorage.getItem("favourites") || "[]");
    if (saved) {
      const updated = favs.filter((f) => f.id !== listing.id);
      localStorage.setItem("favourites", JSON.stringify(updated));
    } else {
      const newFav = {
        id: listing.id,
        name: listing.name,
        image: listing.images?.[0] || listing.image || "",
        location: listing.location,
        price: listing.price,
        priceUnit: listing.priceUnit,
      };
      favs.push(newFav);
      localStorage.setItem("favourites", JSON.stringify(favs));
    }
    setSaved((s) => !s);
  }

  const sectionRefs = {
    Photos: useRef(null),
    Amenities: useRef(null),
    Reviews: useRef(null),
    Location: useRef(null),
  };

  const scrollToSection = (tab) => {
    const el = sectionRefs[tab]?.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top, behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 420);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers = [];
    ["Photos", "Amenities", "Reviews", "Location"].forEach((tab) => {
      const el = sectionRefs[tab]?.current;
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveTab(tab); },
        { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  if (!listing) return <div className="ld-page"><p>Listing not found.</p></div>;

  const allImages = listing.images?.length ? listing.images : [listing.image];
  const lbNav = (d) => setLbIndex((i) => (i + d + allImages.length) % allImages.length);

  return (
    <div className="ld-root">
      <Header />

      {lbIndex !== null && (
        <Lightbox images={allImages} index={lbIndex} onClose={() => setLbIndex(null)} onNav={lbNav} />
      )}

      <div className={`ld-scroll-bar${scrolled ? " visible" : ""}`}>
        <span className="ld-scroll-title">{listing.name}</span>
        <div className="ld-scroll-tabs">
          {["Photos", "Amenities", "Reviews", "Location"].map((t) => (
            <span key={t} className={`ld-scroll-tab${activeTab === t ? " active" : ""}`} onClick={() => scrollToSection(t)}>{t}</span>
          ))}
        </div>
      </div>

      <div className="ld-page">

        {/* Back to Listings */}
        <button className="ld-back-btn" onClick={() => navigate('/dwellings')}>
          ← Back to Listings
        </button>

        <nav className="ld-breadcrumb">
          <span className="ld-bc-link" onClick={() => navigate("/")}>Home</span>
          <span className="ld-bc-sep">›</span>
          <span className="ld-bc-link">{listing.location}</span>
          <span className="ld-bc-sep">›</span>
          <span className="ld-bc-link" style={{ textTransform: "capitalize" }}>{listing.type}</span>
          <span className="ld-bc-sep">›</span>
          <span>{listing.name}</span>
        </nav>

        <div className="ld-header-row">
          <div className="ld-header-left">
            <h1>{listing.name}</h1>
            <div className="ld-header-meta">
              <span className="ld-star"><StarIcon /> {listing.rating}</span>
              <span className="ld-dot">·</span>
              <span className="ld-ul">{listing.reviews} reviews</span>
              <span className="ld-dot">·</span>
              <span>🏅 Superhost</span>
              <span className="ld-dot">·</span>
              <span className="ld-ul">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ verticalAlign: "middle", marginRight: 2 }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                {listing.location}, India
              </span>
            </div>
          </div>
          <div className="ld-header-actions">
            <button className="ld-act-btn" onClick={toggleSaved}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill={saved ? "#FF385C" : "none"} stroke={saved ? "#FF385C" : "currentColor"} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {saved ? "Saved ♥" : "Save"}
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

        <div className="ld-gallery" ref={sectionRefs.Photos}>
          <img className="ld-gal-main" src={allImages[0]} alt={listing.name} onClick={() => setLbIndex(0)} />
          <div className="ld-gal-side">
            {allImages.slice(1, 5).map((img, i) => (
              <div key={i} className="ld-g-cell">
                <img src={img} alt={`view ${i + 2}`} onClick={() => setLbIndex(i + 1)} />
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

        <div className="ld-layout">
          <div className="ld-left">

            <div className="ld-host-row">
              <div>
                <h2>Entire {listing.type === "pgs" ? "PG" : listing.type.replace(/s$/, "")} hosted by {listing.host.name}</h2>
                <p>
                  {listing.guests} guest{listing.guests > 1 ? "s" : ""} &nbsp;·&nbsp;
                  {listing.bedrooms} bedroom{listing.bedrooms > 1 ? "s" : ""} &nbsp;·&nbsp;
                  {listing.beds} bed{listing.beds > 1 ? "s" : ""} &nbsp;·&nbsp;
                  {listing.bathrooms} bath{listing.bathrooms > 1 ? "s" : ""}
                </p>
              </div>
              <div className="ld-av-wrap">
                <img className="ld-host-row-av" src={listing.host.avatar} alt={listing.host.name} />
                <div className="ld-sh-dot">★</div>
              </div>
            </div>

            <div className="ld-divider" />

            <div className="ld-highlights">
              <div className="ld-hi">
                <span className="ld-hi-icon">🏅</span>
                <div><strong>{listing.host.name} is a Superhost</strong><p>Superhosts are experienced, highly rated hosts committed to providing great stays.</p></div>
              </div>
              {listing.highlights.map((h, i) => (
                <div key={i} className="ld-hi">
                  <span className="ld-hi-icon">{HIGHLIGHT_ICONS[h.title] || "✨"}</span>
                  <div><strong>{h.title}</strong><p>{h.desc}</p></div>
                </div>
              ))}
              <div className="ld-hi">
                <span className="ld-hi-icon">🗓️</span>
                <div><strong>Free cancellation for 48 hours</strong><p>Cancel within 48 hours of booking for a full refund.</p></div>
              </div>
            </div>

            <div className="ld-divider" />

            <div className="ld-sec">
              <h2>About this place</h2>
              <p className="ld-desc-txt">{listing.description}</p>
              {showFullDesc && (
                <p className="ld-desc-txt" style={{ marginTop: 12 }}>
                  Whether you're here for work or leisure, this property has been thoughtfully designed to make you feel right at home. Natural light floods every room and the location gives you easy access to everything {listing.location} has to offer.
                </p>
              )}
              <button className="ld-read-more-btn" onClick={() => setShowFullDesc((v) => !v)}>
                {showFullDesc ? "Show less ‹" : "Show more ›"}
              </button>
            </div>

            <div className="ld-divider" />

            <div className="ld-sec" ref={sectionRefs.Amenities}>
              <h2>What this place offers</h2>
              <div className="ld-amenities">
                {(showAllAm ? listing.amenities : listing.amenities.slice(0, 8)).map((a, i) => (
                  <div key={i} className="ld-am">
                    <span className="ld-am-icon"><AmenityIcon name={a} /></span>
                    <span>{a}</span>
                  </div>
                ))}
              </div>
              {listing.amenities.length > 8 && (
                <button className="ld-show-more-am" onClick={() => setShowAllAm((v) => !v)}>
                  {showAllAm ? "Show fewer amenities" : `Show all ${listing.amenities.length} amenities`}
                </button>
              )}
            </div>

            <div className="ld-divider" />

            <div className="ld-sec" ref={sectionRefs.Reviews}>
              <div className="ld-rev-header">
                <span className="ld-star" style={{ fontSize: 16 }}><StarIcon size={16} /> {listing.rating}</span>
                <h2>· {listing.reviews} reviews</h2>
              </div>
              <div className="ld-rev-cats">
                {RATING_CATS.map((c) => (
                  <div key={c.label} className="ld-rev-cat">
                    <span className="ld-rc-label">{c.label}</span>
                    <div className="ld-rc-bar"><div className="ld-rc-fill" style={{ width: `${c.pct}%` }} /></div>
                    <span className="ld-rc-score">{c.score}</span>
                  </div>
                ))}
              </div>
              <div className="ld-rev-grid">
                {SAMPLE_REVIEWS.map((r, i) => (
                  <div key={i} className="ld-rev-card">
                    <div className="ld-rev-top">
                      <div className="ld-rev-av">{r.name[0]}</div>
                      <div><strong>{r.name}</strong><p className="ld-rev-date">{r.date}</p></div>
                    </div>
                    <p className="ld-rev-text">{r.text}</p>
                    <div className="ld-rev-stars">⭐⭐⭐⭐⭐</div>
                  </div>
                ))}
              </div>
              <button className="ld-show-all-revs">Show all {listing.reviews} reviews</button>
            </div>

            <div className="ld-divider" />

            <div className="ld-sec" ref={sectionRefs.Location}>
              <h2>Where you'll be</h2>
              <p className="ld-loc-sub">{listing.location}, India</p>
              <MapEmbed location={listing.location} />
            </div>

            <div className="ld-divider" />

            <div className="ld-sec">
              <h2>Meet your host</h2>
              <div className="ld-host-card">
                <div className="ld-hc-top">
                  <div className="ld-hc-avatar-wrap">
                    <img className="ld-hc-photo" src={listing.host.avatar} alt={listing.host.name} />
                    <div className="ld-hc-sh-dot">★</div>
                  </div>
                  <div className="ld-hc-identity">
                    <div className="ld-hc-name">{listing.host.name}</div>
                    <div className="ld-hc-since">Hosting since {new Date().getFullYear() - parseInt(listing.host.experience)} · Superhost</div>
                  </div>
                  <div className="ld-hc-stats">
                    <div className="ld-hc-stat"><strong>{listing.host.reviews}</strong><span>Reviews</span></div>
                    <div className="ld-hc-stat-sep" />
                    <div className="ld-hc-stat"><strong>{listing.host.rating}</strong><span>Rating</span></div>
                    <div className="ld-hc-stat-sep" />
                    <div className="ld-hc-stat"><strong>{listing.host.experience.split(" ")[0]}</strong><span>Yrs hosting</span></div>
                  </div>
                </div>
                <div className="ld-hc-body">
                  <p className="ld-hc-bio">
                    Hi! I'm {listing.host.name}. I've been hosting for {listing.host.experience} and genuinely love welcoming guests from all over.
                    My goal is to make you feel completely at home — I know {listing.location} inside-out and I'm always happy to share my favourite spots!
                  </p>
                  <div className="ld-hc-meta">
                    <div className="ld-hc-meta-item">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      Lives in {listing.location}
                    </div>
                    <div className="ld-hc-meta-item">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                      Speaks {listing.host.languages.join(", ")}
                    </div>
                    <div className="ld-hc-meta-item">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                      Identity verified
                    </div>
                  </div>
                  <div className="ld-hc-response">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    <div>
                      <strong>Responds {listing.host.responseTime}</strong>
                      <span> · Response rate: {listing.host.responseRate}</span>
                    </div>
                  </div>
                 <button className="ld-contact-btn" onClick={() => setShowMessageModal(true)}> Message {listing.host.name}
                  </button>
                </div>
              </div>
            </div>

            <div className="ld-divider" />

            <div className="ld-sec">
              <h2>Things to know</h2>
              <div className="ld-ttk">
                <div className="ld-ttk-col">
                  <h4>House rules</h4>
                  <div className="ld-ttk-row"><InfoIcon />Check-in after 2:00 PM</div>
                  <div className="ld-ttk-row"><InfoIcon />Checkout before 11:00 AM</div>
                  <div className="ld-ttk-row"><InfoIcon />{listing.guests} guests maximum</div>
                  <div className="ld-ttk-row"><InfoIcon />No smoking on premises</div>
                </div>
                <div className="ld-ttk-col">
                  <h4>Safety &amp; property</h4>
                  <div className="ld-ttk-row"><ShieldIcon />Carbon monoxide alarm</div>
                  <div className="ld-ttk-row"><ShieldIcon />Smoke alarm installed</div>
                  <div className="ld-ttk-row"><ShieldIcon />Security camera outside</div>
                  <div className="ld-ttk-row"><ShieldIcon />Pool / lake nearby</div>
                </div>
                <div className="ld-ttk-col">
                  <h4>Cancellation policy</h4>
                  <div className="ld-ttk-row"><CheckIcon />Free cancellation within 48 hrs</div>
                  <div className="ld-ttk-row"><XIcon />No refund after check-in</div>
                  <div className="ld-ttk-row"><CheckIcon />Dwellings cover included</div>
                </div>
              </div>
            </div>

          </div>

          <div className="ld-sticky-wrap">
            <BookingCard listing={listing} />
            <div className="ld-trust-strip">
              <div className="ld-trust-item">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#717171" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                Free cancellation within 48 hours of booking
              </div>
            </div>
            <p className="ld-report-link">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: "middle", marginRight: 4 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Report this listing
            </p>
          </div>

        </div>
      </div>
      {showMessageModal && (
  <MessageHostModal
    host={listing.host.name}
    listing={listing.name}
    onClose={() => setShowMessageModal(false)}
  />
)}
      <Footer />
    </div>
  );
}
