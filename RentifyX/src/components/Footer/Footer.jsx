import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="row g-4">

          {/* Brand */}
          <div className="col-12 col-md-3">
            <Link to="/" className="footer-brand">
              <div className="footer-logo">R</div>
              <span className="footer-brand-text">RentifyX</span>
            </Link>

            <p className="footer-desc">
              Your unified platform for rental and travel management.
              Find homes, vehicles and stays — all in one place.
            </p>

            <div className="footer-socials">
              <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Categories */}
          <div className="col-6 col-md-3">
            <h6 className="footer-title">Categories</h6>
            <ul className="footer-list">
              <li><Link to="/listings?category=properties">Properties</Link></li>
              <li><Link to="/listings?category=vehicles">Vehicles</Link></li>
              <li><Link to="/listings?category=travel">Travel Stays</Link></li>
              <li><Link to="/listings?category=equipment">Equipment</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-6 col-md-3">
            <h6 className="footer-title">Company</h6>
            <ul className="footer-list">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-6 col-md-3">
            <h6 className="footer-title">Support</h6>
            <ul className="footer-list">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          © 2026 RentifyX. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;