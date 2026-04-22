import { motion } from "framer-motion";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./InfoPages.css";

const Terms = () => {
  return (
    <div className="info-page">
      <Header />

      <section className="info-hero">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="info-hero-badge">Legal</span>
          <h1>Terms & Conditions</h1>
          <p>Please read these terms carefully before using the RentifyX platform.</p>
        </motion.div>
      </section>

      <div className="info-content">
        <div className="legal-content">
          <p className="last-updated">Last updated: April 15, 2026</p>

          <h3>1. Acceptance of Terms</h3>
          <p>By accessing or using RentifyX, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services. These terms apply to all users, including browsers, renters, hosts, and contributors of content.</p>

          <h3>2. User Accounts</h3>
          <p>You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate and complete information during registration and keep it up to date.</p>

          <h3>3. Listings & Bookings</h3>
          <p>Hosts are responsible for the accuracy of their listings, including descriptions, pricing, and availability. Renters agree to use rented items or properties responsibly. RentifyX acts as an intermediary and is not responsible for the quality or condition of listed items.</p>

          <h3>4. Payments & Fees</h3>
          <p>All payments are processed securely through our platform. Service fees are clearly displayed before confirmation. Refunds are subject to the cancellation policy applicable to each listing. RentifyX reserves the right to modify fees with prior notice.</p>

          <h3>5. Cancellation Policy</h3>
          <p>Cancellation policies vary by listing. Renters should review the applicable cancellation policy before booking. Hosts may set their own policies within the guidelines provided by RentifyX. Emergency circumstances may qualify for additional consideration.</p>

          <h3>6. Prohibited Activities</h3>
          <p>Users are prohibited from posting false or misleading content, using the platform for illegal activities, harassing or discriminating against other users, attempting to circumvent platform fees, and creating multiple accounts for fraudulent purposes.</p>

          <h3>7. Intellectual Property</h3>
          <p>All content on RentifyX, including logos, designs, text, and software, is the property of RentifyX or its licensors and is protected by intellectual property laws. Users retain ownership of content they post but grant RentifyX a license to use it on the platform.</p>

          <h3>8. Limitation of Liability</h3>
          <p>RentifyX is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability shall not exceed the fees paid by you in the 12 months preceding the claim.</p>

          <h3>9. Governing Law</h3>
          <p>These terms are governed by the laws of India. Any disputes shall be resolved through arbitration in accordance with the Arbitration and Conciliation Act, 1996, with proceedings held in New Delhi.</p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;
