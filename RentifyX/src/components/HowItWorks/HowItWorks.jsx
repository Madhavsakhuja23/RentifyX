import { motion } from "framer-motion";
import { Search, Lock, Smile } from "lucide-react";
import "./HowItWorks.css";

const steps = [
  { step: "Search", desc: "Find what you need", icon: Search, number: "01", color: "blue" },
  { step: "Book", desc: "Instant & secure booking", icon: Lock, number: "02", color: "orange" },
  { step: "Enjoy", desc: "Use it stress-free", icon: Smile, number: "03", color: "green" },
];

const HowItWorks = () => {
  return (
    <section className="how-section">
      <div className="container text-center">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="mb-5"
        >
          <h2 className="how-title">How It Works</h2>
          <p className="how-subtitle">
            Rent or list anything in just three simple steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="row justify-content-center g-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="col-12 col-md-4"
              >
                <div className="step-card">
                  <div className={`step-icon ${s.color}`}>
                    <Icon size={22} />
                  </div>
                  <h6>{s.step}</h6>
                  <p>{s.desc}</p>
                  <span className="step-number">{s.number}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;