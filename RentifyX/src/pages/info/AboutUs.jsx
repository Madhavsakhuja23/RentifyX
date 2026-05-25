import { motion } from "framer-motion";
import { Users, Target, Globe, Shield, Heart, Zap } from "lucide-react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./InfoPages.css";

const AboutUs = () => {
  return (
    <div className="info-page">
      <Header />

      <section className="info-hero">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="info-hero-badge">Our Story</span>
          <h1>About RentifyX</h1>
          <p>We're building the future of renting — making it seamless, transparent, and accessible for everyone around the world.</p>
        </motion.div>
      </section>

      <div className="info-content-wide">
        <div className="info-stats-row">
          <div className="info-stat">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Active Users</span>
          </div>
          <div className="info-stat">
            <span className="stat-number">12K+</span>
            <span className="stat-label">Listings</span>
          </div>
          <div className="info-stat">
            <span className="stat-number">98%</span>
            <span className="stat-label">Satisfaction</span>
          </div>
          <div className="info-stat">
            <span className="stat-number">30+</span>
            <span className="stat-label">Cities</span>
          </div>
        </div>

        <div className="info-section">
          <h2>
            <span className="section-icon"><Target size={20} /></span>
            Our Mission
          </h2>
          <p>
            At RentifyX, we believe everyone deserves easy access to quality rentals. Whether it's a cozy apartment for a long stay, a sleek vehicle for a road trip, or premium equipment for a project — we bring it all under one roof. Our platform is designed to eliminate the friction in renting, empowering both renters and hosts with smart tools, transparent pricing, and a community built on trust.
          </p>
        </div>

        <div className="info-section">
          <h2>
            <span className="section-icon"><Heart size={20} /></span>
            Our Values
          </h2>
          <div className="info-cards-grid">
            <div className="info-card">
              <div className="info-card-icon"><Shield size={24} /></div>
              <h3>Trust & Safety</h3>
              <p>Every listing is verified and every transaction is secured. Your safety is our top priority.</p>
            </div>
            <div className="info-card">
              <div className="info-card-icon"><Globe size={24} /></div>
              <h3>Accessibility</h3>
              <p>Renting should be simple and accessible to everyone, regardless of location or background.</p>
            </div>
            <div className="info-card">
              <div className="info-card-icon"><Zap size={24} /></div>
              <h3>Innovation</h3>
              <p>We continuously push boundaries to deliver the smartest, most intuitive rental experience.</p>
            </div>
            <div className="info-card">
              <div className="info-card-icon"><Users size={24} /></div>
              <h3>Community</h3>
              <p>We're more than a marketplace — we're a thriving community of hosts and renters.</p>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h2>
            <span className="section-icon"><Users size={20} /></span>
            Our Team
          </h2>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-avatar">M</div>
              <h4>Madhav Sakhuja</h4>
              
            </div>
            <div className="team-card">
              <div className="team-avatar">M</div>
              <h4>Mohak Taneja</h4>
         
            </div>
            <div className="team-card">
              <div className="team-avatar">S</div>
              <h4>Saksham Jain</h4>
              
            </div>
            <div className="team-card">
              <div className="team-avatar">M</div>
              <h4>Mansha Verma</h4>
              
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
