import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="bg-light border-top">
      <div className="container py-5">
        <div className="row g-4">
          
          {/* Brand Section */}
          <div className="col-12 col-md-3">
            <Link
              to="/"
              className="d-flex align-items-center gap-2 text-decoration-none mb-3"
            >
              <div className="footer-logo">R</div>
              <span className="fw-bold fs-5 text-dark">RentifyX</span>
            </Link>

            <p className="text-muted small">
              Your unified platform for rental and travel resource management.
              Find properties, vehicles, and travel stays all in one place.
            </p>

            <div className="d-flex gap-3 mt-3">
              <a href="#" className="footer-icon">
                <Facebook size={20} />
              </a>
              <a href="#" className="footer-icon">
                <Twitter size={20} />
              </a>
              <a href="#" className="footer-icon">
                <Instagram size={20} />
              </a>
              <a href="#" className="footer-icon">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="col-6 col-md-3">
            <h6 className="fw-semibold mb-3">Categories</h6>
            <ul className="list-unstyled small">
              <li><Link className="footer-link" to="/listings?category=properties">Properties</Link></li>
              <li><Link className="footer-link" to="/listings?category=vehicles">Vehicles</Link></li>
              <li><Link className="footer-link" to="/listings?category=travel">Travel Stays</Link></li>
              <li><Link className="footer-link" to="/listings?category=equipment">Equipment</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-6 col-md-3">
            <h6 className="fw-semibold mb-3">Company</h6>
            <ul className="list-unstyled small">
              <li><Link className="footer-link" to="/about">About Us</Link></li>
              <li><Link className="footer-link" to="/careers">Careers</Link></li>
              <li><Link className="footer-link" to="/blog">Blog</Link></li>
              <li><Link className="footer-link" to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-6 col-md-3">
            <h6 className="fw-semibold mb-3">Support</h6>
            <ul className="list-unstyled small">
              <li><Link className="footer-link" to="/help">Help Center</Link></li>
              <li><Link className="footer-link" to="/privacy">Privacy Policy</Link></li>
              <li><Link className="footer-link" to="/terms">Terms & Conditions</Link></li>
              <li><Link className="footer-link" to="/faq">FAQ</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-top mt-4 pt-3 text-center small text-muted">
          © 2026 RentifyX. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
