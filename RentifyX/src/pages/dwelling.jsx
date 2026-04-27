import { useEffect, useMemo, useState } from "react";
import HeroCarousel from "../components/dwellings/HeroCarousel";
import FilterBar from "../components/dwellings/FilterBar";
import ListingCard from "../components/dwellings/ListingCard";
import Pagination from "../components/dwellings/Pagination";
import WelcomeModal from "../components/dwellings/WelcomeModal";
import { getDwellings } from "../api";
import { getNormalizedLocationName, listings as staticListings, normalizeLocation } from "../data/dwellings";
import { Shield } from "lucide-react";
import "./dwelling.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const ITEMS_PER_PAGE = 6;

const toApiDate = (value) => {
    if (!value) return undefined;
    const dateValue = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(dateValue.getTime())) return undefined;
    return dateValue.toISOString().split("T")[0];
};

const categories = [
    { key: "villa", label: "Villas", heading: "Trending villas you will love", description: "Discover the most popular villa listings in your area. Find your dream villa today." },
    { key: "flats", label: "Flats", heading: "Premium flats waiting for you", description: "Modern urban living at its finest. Browse our curated collection of premium flats." },
    { key: "pgs", label: "PGs", heading: "Student-friendly accommodations", description: "Affordable and comfortable PGs perfect for students. Community living made easy." },
    { key: "travel", label: "Travel Stays", heading: "Your next adventure awaits", description: "Flexible hourly and daily stays for travelers. Book affordable accommodations." },
];

const normalizeDwelling = (dwelling) => {
    // Handle Cloudinary image objects {url, publicId} from MongoDB
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

    // Map subcategory to type for category filtering (villa, flats, pgs, travel)
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
        location: getNormalizedLocationName(dwelling.location || ""),
        rating: Number(dwelling.rating || 4.5),
        reviews: Number(dwelling.reviews || 0),
        guests: Number(dwelling.guests || dwelling.maxGuests || 2),
        price: Number(String(dwelling.price || "0").replace(/[^0-9.]/g, "")),
        pricingType: normalizedPricingType,
        priceUnit:
            dwelling.timespan ? `/${dwelling.timespan}` :
            (dwelling.priceUnit ||
            (normalizedPricingType === "perNight" ? "/night" : "/mo")),
        image: primaryImage,
        images: imageList.length ? imageList : primaryImage ? [primaryImage] : [],
        available: dwelling.available ?? true,
        tagline: dwelling.tagline || "",
        sellerName: dwelling.sellerName || "",
        description: dwelling.description || "",
    };
};

const staticNormalizedDwellings = staticListings.map(normalizeDwelling);

const getDwellingsFromResponse = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.listings)) return response.listings;
    if (Array.isArray(response?.dwellings)) return response.dwellings;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.items)) return response.items;
    return [];
};

const applyDwellingFilters = (items, { activeCategory, filters }) => {
    let result = [...items];

    if (activeCategory) {
        result = result.filter((listing) => listing.type === activeCategory);
    }

    if (filters.location) {
        const normalizedFilterLocation = normalizeLocation(filters.location);
        result = result.filter((listing) =>
            normalizeLocation(listing.location).includes(normalizedFilterLocation)
        );
    }

    if (filters.guests) {
        result = result.filter((listing) => Number(listing.guests || 0) >= Number(filters.guests));
    }

    if (filters.pets) {
        result = result.filter((listing) => {
            const amenities = Array.isArray(listing.amenities) ? listing.amenities : [];
            const rules = Array.isArray(listing.rules) ? listing.rules : [];
            const policy = `${listing.petPolicy || ""} ${listing.houseRules || ""}`.toLowerCase();

            return (
                amenities.some((item) => String(item).toLowerCase().includes("pet")) ||
                rules.some((item) => String(item).toLowerCase().includes("pet")) ||
                policy.includes("pet")
            );
        });
    }

    return result;
};

