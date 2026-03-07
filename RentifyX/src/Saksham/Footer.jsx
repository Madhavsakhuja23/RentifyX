import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-auto">
      <div className="container">
        <div className="row g-4 mb-4">
          
          {/* Brand Section */}
          <div className="col-lg-4 col-md-6">
            <h3 className="fw-bold mb-3">🚗 RentifyX</h3>
            <p className="text-secondary pe-lg-4">
              Your premium vehicle rental platform. Drive the best — cars, bikes, EVs, and bicycles — all at your fingertips.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#home" className="text-secondary text-decoration-none">Home</a></li>
              <li className="mb-2"><a href="#fleet" className="text-secondary text-decoration-none">Fleet</a></li>
              <li className="mb-2"><a href="#about" className="text-secondary text-decoration-none">About Us</a></li>
              <li className="mb-2"><a href="#help" className="text-secondary text-decoration-none">Help Center</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-3">Categories</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#fleet" className="text-secondary text-decoration-none">Cars</a></li>
              <li className="mb-2"><a href="#fleet" className="text-secondary text-decoration-none">Bikes & Scooters</a></li>
              <li className="mb-2"><a href="#fleet" className="text-secondary text-decoration-none">Electric Vehicles</a></li>
              <li className="mb-2"><a href="#fleet" className="text-secondary text-decoration-none">Bicycles</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-3">Support</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#help" className="text-secondary text-decoration-none">FAQs</a></li>
              <li className="mb-2"><a href="#help" className="text-secondary text-decoration-none">Contact Us</a></li>
              <li className="mb-2"><a href="#help" className="text-secondary text-decoration-none">Cancellation Policy</a></li>
              <li className="mb-2"><a href="#help" className="text-secondary text-decoration-none">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center pt-4 border-top border-secondary">
          <p className="text-secondary mb-3 mb-md-0 small">
            &copy; {new Date().getFullYear()} RentifyX. All rights reserved.
          </p>
          <div className="d-flex gap-4">
            <a href="#" className="text-secondary text-decoration-none fs-5 hover-white" aria-label="Twitter">𝕏</a>
            <a href="#" className="text-secondary text-decoration-none fs-5 hover-white" aria-label="GitHub">⌨</a>
            <a href="#" className="text-secondary text-decoration-none fs-5 hover-white" aria-label="LinkedIn">in</a>
            <a href="#" className="text-secondary text-decoration-none fs-5 hover-white" aria-label="Instagram">📷</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;