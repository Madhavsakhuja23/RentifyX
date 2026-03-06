import { motion } from "framer-motion";
import { Heart, Star, MapPin } from "lucide-react";
import { useState } from "react";
import "./PopularListings.css";

const listings = [
  {
    id: 1,
    title: "Luxury Beach Villa",
    location: "Malibu",
    price: "$250 / night",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
    rating: 4.8,
    reviews: 128,
    featured: true,
  },
  {
    id: 2,
    title: "Tesla Model S",
    location: "Los Angeles",
    price: "$120 / day",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399",
    rating: 4.9,
    reviews: 95,
    featured: true,
  },
  {
    id: 3,
    title: "Modern Apartment",
    location: "San Francisco",
    price: "$180 / night",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    rating: 4.7,
    reviews: 82,
    featured: false,
  },
  {
    id: 4,
    title: "Mountain Cabin",
    location: "Colorado",
    price: "$150 / night",
    image: "https://images.unsplash.com/photo-1570129477492-45289003c313",
    rating: 4.6,
    reviews: 64,
    featured: false,
  },
];

const PopularListings = () => {
  const [hearts, setHearts] = useState({});

  const toggleHeart = (id) => {
    setHearts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="popular-section">
      <div className="container">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-5"
        >
          <h2 className="popular-title">Popular Listings</h2>
          <p className="popular-subtitle">
            Handpicked rentals loved by our users
          </p>
        </motion.div>

        {/* Cards */}
        <div className="row g-4">
          {listings.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="col-12 col-md-6 col-lg-3"
            >
              <div className="listing-card h-100">
                <div className="listing-image-wrapper">
                  <img src={item.image} alt={item.title} />

                  {item.featured && (
                    <span className="featured-badge">Featured</span>
                  )}

                  <button
                    className={`heart-btn ${hearts[item.id] ? "active" : ""}`}
                    onClick={() => toggleHeart(item.id)}
                  >
                    <Heart size={18} fill={hearts[item.id] ? "currentColor" : "none"} />
                  </button>
                </div>

                <div className="listing-content">
                  <h6>{item.title}</h6>

                  <div className="listing-location">
                    <MapPin size={14} />
                    <span>{item.location}</span>
                  </div>

                  <div className="listing-rating">
                    <Star size={14} fill="#ffc107" color="#ffc107" />
                    <strong>{item.rating}</strong>
                    <span>({item.reviews})</span>
                  </div>

                  <div className="listing-price">{item.price}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-5">
          <button className="view-all-btn">
            View All Listings
          </button>
        </div>

      </div>
    </section>
  );
};

export default PopularListings;