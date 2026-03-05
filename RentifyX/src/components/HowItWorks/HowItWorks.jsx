import { motion } from "framer-motion";
import { Search, Lock, Smile } from "lucide-react";
import "./HowItWorks.css";

const steps = [
  { step: "Search", desc: "Find what you need", icon: Search, number: "01" },
  { step: "Book", desc: "Instant & secure booking", icon: Lock, number: "02" },
  { step: "Enjoy", desc: "Use it stress-free", icon: Smile, number: "03" },
];

const HowItWorks = () => {
  return (
    <section className="how-section">
      <div className="container">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-5"
        >
          <h2 className="how-title">How It Works</h2>
          <p className="how-subtitle">
            Rent or list anything in just three simple steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="steps-wrapper">
          <div className="steps-container">
            <div className="row g-4 justify-content-center">
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="col-12 col-md-6 col-lg-4"
                  >
                    <div className="step-card">
                      <span className="step-number">{s.number}</span>

                      <div className="step-icon">
                        <Icon size={36} />
                      </div>

                      <h5>{s.step}</h5>
                      <p>{s.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;