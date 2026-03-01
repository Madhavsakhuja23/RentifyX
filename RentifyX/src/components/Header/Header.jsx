import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./Header.css";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem("token"));

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
              <div className="logo-box">R</div>
              <span className="logo-text">RentifyX</span>
            </Link>
          </motion.div>

          {/* Search (Desktop) */}
          <form onSubmit={handleSearch} className="search-bar d-none d-lg-flex">
            <input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <Search size={18} />
            </button>
          </form>

          {/* Right section */}
          <div className="header-right d-none d-md-flex">
            <nav className="nav-section">
              <Link className="nav-link-custom" to="/listings?category=dwellings">Dwellings</Link>
              <Link className="nav-link-custom" to="/listings?category=driveables">Driveables</Link>
              <Link className="nav-link-custom" to="/messages">Messages</Link>
            </nav>

            <button
              onClick={handleProfileClick}
              className="profile-btn"
              title={isLoggedIn ? "Profile" : "Login"}
            >
              <User size={18} />
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="btn d-md-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
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
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-btn">
                  <Search size={16} />
                </button>
              </form>

              <Link className="mobile-link" to="/listings">Browse Listings</Link>
              <Link className="mobile-link" to="/listings?category=properties">Properties</Link>
              <Link className="mobile-link" to="/listings?category=vehicles">Vehicles</Link>
              <Link className="mobile-link" to="/listings?category=travel">Travel Stays</Link>

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