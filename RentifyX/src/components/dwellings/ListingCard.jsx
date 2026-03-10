import { Star, MapPin, Heart } from "lucide-react";
import { pricingRules, categoryLabels } from "../../data/dwellings";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ListingCard.css";

const ListingCard = ({ listing }) => {
    const [liked, setLiked] = useState(false);
    const navigate = useNavigate();

    return (
        <div
            className="listing-card"
            onClick={() => {
                const token = localStorage.getItem("token");

                if (token === "dummy-token") {
                    navigate(`/listing/${listing.id}`);
                } else {
                    navigate("/login");
                }
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
                    onClick={(e) => {
                        e.stopPropagation();
                        setLiked(!liked);
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
                <div className="badge badge-category">
                    {categoryLabels[listing.type]}
                </div>
            </div>

            <div className="listing-content">
                <div className="listing-header">
                    <h3 className="listing-title">{listing.name}</h3>
                    <div className="listing-rating">
                        <Star className="star-icon" fill="currentColor" />
                        <span className="rating-score">{listing.rating}</span>
                        <span className="rating-reviews">({listing.reviews})</span>
                    </div>
                </div>

                <div className="listing-location">
                    <MapPin className="location-icon" />
                    <span>{listing.location}</span>
                </div>

                <div className="listing-footer">
                    <div>
                        <span className="listing-price">₹{listing.price.toLocaleString()}</span>
                        <span className="listing-price-unit">{listing.priceUnit}</span>
                    </div>
                    <span className="listing-rule">
                        {pricingRules[listing.type]}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ListingCard;
