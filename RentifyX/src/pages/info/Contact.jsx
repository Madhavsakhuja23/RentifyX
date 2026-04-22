import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./InfoPages.css";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="info-page">
      <Header />

      <section className="info-hero">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="info-hero-badge">Get In Touch</span>
          <h1>Contact Us</h1>
          <p>Have a question or feedback? We'd love to hear from you. Our team is here to help.</p>
        </motion.div>
      </section>

      <div className="info-content-wide">
        <div className="contact-grid">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" required />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us more..." required />
            </div>
            <button type="submit" className="submit-btn">
              <Send size={16} style={{ marginRight: 8, display: "inline" }} />
              Send Message
            </button>
          </form>

          <div className="contact-info-cards">
            <div className="contact-info-card">
              <div className="contact-info-icon"><Mail size={22} /></div>
              <div>
                <h4>Email</h4>
                <p>support@rentifyx.com</p>
              </div>
            </div>
            <div className="contact-info-card">
              <div className="contact-info-icon"><Phone size={22} /></div>
              <div>
                <h4>Phone</h4>
                <p>+91 98765 43210</p>
              </div>
            </div>
            <div className="contact-info-card">
              <div className="contact-info-icon"><MapPin size={22} /></div>
              <div>
                <h4>Office</h4>
                <p>RentifyX HQ, Sector 62, Noida, UP</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
