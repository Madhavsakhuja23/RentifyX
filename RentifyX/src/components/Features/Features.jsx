import { motion } from "framer-motion";
import { CheckCircle, Phone, Users } from "lucide-react";
import "./Features.css";

const features = [
  {
    name: "Verified Listings",
    description: "All listings are verified for authenticity and quality.",
    icon: CheckCircle,
  },
  {
    name: "24/7 Support",
    description: "Round-the-clock customer support whenever you need help.",
    icon: Phone,
  },
  {
    name: "Trusted Community",
    description: "Join thousands of users who trust RentifyX every day.",
    icon: Users,
  },
];

const Features = () => {
  return (
    <section className="features-section">
      <div className="container">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-5"
        >
          <h2 className="features-title">Why RentifyX?</h2>
          <p className="features-subtitle">
            Built to make renting simple, safe, and reliable
          </p>
        </motion.div>

        {/* Cards */}
        <div className="row g-4 justify-content-center">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="col-12 col-md-4"
              >
                <div className="feature-card">
                  <div className="feature-icon">
                    <Icon size={30} />
                  </div>
                  <h5>{feature.name}</h5>
                  <p>{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Features;