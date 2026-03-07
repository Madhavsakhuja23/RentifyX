import { motion } from "framer-motion";
import { ThumbsUp, ShieldCheck, Users, Headphones } from "lucide-react";
import "./WhyChooseUs.css";

const features = [
  {
    title: "Best Advantage",
    desc: "Get the best rental deals with trusted listings and transparent pricing.",
    icon: ThumbsUp,
    color: "blue",
  },
  {
    title: "Property Insurance",
    desc: "Your rentals are protected with secure and verified properties.",
    icon: ShieldCheck,
    color: "orange",
  },
  {
    title: "Trusted Community",
    desc: "Connect with verified owners and renters across the platform.",
    icon: Users,
    color: "green",
  },
  {
    title: "24/7 Support",
    desc: "We are always here to help you with bookings and queries.",
    icon: Headphones,
    color: "yellow",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="why-section">
      <div className="container text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="why-title"
        >
          Why Choose Us
        </motion.h2>

        <p className="why-subtitle">
          We provide everything you need to rent or list assets with confidence
        </p>

        <div className="row justify-content-center g-4 mt-4">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className="col-12 col-sm-6 col-lg-3"
              >
                <div className="why-card">
                  <div className={`why-icon ${item.color}`}>
                    <Icon size={22} />
                  </div>
                  <h6>{item.title}</h6>
                  <p>{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;