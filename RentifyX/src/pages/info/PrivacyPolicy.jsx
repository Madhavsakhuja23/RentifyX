import { motion } from "framer-motion";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./InfoPages.css";

const PrivacyPolicy = () => {
  return (
    <div className="info-page">
      <Header />

      <section className="info-hero">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="info-hero-badge">Legal</span>
          <h1>Privacy Policy</h1>
          <p>Your privacy matters. Learn how we collect, use, and protect your personal information.</p>
        </motion.div>
      </section>

      <div className="info-content">
        <div className="legal-content">
          <p className="last-updated">Last updated: April 15, 2026</p>

          <h3>1. Information We Collect</h3>
          <p>We collect information you provide directly, such as your name, email address, phone number, and payment details when you create an account or make a booking. We also collect usage data automatically, including IP address, browser type, pages visited, and interaction patterns to improve our services.</p>

          <h3>2. How We Use Your Information</h3>
          <p>We use your personal information to provide, maintain, and improve our services; process transactions and send related information; send promotional communications (with your consent); detect, prevent, and address technical issues and fraud; and comply with legal obligations.</p>

          <h3>3. Information Sharing</h3>
          <p>We do not sell your personal information. We may share it with trusted service providers who assist in operating our platform, when required by law or to protect our rights, and with other users as part of the rental process (e.g., sharing your name with a host after a confirmed booking).</p>

          <h3>4. Data Security</h3>
          <p>We implement industry-standard security measures including encryption, secure servers, and regular security audits. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security of your data.</p>

          <h3>5. Cookies & Tracking</h3>
          <p>We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can control cookie preferences through your browser settings at any time.</p>

          <h3>6. Your Rights</h3>
          <p>You have the right to access, update, or delete your personal information at any time. You may also opt out of marketing communications and request a copy of your data. To exercise these rights, contact us at privacy@rentifyx.com.</p>

          <h3>7. Changes to This Policy</h3>
          <p>We may update this privacy policy from time to time. We will notify you of significant changes via email or through a prominent notice on our platform. Your continued use constitutes acceptance of the revised policy.</p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
