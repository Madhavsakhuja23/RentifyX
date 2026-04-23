import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import emailjs from "@emailjs/browser";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./InfoPages.css";

/* ── EmailJS credentials (same service & public key used in ListingDetails) ── */
const EMAILJS_SERVICE_ID = "service_knofxlg";
const EMAILJS_TEMPLATE_ID = "template_aaxyavm";
const EMAILJS_PUBLIC_KEY = "hYGuv7-7U5iJ-Pbgc";


/* ── Validation helpers ── */
const validators = {
  name: (val) => {
    if (!val.trim()) return "Full name is required";
    if (val.trim().length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s'-]+$/.test(val.trim())) return "Name can only contain letters, spaces, hyphens, and apostrophes";
    return "";
  },
  email: (val) => {
    if (!val.trim()) return "Email address is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return "Please enter a valid email address";
    return "";
  },
  subject: (val) => {
    if (!val.trim()) return "Subject is required";
    if (val.trim().length < 3) return "Subject must be at least 3 characters";
    return "";
  },
  message: (val) => {
    if (!val.trim()) return "Message is required";
    if (val.trim().length < 10) return "Message must be at least 10 characters";
    return "";
  },
};

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [statusMessage, setStatusMessage] = useState("");

  /* ── field change ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error on type if field was touched
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
    }
  };

  /* ── field blur → validate ── */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
  };

  /* ── validate all fields ── */
  const validateAll = () => {
    const newErrors = {};
    let isValid = true;
    for (const field of Object.keys(validators)) {
      const err = validators[field](form[field]);
      newErrors[field] = err;
      if (err) isValid = false;
    }
    setErrors(newErrors);
    setTouched({ name: true, email: true, subject: true, message: true });
    return isValid;
  };

  /* ── submit handler ── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) return;

    setStatus("sending");
    setStatusMessage("");

    try {
      console.log(EMAILJS_SERVICE_ID);
      console.log(EMAILJS_PUBLIC_KEY);
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );

      setStatus("success");
      setStatusMessage("Your message has been sent successfully! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setErrors({});
      setTouched({});

      // Reset success status after 6 seconds
      setTimeout(() => {
        setStatus("idle");
        setStatusMessage("");
      }, 6000);
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus("error");
      setStatusMessage("Failed to send your message. Please try again or email us directly at support@rentifyx.com");

      // Reset error status after 6 seconds
      setTimeout(() => {
        setStatus("idle");
        setStatusMessage("");
      }, 6000);
    }
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
          <form className="contact-form" ref={formRef} onSubmit={handleSubmit} noValidate>

            {/* ── Status Banner ── */}
            <AnimatePresence>
              {status === "success" && (
                <motion.div
                  className="contact-status contact-status--success"
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle size={20} />
                  <span>{statusMessage}</span>
                </motion.div>
              )}
              {status === "error" && (
                <motion.div
                  className="contact-status contact-status--error"
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlertCircle size={20} />
                  <span>{statusMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Name ── */}
            <div className={`form-group ${errors.name && touched.name ? "form-group--error" : ""}`}>
              <label htmlFor="contact-name">Full Name</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="John Doe"
                disabled={status === "sending"}
              />
              {errors.name && touched.name && (
                <motion.span
                  className="form-error"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertCircle size={14} /> {errors.name}
                </motion.span>
              )}
            </div>

            {/* ── Email ── */}
            <div className={`form-group ${errors.email && touched.email ? "form-group--error" : ""}`}>
              <label htmlFor="contact-email">Email Address</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="john@example.com"
                disabled={status === "sending"}
              />
              {errors.email && touched.email && (
                <motion.span
                  className="form-error"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertCircle size={14} /> {errors.email}
                </motion.span>
              )}
            </div>

            {/* ── Subject ── */}
            <div className={`form-group ${errors.subject && touched.subject ? "form-group--error" : ""}`}>
              <label htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="How can we help?"
                disabled={status === "sending"}
              />
              {errors.subject && touched.subject && (
                <motion.span
                  className="form-error"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertCircle size={14} /> {errors.subject}
                </motion.span>
              )}
            </div>

            {/* ── Message ── */}
            <div className={`form-group ${errors.message && touched.message ? "form-group--error" : ""}`}>
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Tell us more... (minimum 10 characters)"
                disabled={status === "sending"}
              />
              <div className="form-char-count">
                <span className={form.message.length > 0 && form.message.length < 10 ? "form-char-count--warn" : ""}>
                  {form.message.length}
                </span>
                {form.message.length > 0 && form.message.length < 10 && (
                  <span className="form-char-count--warn"> / 10 min</span>
                )}
              </div>
              {errors.message && touched.message && (
                <motion.span
                  className="form-error"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertCircle size={14} /> {errors.message}
                </motion.span>
              )}
            </div>

            {/* ── Submit Button ── */}
            <button
              type="submit"
              className={`submit-btn ${status === "sending" ? "submit-btn--sending" : ""} ${status === "success" ? "submit-btn--success" : ""}`}
              disabled={status === "sending" || status === "success"}
            >
              {status === "sending" ? (
                <>
                  <Loader2 size={16} className="spin-icon" style={{ marginRight: 8, display: "inline" }} />
                  Sending...
                </>
              ) : status === "success" ? (
                <>
                  <CheckCircle size={16} style={{ marginRight: 8, display: "inline" }} />
                  Sent!
                </>
              ) : (
                <>
                  <Send size={16} style={{ marginRight: 8, display: "inline" }} />
                  Send Message
                </>
              )}
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