const Dwelling = () => {
    const [activeCategory, setActiveCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [dwellings, setDwellings] = useState([]);
    const [allDwellings, setAllDwellings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({
        location: "",
        checkIn: undefined,
        checkOut: undefined,
        guests: 1,
        pets: false,
    });

    useEffect(() => {
        let ignore = false;

        const loadSuggestionData = async () => {
            try {
                const response = await getDwellings();
                if (ignore) return;

                const apiDwellings = getDwellingsFromResponse(response).map(normalizeDwelling);
                setAllDwellings(apiDwellings);
            } catch (loadError) {
                if (ignore) return;
                console.error("Failed to load dwellings source data:", loadError);
                setAllDwellings([]);
            }
        };

        loadSuggestionData();

        return () => {
            ignore = true;
        };
    }, []);

    useEffect(() => {
        let ignore = false;

        const loadDwellings = async () => {
            setError("");
            setIsFiltering(true);

            try {
                const response = await getDwellings({
                    type: activeCategory || undefined,
                    location: filters.location || undefined,
                    checkIn: toApiDate(filters.checkIn),
                    checkOut: toApiDate(filters.checkOut),
                    guests: filters.guests || undefined,
                    pets: filters.pets || undefined,
                });

                if (ignore) return;

                const apiDwellings = getDwellingsFromResponse(response).map(normalizeDwelling);
                const filteredDwellings = applyDwellingFilters(apiDwellings, {
                    activeCategory,
                    filters,
                });

                setDwellings(filteredDwellings);
            } catch (loadError) {
                if (ignore) return;
                console.error("Failed to fetch dwellings:", loadError);
                setError("Backend not reachable. Cannot load listings.");
                setDwellings([]);
            } finally {
                if (ignore) return;
                setLoading(false);
                setIsFiltering(false);
            }
        };

        loadDwellings();

        return () => {
            ignore = true;
        };
    }, [
        activeCategory,
        filters.location,
        filters.checkIn,
        filters.checkOut,
        filters.guests,
        filters.pets,
    ]);

    const locationOptions = useMemo(() => {
        const source = allDwellings.length ? allDwellings : dwellings;
        return Array.from(
            new Set(
                source
                    .map((listing) => getNormalizedLocationName(listing.location))
                    .filter(Boolean)
            )
        ).sort((left, right) => left.localeCompare(right));
    }, [allDwellings, dwellings]);

    const topSearchLocations = useMemo(() => {
        const source = allDwellings.length ? allDwellings : dwellings;
        const counts = source.reduce((accumulator, listing) => {
            const location = getNormalizedLocationName(listing.location);
            if (!location) return accumulator;

            accumulator.set(location, (accumulator.get(location) || 0) + 1);
            return accumulator;
        }, new Map());

        return Array.from(counts.entries())
            .sort((left, right) => {
                if (right[1] !== left[1]) {
                    return right[1] - left[1];
                }

                return left[0].localeCompare(right[0]);
            })
            .map(([location]) => location)
            .slice(0, 6);
    }, [allDwellings, dwellings]);

    const totalPages = Math.max(1, Math.ceil(dwellings.length / ITEMS_PER_PAGE));
    const paginated = dwellings.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    const handleCategoryChange = (cat) => {
        setActiveCategory(cat);
        setCurrentPage(1);
    };

    const handleFilterChange = (f) => {
        setFilters(f);
        setCurrentPage(1);
    };

    const currentCategory = categories.find(c => c.key === activeCategory);

    return (
        <div className="page-container">
            <Header />
            <WelcomeModal />
            <HeroCarousel activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
            <FilterBar
                filters={filters}
                onChange={handleFilterChange}
                locations={locationOptions}
                topSearchLocations={topSearchLocations}
            />

            {/* Category tabs and content layout */}
            <div className="section-container tabs-content-wrapper">
                {/* Left side - Category tabs */}
                <aside className="category-tabs-sidebar">
                    <div className="category-tabs">
                        {categories.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => handleCategoryChange(activeCategory === cat.key ? null : cat.key)}
                                className={`category-tab-button ${activeCategory === cat.key ? "active" : ""}`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Right side - Content */}
                <div className="category-content">
                    {/* Category heading and description (only shown when tab is selected) */}
                    {activeCategory && currentCategory && (
                        <div className="category-header">
                            <h2 className="category-title">{currentCategory.heading}</h2>
                            <p className="category-description">{currentCategory.description}</p>
                        </div>
                    )}

                    {/* Aadhar notice */}
                    <div className="notice-banner">
                        <Shield className="notice-icon" />
                        <p className="notice-text">
                            <span>Aadhar Card verification</span> is mandatory for all rental bookings. Please keep your Aadhar details handy.
                        </p>
                    </div>

                    {/* Results count */}
                    <div className="count-container">
                        <p className="results-count">
                            Showing <span>{dwellings.length}</span> {activeCategory ? activeCategory : "rental listings"}
                        </p>
                        {error && (
                            <p className="results-status">{error}</p>
                        )}
                        {isFiltering && !loading && (
                            <p className="results-status">Refreshing dwellings...</p>
                        )}
                    </div>

                    {/* Listing grid */}
                    <main className="main-content">
                        {loading ? (
                            <div className="empty-state">
                                <p>Loading dwellings...</p>
                            </div>
                        ) : paginated.length > 0 ? (
                            <div className="listings-grid">
                                {paginated.map((listing) => (
                                    <ListingCard key={listing.id} listing={listing} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>No rental listings found matching your criteria.</p>
                            </div>
                        )}
                    </main>

                    {!loading && !error && totalPages > 1 && (
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Dwelling;
