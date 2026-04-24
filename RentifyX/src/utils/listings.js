const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop";

const DEFAULT_AMENITIES = [
  "Wifi",
  "Kitchen",
  "Air conditioning",
  "Free parking",
  "TV",
  "Washing machine",
];

function getPricingType(listing) {
  if (listing.pricingType) return listing.pricingType;
  return listing.subCategory === "travel" ? "perNight" : "monthly";
}

function getPriceUnit(pricingType) {
  return pricingType === "monthly" ? "/mo" : "/night";
}

export function normalizeBackendListing(listing) {
  const pricingType = getPricingType(listing);
  const imageUrls = (listing.images || []).map((image) => image.url);

  return {
    ...listing,
    id: listing._id,
    name: listing.title,
    title: listing.title,
    type: listing.subCategory || "",
    price: Number(listing.price) || 0,
    pricingType,
    priceUnit: getPriceUnit(pricingType),
    rating: listing.rating || 4.8,
    reviews: listing.reviews || 0,
    guests: listing.guests || 1,
    bedrooms: listing.bedrooms || 1,
    beds: listing.beds || 1,
    bathrooms: listing.bathrooms || 1,
    amenities:
      Array.isArray(listing.amenities) && listing.amenities.length > 0
        ? listing.amenities
        : DEFAULT_AMENITIES,
    highlights:
      Array.isArray(listing.highlights) && listing.highlights.length > 0
        ? listing.highlights
        : [
            {
              title: "Great location",
              desc: "Well-placed for a comfortable stay and easy local access.",
            },
            {
              title: "Responsive host",
              desc: "Hosted by an owner actively managing their listing.",
            },
            {
              title: "Flexible stay",
              desc: "Availability is managed directly from the seller dashboard.",
            },
          ],
    host: listing.host || {
      name: listing.sellerName || "Host",
      avatar: DEFAULT_AVATAR,
      rating: 4.8,
      reviews: 24,
      experience: "2 years hosting",
      languages: ["English", "Hindi"],
      responseRate: "100%",
      responseTime: "within an hour",
    },
    image: imageUrls[0] || "",
    images: imageUrls,
    available: listing.available !== false,
  };
}
