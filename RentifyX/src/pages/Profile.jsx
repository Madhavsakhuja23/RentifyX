import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, CalendarCheck, Heart, Star, Clock, Edit, Trash2, Home, Car, Search, Heart as HeartFilled } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/Header/Header";
import ProfileInfo from "../components/Profile/ProfileInfo";
import EditProfile from "../components/Profile/EditProfile";
import BookingHistory from "../components/Profile/BookingHistory";
import Favourites from "../components/Profile/Favourites";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [editMode, setEditMode] = useState(false);

  const currentUserStr = localStorage.getItem("currentUser");
  const user = currentUserStr && currentUserStr !== "undefined" && currentUserStr !== "null" ? JSON.parse(currentUserStr) : null;
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  const favourites = JSON.parse(localStorage.getItem("favourites") || "[]");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

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
            <button className="edit-profile-btn" onClick={() => { setActiveTab("overview"); setEditMode(true); }}>
              <Edit size={16} />
              Edit Profile
            </button>
            <button className="logout-profile-btn" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          className="profile-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="stat-card">
            <p className="stat-label">FAVOURITES</p>
            <h3>{favourites.length}</h3>
            <p className="stat-desc">Saved listings</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">BOOKINGS</p>
            <h3>{bookings.length}</h3>
            <p className="stat-desc">All time bookings</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">ACTIVE RENTALS</p>
            <h3>{bookings.filter(b => b.status === "upcoming").length}</h3>
            <p className="stat-desc">Currently active</p>
          </div>

        </motion.div>

        {/* Tabs */}
        <motion.div
          className="profile-tabs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <button
            className={activeTab === "overview" ? "tab active" : "tab"}
            onClick={() => { setActiveTab("overview"); setEditMode(false); }}
          >
            Overview
          </button>
          <button
            className={activeTab === "favourites" ? "tab active" : "tab"}
            onClick={() => setActiveTab("favourites")}
          >
            Favourites
          </button>
          <button
            className={activeTab === "activity" ? "tab active" : "tab"}
            onClick={() => setActiveTab("activity")}
          >
            Activity
          </button>
        </motion.div>

        {/* Quick Actions (Overview tab) */}
        {activeTab === "overview" && !editMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="section-label">Quick Actions</h3>
            <div className="quick-actions-grid">
              <div className="quick-action-card" onClick={() => navigate("/dwellings")}>
                <Home size={28} color="rgb(255, 102, 0)" />
                <span>Browse Dwellings</span>
              </div>
              <div className="quick-action-card" onClick={() => navigate("/driveables")}>
                <Car size={28} color="rgb(255, 102, 0)" />
                <span>Browse Driveables</span>
              </div>
              <div className="quick-action-card" onClick={() => setActiveTab("activity")}>
                <Search size={28} color="rgb(255, 102, 0)" />
                <span>My Bookings</span>
              </div>
              <div className="quick-action-card" onClick={() => setActiveTab("favourites")}>
                <HeartFilled size={28} color="rgb(255, 102, 0)" />
                <span>My Favourites</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Edit Profile */}
        {activeTab === "overview" && editMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <EditProfile user={user} setEditMode={setEditMode} />
          </motion.div>
        )}

        {/* Booking History (Activity) */}
        {activeTab === "activity" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <BookingHistory />
          </motion.div>
        )}

        {/* Favourites */}
        {activeTab === "favourites" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Favourites />
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default Profile;