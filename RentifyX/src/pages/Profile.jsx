import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, CalendarCheck, Heart, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/Header/Header";

import ProfileInfo from "../components/Profile/ProfileInfo";
import EditProfile from "../components/Profile/EditProfile";
import BookingHistory from "../components/Profile/BookingHistory";
import Favourites from "../components/Profile/Favourites";

import "./Profile.css";

const Profile = () => {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
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

  return (
    <div className="profile-wrapper">

      <Header />

      <div className="container profile-page">

        {/* Header */}
        <div className="profile-header-main">

          <div className="header-left">
            <button
              className="back-btn"
              onClick={() => navigate("/")}
              title="Back to home"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1>My Profile</h1>
              <p className="profile-subtitle">
                Welcome back, <strong>{user?.name}</strong>
              </p>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>

        </div>


        {/* Stats */}
        <div className="profile-stats">

          <div className="stat-card">
            <CalendarCheck size={22} />
            <h3>{bookings.length}</h3>
            <p>Total Bookings</p>
          </div>

          <div className="stat-card">
            <Clock size={22} />
            <h3>{bookings.filter(b => b.status === "upcoming").length}</h3>
            <p>Active Rentals</p>
          </div>

          <div className="stat-card">
            <Heart size={22} />
            <h3>{favourites.length}</h3>
            <p>Favourites</p>
          </div>

          <div className="stat-card">
            <Star size={22} />
            <h3>4.9</h3>
            <p>User Rating</p>
          </div>

        </div>


        {/* Tabs */}
        <div className="profile-tabs">

          <button
            className={activeTab === "profile" ? "tab active" : "tab"}
            onClick={() => setActiveTab("profile")}
          >
            Profile Info
          </button>

          <button
            className={activeTab === "bookings" ? "tab active" : "tab"}
            onClick={() => setActiveTab("bookings")}
          >
            Booking History
          </button>

          <button
            className={activeTab === "favourites" ? "tab active" : "tab"}
            onClick={() => setActiveTab("favourites")}
          >
            Favourites
          </button>

        </div>


        {/* Profile Info */}
        {activeTab === "profile" && !editMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ProfileInfo user={user} setEditMode={setEditMode} />
          </motion.div>
        )}

        {/* Edit Profile */}
        {activeTab === "profile" && editMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <EditProfile user={user} setEditMode={setEditMode} />
          </motion.div>
        )}

        {/* Booking History */}
        {activeTab === "bookings" && (
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