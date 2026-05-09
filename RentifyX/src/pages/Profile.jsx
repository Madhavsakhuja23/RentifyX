import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Briefcase, Heart, Settings, Edit, ChevronRight, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header/Header";
import EditProfile from "../components/Profile/EditProfile";
import BookingHistory from "../components/Profile/BookingHistory";
import Favourites from "../components/Profile/Favourites";
import { getMyBookingsApi, getWishlistApi } from "../api";
import { useAuth } from "../seller/context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logOut } = useAuth();
  const [activeTab, setActiveTab] = useState("about");

  const [bookings, setBookings] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  const bookingsRef = useRef(null);
  const favouritesRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch Bookings
        const bookingsData = await getMyBookingsApi();
        const formattedBookings = bookingsData.map(b => {
          const isVehicle = b.listingId?.category === "Vehicle";
          return {
            id: b._id,
            title: b.listingId?.title || "Unknown Item",
            location: b.listingId?.location || "",
            image: b.listingId?.images?.[0]?.url || "",
            checkIn: b.checkIn,
            checkOut: b.checkOut,
            amount: `₹${b.totalPrice.toLocaleString("en-IN")}`,
            status: new Date(b.checkIn) > new Date() ? "upcoming" : "completed",
            utr: b.utr,
            type: isVehicle ? 'driveable' : 'dwelling',
            listingId: b.listingId?._id || b.listingId
          };
        });
        setBookings(formattedBookings);

        // Fetch Wishlist
        const wishlistData = await getWishlistApi();
        const formattedFavs = (wishlistData.listings || []).map(l => {
          const isVehicle = l.category === "Vehicle";
          return {
            id: l._id,
            title: l.title,
            location: l.location,
            image: l.images?.[0]?.url || "",
            price: l.price,
            priceUnit: isVehicle ? (l.timespan === "hour" ? "hr" : "day") : (l.timespan === "night" ? "night" : l.timespan),
            type: isVehicle ? 'driveable' : 'dwelling'
          };
        });
        setFavourites(formattedFavs);

      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleLogout = () => {
    logOut();
    navigate("/");
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    switch(activeTab) {
      case "about":
        return (
          <motion.div 
            key="about"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="top-row">
              <h1>About me</h1>
              <button
                className="edit-btn-premium"
                onClick={() => setActiveTab("settings")}
              >
                <Edit size={16} /> Edit Profile
              </button>
            </div>

            <div className="about-grid-premium">
              <div className="user-card-premium">
                <div className="avatar-premium-wrap">
                  <div className="avatar-premium">
                    {user?.name?.charAt(0)?.toUpperCase() || "G"}
                  </div>
                  <div className="avatar-ring"></div>
                </div>
                <h2>{user?.name || "Guest User"}</h2>
                <p className="guest-badge">Premium Guest</p>
                <div className="user-stats">
                  <div className="stat">
                    <span>{bookings.length}</span>
                    <label>Bookings</label>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat">
                    <span>{favourites.length}</span>
                    <label>Wishlist</label>
                  </div>
                </div>
              </div>

              <div className="complete-card-premium">
                <div className="complete-card-content">
                  {(user?.phone && user?.location && user?.dob) ? (
                    <>
                      <h3>You're All Set!</h3>
                      <p>
                        Your profile is complete. You now have full access to exclusive premium stays and seamless booking experiences all around the world.
                      </p>
                      <button className="start-btn-premium" onClick={() => setActiveTab("bookings")}>
                        View Bookings
                      </button>
                    </>
                  ) : (
                    <>
                      <h3>Unlock Your Journey</h3>
                      <p>
                        Complete your profile to build trust with hosts and gain access to exclusive premium stays all around the world.
                      </p>
                      <button className="start-btn-premium" onClick={() => setActiveTab("settings")}>
                        Complete Profile
                      </button>
                    </>
                  )}
                </div>
                <div className="complete-card-bg"></div>
              </div>
            </div>
          </motion.div>
        );
      case "bookings":
        return (
          <motion.div
            key="bookings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            ref={bookingsRef}
          >
            <BookingHistory bookings={bookings} />
          </motion.div>
        );
      case "favourites":
        return (
          <motion.div
            key="favourites"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            ref={favouritesRef}
          >
            <Favourites favourites={favourites} />
          </motion.div>
        );
      case "settings":
        return (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <EditProfile
              user={user}
              setEditMode={(mode) => !mode && setActiveTab("about")}
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-wrapper-premium">
      <Header />

      <div className="profile-container-premium">
        {/* LEFT PANEL */}
        <motion.div 
          className="sidebar-premium"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="sidebar-header">
            <div className="sidebar-avatar-small">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <h4>{user?.name || "Guest"}</h4>
              <p>Manage Account</p>
            </div>
          </div>

          <div className="sidebar-nav">
            <button
              className={`nav-item-premium ${activeTab === "about" ? "active" : ""}`}
              onClick={() => handleTabChange("about")}
            >
              <div className="nav-item-icon"><User size={20} /></div>
              <span>About me</span>
              <ChevronRight className="chevron" size={16} />
            </button>

            <button
              className={`nav-item-premium ${activeTab === "bookings" ? "active" : ""}`}
              onClick={() => handleTabChange("bookings")}
            >
              <div className="nav-item-icon">
                <Briefcase size={20} />
                {bookings.length > 0 && <span className="badge">{bookings.length}</span>}
              </div>
              <span>Bookings</span>
              <ChevronRight className="chevron" size={16} />
            </button>

            <button
              className={`nav-item-premium ${activeTab === "favourites" ? "active" : ""}`}
              onClick={() => handleTabChange("favourites")}
            >
              <div className="nav-item-icon">
                <Heart size={20} />
                {favourites.length > 0 && <span className="badge">{favourites.length}</span>}
              </div>
              <span>Wishlist</span>
              <ChevronRight className="chevron" size={16} />
            </button>

            <button
              className={`nav-item-premium ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => handleTabChange("settings")}
            >
              <div className="nav-item-icon"><Settings size={20} /></div>
              <span>Settings</span>
              <ChevronRight className="chevron" size={16} />
            </button>
          </div>
          
          <div className="sidebar-footer">
            <button className="logout-btn-premium" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Log out</span>
            </button>
          </div>
        </motion.div>

        {/* RIGHT SIDE */}
        <div className="main-content-premium">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Profile;