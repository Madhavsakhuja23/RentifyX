import { motion } from "framer-motion";
import { LifeBuoy, BookOpen, MessageCircle, Search, Shield, Headphones } from "lucide-react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./InfoPages.css";

const HelpCenter = () => {
  return (
    <div className="info-page">
      <Header />

      <section className="info-hero">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="info-hero-badge">Support</span>
          <h1>Help Center</h1>
          <p>Find answers to common questions, explore guides, or reach out to our support team.</p>
        </motion.div>
      </section>

      <div className="info-content-wide">
        <div className="info-cards-grid">
          <div className="info-card">
            <div className="info-card-icon"><BookOpen size={24} /></div>
            <h3>Getting Started</h3>
            <p>New to RentifyX? Learn how to create an account, browse listings, and make your first booking with ease.</p>
          </div>
          <div className="info-card">
            <div className="info-card-icon"><Search size={24} /></div>
            <h3>Finding Rentals</h3>
            <p>Learn how to use filters, search by location, compare prices, and find the perfect rental for your needs.</p>
          </div>
          <div className="info-card">
            <div className="info-card-icon"><Shield size={24} /></div>
            <h3>Safety & Trust</h3>
            <p>Understand our verification process, payment protection, and what to do if something goes wrong.</p>
          </div>
          <div className="info-card">
            <div className="info-card-icon"><MessageCircle size={24} /></div>
            <h3>Communication</h3>
            <p>Tips on messaging hosts, negotiating terms, and maintaining clear communication throughout your stay.</p>
          </div>
          <div className="info-card">
            <div className="info-card-icon"><LifeBuoy size={24} /></div>
            <h3>Cancellations & Refunds</h3>
            <p>Understand our cancellation policies, how refunds work, and how to modify existing bookings.</p>
          </div>
          <div className="info-card">
            <div className="info-card-icon"><Headphones size={24} /></div>
            <h3>Contact Support</h3>
            <p>Can't find your answer? Our support team is available 24/7 via email, phone, or live chat.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HelpCenter;
