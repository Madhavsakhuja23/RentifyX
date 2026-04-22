import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./InfoPages.css";

const faqData = [
  {
    q: "What is RentifyX?",
    a: "RentifyX is a unified rental platform where you can find and book homes, vehicles, travel stays, and equipment — all in one place. We connect renters with verified hosts to make the rental experience seamless and secure."
  },
  {
    q: "How do I create an account?",
    a: "Click the 'Sign Up' button on the homepage or header. Fill in your name, email, and password. Once registered, you can immediately start browsing listings and making bookings."
  },
  {
    q: "Is my payment information secure?",
    a: "Absolutely. We use industry-standard encryption and secure payment gateways to process all transactions. Your payment information is never stored on our servers."
  },
  {
    q: "Can I cancel a booking?",
    a: "Yes, you can cancel a booking from your profile page. Refund eligibility depends on the cancellation policy set by the host. Each listing clearly displays its cancellation terms before you book."
  },
  {
    q: "How do I become a host?",
    a: "Once you have an account, navigate to the Seller Dashboard from the menu. From there, you can add your dwellings or vehicles, set pricing, and start accepting bookings."
  },
  {
    q: "What if I have a problem with a rental?",
    a: "Contact our support team immediately through the Help Center or email us at support@rentifyx.com. We mediate disputes and work with both parties to find a fair resolution."
  },
  {
    q: "Are there any fees for using RentifyX?",
    a: "Creating an account and browsing listings is completely free. A small service fee is applied to bookings, which is clearly displayed before you confirm your reservation."
  },
  {
    q: "Can I list multiple properties or vehicles?",
    a: "Yes! There's no limit on the number of listings you can create. Each listing is managed independently through your Seller Dashboard."
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="info-page">
      <Header />

      <section className="info-hero">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="info-hero-badge">FAQ</span>
          <h1>Frequently Asked Questions</h1>
          <p>Quick answers to the most common questions about RentifyX.</p>
        </motion.div>
      </section>

      <div className="info-content">
        <div className="faq-list">
          {faqData.map((item, i) => (
            <motion.div
              key={i}
              className={`faq-item ${openIndex === i ? "open" : ""}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                className="faq-question"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                {item.q}
                <ChevronDown size={18} className="faq-chevron" />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="faq-answer">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;
