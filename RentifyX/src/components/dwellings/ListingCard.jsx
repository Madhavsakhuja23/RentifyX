import { Star, MapPin, Heart } from "lucide-react";
import { pricingRules, categoryLabels } from "../../data/dwellings";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addToWishlistApi, removeFromWishlistApi } from "../../api";
import "./ListingCard.css";

const ListingCard = ({ listing, isWishlisted = false }) => {
    const [liked, setLiked] = useState(isWishlisted);
    const navigate = useNavigate();

    // Sync local state if parent prop changes
    useEffect(() => {
        setLiked(isWishlisted);
    }, [isWishlisted]);

    const displayPrice = Number(listing.price) || 0;

    return (
        <div
    className="listing-card"
    onClick={() => {
        navigate(`/listing/${listing.id}`);
    }}
>
            <div className="listing-image-container">
                <img
                    src={listing.image}
                    alt={listing.name}
                    className="listing-image"
                    loading="lazy"
                />
                <button
                    onClick={async (e) => {
                        e.stopPropagation();
                        const currentUser = localStorage.getItem("currentUser");
                        if (!currentUser) {
                            navigate("/login");
                            return;
                        }
                        
                        const listingId = listing.id || listing._id;
                        
                        try {
                            if (liked) {
                                await removeFromWishlistApi(listingId);
                                setLiked(false);
                            } else {
                                await addToWishlistApi(listingId);
                                setLiked(true);
                            }
                        } catch (error) {
                            console.error("Error toggling wishlist:", error);
                        }
                    }}
                    className="like-button"
                >
                    <Heart
                        className={`heart-icon ${liked ? "liked" : ""}`}
                        fill={liked ? "currentColor" : "none"}
                    />
                </button>
                {!listing.available && (
                    <div className="badge badge-unavailable">
                        Unavailable
                    </div>
                )}
                <div className="badge-category">
                    {categoryLabels[listing.type] || listing.type || "Dwelling"}
                </div>
            </div>

            <div className="listing-content">
                <div className="listing-header">
                    <div>
                        <h3 className="listing-title">{listing.name}</h3>
                        {listing.tagline && (
                            <p className="listing-tagline">{listing.tagline}</p>
                        )}
                    </div>
                    <div className="listing-rating">
                        <Star className="star-icon" fill="currentColor" />
                        <span className="rating-score">{listing.rating}</span>
                        <span className="rating-reviews">({listing.reviews})</span>
                    </div>
                </div>

                <div className="listing-location">
                    <MapPin className="location-icon" />
                    <span>{listing.location}</span>
                    {listing.sellerName && (
                        <span className="listing-seller"> · by {listing.sellerName}</span>
                    )}
                </div>

                <div className="listing-footer">
                    <div>
                        <span className="listing-price">₹{displayPrice.toLocaleString()}</span>
                        <span className="listing-price-unit">{listing.priceUnit}</span>
                    </div>
                    <span className="listing-rule">
                        {pricingRules[listing.type] || "Rental"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ListingCard;
