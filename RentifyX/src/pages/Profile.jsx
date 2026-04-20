import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Edit, Home, Car, Search, Heart as HeartFilled } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/Header/Header";
import EditProfile from "../components/Profile/EditProfile";
import BookingHistory from "../components/Profile/BookingHistory";
import Favourites from "../components/Profile/Favourites";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [showFavourites, setShowFavourites] = useState(false);

  // Reactive localStorage data
  const [bookings, setBookings] = useState([]);
  const [favourites, setFavourites] = useState([]);

  const bookingsRef = useRef(null);
  const favouritesRef = useRef(null);

  const currentUserStr = localStorage.getItem("currentUser");
  const user = currentUserStr && currentUserStr !== "undefined" && currentUserStr !== "null"
    ? JSON.parse(currentUserStr) : null;

  // Load from localStorage on mount and when storage changes
  useEffect(() => {
    const load = () => {
      setBookings(JSON.parse(localStorage.getItem("bookings") || "[]"));
      setFavourites(JSON.parse(localStorage.getItem("favourites") || "[]"));
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const activeRentals = bookings.filter((b) => b.status === "upcoming").length;

  function handleShowBookings() {
    setShowBookings(true);
    setShowFavourites(false);
    setEditMode(false);
    setTimeout(() => bookingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  function handleShowFavourites() {
    setShowFavourites(true);
    setShowBookings(false);
    setEditMode(false);
    setTimeout(() => favouritesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  return (
    <div className="profile-wrapper">
      <Header />

      <div className="container profile-page">

        {/* Profile Header */}
        <motion.div
          className="profile-hero-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="profile-hero-info">
            <h2 className="profile-name">Hi, {user?.name}</h2>
            <p className="profile-email">{user?.email}</p>
          </div>

          <div className="profile-hero-actions">
            <button className="edit-profile-btn" onClick={() => { setEditMode((v) => !v); setShowBookings(false); setShowFavourites(false); }}>
              <Edit size={22} />
              {editMode ? "Close" : "Edit Profile"}
            </button>
            <button className="logout-profile-btn" onClick={handleLogout}>
              <LogOut size={22} />
              Logout
            </button>
          </div>
        </motion.div>

        {/* Edit Profile — inline below header */}
        {editMode && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <EditProfile user={user} setEditMode={setEditMode} />
          </motion.div>
        )}

        {/* Stats Row */}
        <motion.div
          className="profile-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="stat-card" onClick={handleShowFavourites} style={{ cursor: "pointer" }}>
            <p className="stat-label">FAVOURITES</p>
            <h3>{favourites.length}</h3>
            <p className="stat-desc">Saved listings</p>
          </div>
          <div className="stat-card" onClick={handleShowBookings} style={{ cursor: "pointer" }}>
            <p className="stat-label">BOOKINGS</p>
            <h3>{bookings.length}</h3>
            <p className="stat-desc">All time bookings</p>
          </div>
          <div className="stat-card" onClick={handleShowBookings} style={{ cursor: "pointer" }}>
            <p className="stat-label">ACTIVE RENTALS</p>
            <h3>{activeRentals}</h3>
            <p className="stat-desc">Currently active</p>
          </div>
        </motion.div>

        {/* Quick Actions (always visible) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h3 className="section-label">Quick Actions</h3>
          <div className="quick-actions-grid">
            <div className="quick-action-card" onClick={() => navigate("/dwellings")}>
              <Home size={42} color="rgb(255, 102, 0)" />
              <span>Browse Dwellings</span>
            </div>
            <div className="quick-action-card" onClick={() => navigate("/driveables")}>
              <Car size={42} color="rgb(255, 102, 0)" />
              <span>Browse Driveables</span>
            </div>
            <div className="quick-action-card" onClick={handleShowBookings}>
              <Search size={42} color="rgb(255, 102, 0)" />
              <span>My Bookings</span>
            </div>
            <div className="quick-action-card" onClick={handleShowFavourites}>
              <HeartFilled size={42} color="rgb(255, 102, 0)" />
              <span>My Favourites</span>
            </div>
          </div>
        </motion.div>

        {/* My Bookings — shown inline below grid */}
        {showBookings && (
          <motion.div
            ref={bookingsRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: 40 }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 className="section-label" style={{ margin: 0 }}>My Bookings</h3>
              <button
                onClick={() => setShowBookings(false)}
                style={{ background: "none", border: "1.5px solid var(--border-color)", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, color: "var(--text-secondary)" }}
              >
                Hide ✕
              </button>
            </div>
            <BookingHistory bookings={bookings} />
          </motion.div>
        )}

        {/* My Favourites — shown inline below grid */}
        {showFavourites && (
          <motion.div
            ref={favouritesRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: 40 }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 className="section-label" style={{ margin: 0 }}>My Favourites</h3>
              <button
                onClick={() => setShowFavourites(false)}
                style={{ background: "none", border: "1.5px solid var(--border-color)", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, color: "var(--text-secondary)" }}
              >
                Hide ✕
              </button>
            </div>
            <Favourites favourites={favourites} />
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default Profile;