import { motion } from "framer-motion";
import { Home, Building2, Users, Plane, Car, Bike, Zap } from "lucide-react";
import "./Categories.css";

const categories = [
  { name: "Home", icon: Home },
  { name: "Apartment", icon: Building2 },
  { name: "Commercial", icon: Users },
  { name: "Rent", icon: Plane },
  { name: "New Building", icon: Home },
  { name: "Cars", icon: Car },
];

const Categories = () => {
  return (
    <section className="categories-new">
      <div className="container text-center">
        <motion.h3
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="categories-heading"
        >
          Are you looking for
        </motion.h3>

        <div className="categories-row">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="category-pill"
              >
                <div className="category-icon-wrap">
                  <Icon size={24} />
                </div>
                <span>{cat.name}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;