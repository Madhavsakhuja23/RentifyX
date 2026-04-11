import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./Header.css";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const currentUserStr = localStorage.getItem("currentUser");
  const user = currentUserStr && currentUserStr !== "undefined" && currentUserStr !== "null" ? JSON.parse(currentUserStr) : null;
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token && token !== "undefined" && token !== "null");

  const handleProfileClick = () => {
    navigate(isLoggedIn ? "/profile" : "/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
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

          {/* Search (Desktop) */}
          <form onSubmit={handleSearch} className="search-bar d-none d-lg-flex">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <Search size={18} />
            </button>
          </form>

          {/* Desktop Nav */}
          <nav className="d-none d-md-flex gap-4 nav-section">
            <Link className="nav-link-custom" to="/dwellings">Dwellings</Link>
            <Link className="nav-link-custom" to="/driveables">Driveables</Link>
            <Link className="nav-link-custom" to="/messages">Messages</Link>
          </nav>

          {/* Right Section */}
          <div className="header-right">

            {/* Profile Button */}
            <button
              onClick={handleProfileClick}
              className={isLoggedIn ? "profile-avatar-btn" : "profile-btn"}
              title={isLoggedIn ? "Profile" : "Login"}
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

            {/* Mobile Toggle */}
            <button
              className="btn d-md-none mobile-toggle"
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
              <form onSubmit={handleSearch} className="mobile-search">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input w-100"
                />
                <button type="submit" className="search-btn">
                  <Search size={16} />
                </button>
              </form>

              <Link className="mobile-link" to="/dwellings">Dwellings</Link>
              <Link className="mobile-link" to="/driveables">Driveables</Link>
              <Link className="mobile-link" to="/messages">Messages</Link>

              <button onClick={handleProfileClick} className="mobile-link">
                <User size={16} />
                {isLoggedIn ? "My Profile" : "Login / Sign up"}
              </button>
            </motion.nav>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
};

export default Header;