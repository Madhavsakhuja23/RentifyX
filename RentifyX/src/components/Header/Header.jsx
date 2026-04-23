import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  User,
  Search,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../seller/context/AuthContext";
import "./Header.css";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  const getActiveClass = (path) =>
    location.pathname === path ||
      (path.includes("?") && location.pathname + location.search === path)
      ? "mobile-link active-item"
      : "mobile-link";

  const isLoggedIn = Boolean(user);

  const handleProfileClick = () => {
    navigate(isLoggedIn ? "/profile" : "/login");
  };

  return (
    <header className="header sticky-top">
      <div className="container">
        <div className="header-inner">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="header-left"
          >
            <Link to="/" className="logo-link">
              <span className="logo-text">RentifyX</span>
            </Link>
          </motion.div>



          {/* Desktop Nav */}
          <nav className="d-flex gap-4 nav-section ms-auto">
            <Link className="nav-link-custom" to="/dwellings">Dwellings</Link>
            <Link className="nav-link-custom" to="/driveables">Driveables</Link>
            <Link className="nav-link-custom" to="/messages">Messages</Link>
          </nav>

          {/* Right Section */}
          <div className="header-right">

            <button
              onClick={handleProfileClick}
              className={isLoggedIn ? "profile-avatar-btn" : "profile-btn"}
            >
              {isLoggedIn && user?.photo ? (
                <img src={user.photo} alt="profile" className="nav-avatar" />
              ) : isLoggedIn ? (
                <span className="nav-avatar">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              ) : (
                <User size={18} />
              )}
            </button>

            <button
              className="btn mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>

          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mobile-menu"
            >
              <Link
                className={`mobile-link ${currentPath === "/profile" ? "active-item" : ""
                  }`}
                to="/profile"
              >
                <User size={18} />
                Profile
              </Link>

              <Link
                className={`mobile-link ${currentPath.includes("bookings") ? "active-item" : ""
                  }`}
                to="/profile?tab=bookings"
              >
                🏠 Bookings
              </Link>

              <Link
                className={`mobile-link ${currentPath.includes("wishlist") ? "active-item" : ""
                  }`}
                to="/profile?tab=wishlist"
              >
                ❤️ Wishlist
              </Link>

              <Link
                className={`mobile-link ${currentPath.includes("settings") ? "active-item" : ""
                  }`}
                to="/profile?tab=settings"
              >
                ⚙️ Settings
              </Link>

              <button
                className="mobile-link logout-item"
                onClick={() => {
                  logOut();
                  navigate("/");
                }}
              >
                <LogOut size={18} />
                Logout
              </button>

            </motion.nav>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
};

export default Header;