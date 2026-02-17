// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <h3>🚗 RentifyX</h3>
          <p>Your premium vehicle rental platform. Drive the best — cars, bikes, EVs, and bicycles — all at your fingertips.</p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#fleet">Fleet</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#help">Help Center</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Categories</h4>
          <ul>
            <li><a href="#fleet">Cars</a></li>
            <li><a href="#fleet">Bikes & Scooters</a></li>
            <li><a href="#fleet">Electric Vehicles</a></li>
            <li><a href="#fleet">Bicycles</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="#help">FAQs</a></li>
            <li><a href="#help">Contact Us</a></li>
            <li><a href="#help">Cancellation Policy</a></li>
            <li><a href="#help">Terms & Conditions</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} RentifyX. All rights reserved.</p>
        <div className="footer-socials">
          <a href="#" aria-label="Twitter">𝕏</a>
          <a href="#" aria-label="GitHub">⌨</a>
          <a href="#" aria-label="LinkedIn">in</a>
          <a href="#" aria-label="Instagram">📷</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
