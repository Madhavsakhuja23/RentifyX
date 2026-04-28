import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ListingCard from "../dwellings/ListingCard";
import { getDwellings } from "../../api";
import "./PopularListings.css";

const PopularListings = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await getDwellings();
        const rawListings = res.listings || [];
        
        let normalized = rawListings.map(item => {
          const rawSub = (item.subcategory || "").toLowerCase();
          let subcategoryType = item.subcategory || "Dwelling";

          // Align with categoryLabels in data/dwellings.js
          if (rawSub.includes("travel")) {
              subcategoryType = "travel";
          } else if (rawSub.includes("flat") || rawSub.includes("apartment")) {
              subcategoryType = "flats";
          } else if (rawSub.includes("pg") || rawSub.includes("hostel")) {
              subcategoryType = "pgs";
          } else if (rawSub.includes("villa")) {
              subcategoryType = "villa";
          }

          return {
            ...item,
            id: item._id,
            name: item.title,
            // Extract URL from images array [{url, publicId}]
            image: item.images && item.images[0] ? (typeof item.images[0] === 'string' ? item.images[0] : item.images[0].url) : "",
            priceUnit: item.timespan ? `/${item.timespan}` : "/month",
            type: subcategoryType,
            // Map isAvailable from backend to 'available' used by ListingCard
            available: item.isAvailable !== undefined ? item.isAvailable : true,
            rating: item.rating || 4.5,
            reviews: item.reviews || 0,
          };
        });

        // Specific swap: Replace 'Mountain Escape Retreat' with 'Urban Nest Flat' in the top 4
        const mountainIdx = normalized.findIndex(l => l.name === "Mountain Escape Retreat");
        const urbanIdx = normalized.findIndex(l => l.name === "Urban Nest Flat");

        if (mountainIdx !== -1 && urbanIdx !== -1) {
          // If mountain is in top 4 and urban is not, or just swap them
          const temp = normalized[mountainIdx];
          normalized[mountainIdx] = normalized[urbanIdx];
          normalized[urbanIdx] = temp;
        }

        setListings(normalized.slice(0, 4));
      } catch (error) {
        console.error("Error fetching popular listings", error);
      }
    };
    fetchListings();
  }, []);

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
              key={item._id}
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