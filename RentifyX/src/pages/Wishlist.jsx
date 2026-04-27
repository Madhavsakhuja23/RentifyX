import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getWishlistApi } from '../api';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ListingCard from '../components/dwellings/ListingCard';
import './Wishlist.css';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser) {
        navigate("/login");
        return;
      }

      try {
        const res = await getWishlistApi();
        if (res && res.listings) {
          // Normalize listings to match ListingCard expectations
          const normalizedListings = res.listings.map(dwelling => {
            const rawImages = Array.isArray(dwelling.images)
                ? dwelling.images.map(img => (typeof img === "object" && img.url) ? img.url : img)
                : Array.isArray(dwelling.imageUrls)
                    ? dwelling.imageUrls
                    : Array.isArray(dwelling.photos)
                        ? dwelling.photos
                        : dwelling.image
                            ? [dwelling.image]
                            : dwelling.thumbnail
                                ? [dwelling.thumbnail]
                                : [];

            const imageList = rawImages.filter(Boolean);
            const primaryImage = dwelling.image || imageList[0] || "";
            const pricingType = dwelling.pricingType || dwelling.rentalType || dwelling.pricing?.type;
            const normalizedPricingType =
                pricingType === "monthly" || pricingType === "perNight"
                    ? pricingType
                    : String(dwelling.priceUnit || "").toLowerCase().includes("night")
                        ? "perNight"
                        : "monthly";

            let subcategoryType = "villa";
            const rawSub = (dwelling.subcategory || dwelling.type || dwelling.category || "").toLowerCase();

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
                ...dwelling,
                id: dwelling.id || dwelling._id,
                name: dwelling.name || dwelling.title || "Untitled dwelling",
                type: subcategoryType,
                rating: Number(dwelling.rating || 4.5),
                reviews: Number(dwelling.reviews || 0),
                guests: Number(dwelling.guests || dwelling.maxGuests || 2),
                price: Number(String(dwelling.price || "0").replace(/[^0-9.]/g, "")),
                pricingType: normalizedPricingType,
                priceUnit:
                    dwelling.priceUnit ||
                    (normalizedPricingType === "perNight" ? "/night" : "/mo"),
                image: primaryImage,
                available: dwelling.available ?? true,
                tagline: dwelling.tagline || "",
                sellerName: dwelling.sellerName || "",
            };
          });
          setWishlist(normalizedListings);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [navigate]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="wishlist-loading">Loading your wishlist...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="wishlist-page">
        <h1 className="wishlist-title">Wishlists</h1>
        
        {wishlist.length > 0 ? (
          <div className="wishlist-grid">
            {wishlist.map((listing) => (
              <ListingCard 
                key={listing.id} 
                listing={listing} 
                isWishlisted={true} 
              />
            ))}
          </div>
        ) : (
          <div className="wishlist-empty">
            <h2 className="wishlist-empty-text">Your wishlist is empty ❤️</h2>
            <p className="wishlist-empty-subtext">
              As you search, click the heart icon to save your favorite places and Experiences to a wishlist.
            </p>
            <Link to="/dwellings" className="wishlist-browse-btn">
              Start exploring
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
