import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "../common/Button";
import "./CTA.css";

// CTA means call to action
const CTA = () => {
  return (
    <section className="cta-section">
      <div className="cta-overlay"></div>
      <div className="container text-center position-relative">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="cta-title"
        >
          Ready to Start Renting?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          viewport={{ once: true }}
          className="cta-subtitle"
        >
          Join thousands of happy users on RentifyX today
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          viewport={{ once: true }}
          className="d-flex justify-content-center gap-3 flex-wrap cta-buttons"
        >
          <Link to="/signup" className="cta-btn cta-btn-primary">
            <span>Create Account</span>
            <ArrowRight size={18} />
          </Link>

          <Link to="/listings" className="cta-btn cta-btn-secondary">
            <span>Browse Listings</span>
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
