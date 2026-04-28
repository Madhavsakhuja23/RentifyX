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
import { useSocket } from "../../seller/context/SocketContext";
import "./Header.css";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logOut } = useAuth();
  const { unreadCount } = useSocket() || { unreadCount: 0 };
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  const getActiveClass = (path) =>
    location.pathname === path ||
      (path.includes("?") && location.pathname + location.search === path)
      ? "mobile-link active-item"
      : "mobile-link";

  const getDesktopActiveClass = (path) =>
    location.pathname === path ||
      (path.includes("?") && location.pathname + location.search === path) ||
      (path !== "/" && location.pathname.startsWith(path + "/"))
      ? "nav-link-custom active-nav"
      : "nav-link-custom";

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
            <Link className={getDesktopActiveClass("/dwellings")} to="/dwellings">Dwellings</Link>
            <Link className={getDesktopActiveClass("/driveables")} to="/driveables">Driveables</Link>
            {isLoggedIn ? (
              <Link className={`${getDesktopActiveClass("/messages")} position-relative`} to="/messages">
                Messages
                {unreadCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                    {unreadCount}
                  </span>
                )}
              </Link>
            ) : (
              <Link className={getDesktopActiveClass("/login")} to="/login">Messages</Link>
            )}
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
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={18} />
                Profile
              </Link>

              <Link
                className={`mobile-link position-relative ${currentPath === "/messages" ? "active-item" : ""}`}
                to={isLoggedIn ? "/messages" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
              >
                💬 Messages
                {isLoggedIn && unreadCount > 0 && (
                  <span className="badge rounded-pill bg-danger ms-2">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <Link
                className={`mobile-link ${currentPath.includes("bookings") ? "active-item" : ""
                  }`}
                to="/profile?tab=bookings"
                onClick={() => setMobileMenuOpen(false)}
              >
                🏠 Bookings
              </Link>

              <Link
                className={`mobile-link ${currentPath.includes("wishlist") ? "active-item" : ""
                  }`}
                to="/profile?tab=wishlist"
                onClick={() => setMobileMenuOpen(false)}
              >
                ❤️ Wishlist
              </Link>

              <Link
                className={`mobile-link ${currentPath.includes("settings") ? "active-item" : ""
                  }`}
                to="/profile?tab=settings"
                onClick={() => setMobileMenuOpen(false)}
              >
                ⚙️ Settings
              </Link>

              <button
                className="mobile-link logout-item"
                onClick={() => {
                  if (isLoggedIn) {
                    logOut();
                    navigate("/");
                  } else {
                    navigate("/login");
                  }

                  setMobileMenuOpen(false);
                }}
              >
                {isLoggedIn ? <LogOut size={18} /> : <User size={18} />}
                {isLoggedIn ? "Logout" : "Login"}
              </button>

            </motion.nav>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
};

export default Header;