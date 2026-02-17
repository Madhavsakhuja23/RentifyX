import { motion } from "framer-motion";
import { CheckCircle, Phone, Users } from "lucide-react";
import "./Features.css";

const features = [
  {
    name: "Verified Listings",
    description: "All listings are verified for authenticity and quality",
    icon: CheckCircle,
  },
  {
    name: "24/7 Support",
    description: "Round-the-clock customer support for your peace of mind",
    icon: Phone,
  },
  {
    name: "Trusted Community",
    description: "Join thousands of satisfied users worldwide",
    icon: Users,
  },
];

const Features = () => {
  return (
    <section className="features-section">
      <div className="container">
        <div className="row g-4 justify-content-center">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
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
                    <IconComponent size={32} />
                  </div>
                  <h5 className="feature-title">{feature.name}</h5>
                  <p className="feature-desc">{feature.description}</p>
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
