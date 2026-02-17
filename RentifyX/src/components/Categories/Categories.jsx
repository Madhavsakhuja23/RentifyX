import { motion } from "framer-motion";
import { Home, Building2, Users, Plane, Car, Bike, Zap } from "lucide-react";
import "./Categories.css";

const categories = [
  { name: "Houses", icon: Home },
  { name: "Flats", icon: Building2 },
  { name: "PGs", icon: Users },
  { name: "Travel Stays", icon: Plane },
  { name: "Cars", icon: Car },
  { name: "Bikes", icon: Bike },
  { name: "EVs", icon: Zap },
];

const Categories = () => {
  return (
    <section className="categories-section">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="categories-title text-center"
        >
          Explore Categories
        </motion.h2>

        <div className="row g-4 justify-content-center">
          {categories.map((cat, index) => {
            const IconComponent = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="col-6 col-md-3"
              >
                <div className="category-card text-center">
                  <div className="category-icon">
                    <IconComponent size={32} />
                  </div>
                  <h6 className="category-name">{cat.name}</h6>
                  <div className="category-arrow">→</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
