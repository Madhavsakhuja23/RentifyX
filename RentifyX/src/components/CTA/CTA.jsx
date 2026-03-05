import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import "./CTA.css";

const CTA = () => {
  return (
    <section className="cta-section">
      <div className="cta-overlay" />

      <div className="container text-center position-relative">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          viewport={{ once: true }}
          className="cta-title"
        >
          Ready to start renting smarter?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          viewport={{ once: true }}
          className="cta-subtitle"
        >
          Join thousands of users finding homes, vehicles, and stays on RentifyX.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          viewport={{ once: true }}
          className="cta-actions"
        >
          <Link to="/signup" className="cta-btn primary">
            Create Account
            <ArrowRight size={18} />
          </Link>

          <Link to="/listings" className="cta-btn secondary">
            Browse Listings
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;