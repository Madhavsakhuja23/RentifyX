import { useState, useMemo } from "react";
import HeroCarousel from "../components/dwellings/HeroCarousel";
import FilterBar from "../components/dwellings/FilterBar";
import ListingCard from "../components/dwellings/ListingCard";
import Pagination from "../components/dwellings/Pagination";
import WelcomeModal from "../components/dwellings/WelcomeModal";
import { listings } from "../data/dwellings";
import { Shield } from "lucide-react";
import "./dwelling.css";

const ITEMS_PER_PAGE = 6;

const Dwelling = () => {
    const [activeCategory, setActiveCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        location: "",
        checkIn: undefined,
        checkOut: undefined,
        guests: 1,
        pets: false,
    });

    const filtered = useMemo(() => {
        let result = [...listings];
        if (activeCategory) result = result.filter((l) => l.type === activeCategory);
        if (filters.location) result = result.filter((l) => l.location === filters.location);
        return result;
    }, [activeCategory, filters.location]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleCategoryChange = (cat) => {
        setActiveCategory(cat);
        setCurrentPage(1);
    };

    const handleFilterChange = (f) => {
        setFilters(f);
        setCurrentPage(1);
    };

    const categories = [
        { key: "villa", label: "Villas", heading: "Trending villas you will love", description: "Discover the most popular and highly-rated villa listings in your area. Find your dream villa today." },
        { key: "flats", label: "Flats", heading: "Premium flats waiting for you", description: "Modern urban living at its finest. Browse our curated collection of premium flats in prime locations." },
        { key: "pgs", label: "PGs", heading: "Student-friendly accommodations", description: "Affordable and comfortable PGs perfect for students and young professionals. Community living made easy." },
        { key: "travel", label: "Travel Stays", heading: "Your next adventure awaits", description: "Flexible hourly and daily stays for travelers. Book affordable accommodations for your next journey." },
    ];

    const currentCategory = categories.find(c => c.key === activeCategory);

    return (
        <div className="page-container">
            <WelcomeModal />
            <HeroCarousel activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
            <FilterBar filters={filters} onChange={handleFilterChange} />

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
                            Showing <span>{filtered.length}</span> {activeCategory ? activeCategory : "rental listings"}
                        </p>
                    </div>

                    {/* Listing grid */}
                    <main className="main-content">
                        {paginated.length > 0 ? (
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

                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
            </div>
           
        </div>
    );
};

export default Dwelling;
