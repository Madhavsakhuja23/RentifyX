import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ListingCard from "../dwellings/ListingCard";
import "./PopularListings.css";

const listings = [
  {
    id: 1,
    name: "Luxury Beach Villa",
    location: "Malibu",
    price: 250,
    priceUnit: "/ night",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
    rating: 4.8,
    reviews: 128,
    type: "villa",
    available: true,
  },
  {
    id: 2,
    name: "Modern Urban Flat",
    location: "Los Angeles",
    price: 120,
    priceUnit: "/ day",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399",
    rating: 4.9,
    reviews: 95,
    type: "flats",
    available: true,
  },
  {
    id: 3,
    name: "Cozy Studio Flat",
    location: "San Francisco",
    price: 180,
    priceUnit: "/ night",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    rating: 4.7,
    reviews: 82,
    type: "flats",
    available: true,
  },
  {
    id: 4,
    name: "Mountain View PG",
    location: "Colorado",
    price: 150,
    priceUnit: "/ month",
    image: "https://images.unsplash.com/photo-1570129477492-45289003c313",
    rating: 4.6,
    reviews: 64,
    type: "pgs",
    available: true,
  },
];

const PopularListings = () => {

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
              <ListingCard listing={item} />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-5">
          <Link to="/listing">
          <button className="view-all-btn">
            View All Listings
          </button>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default PopularListings;