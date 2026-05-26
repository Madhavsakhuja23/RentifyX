import { useState, useRef, useEffect } from "react";
import { MapPin, Calendar, Users, ChevronDown, Search, Plus, Minus, X } from "lucide-react";
import "../components/dwellings/FilterBar.css"; // Reuse styling for visual consistency

const vehicleLocations = [
    "Downtown",
    "East Side",
    "University Area",
    "West End",
    "Tech Park",
    "Airport Zone",
    "City Center",
    "Suburb North",
    "Old Town",
    "Beach Road",
];

const DriveablesFilterBar = ({ filters, onChange }) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [locationSearch, setLocationSearch] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isMobileExpanded, setIsMobileExpanded] = useState(false);
    const barRef = useRef(null);

    const update = (partial) => onChange({ ...filters, ...partial });

    const toggleDropdown = (name) => {
        setOpenDropdown(openDropdown === name ? null : name);
        if (name === 'location' && openDropdown !== 'location') {
            setLocationSearch("");
        }
    };

    const filteredLocations = vehicleLocations.filter(loc => 
        loc.toLowerCase().startsWith(locationSearch.toLowerCase())
    );

    const matchFound = vehicleLocations.some(l => l.toLowerCase() === locationSearch.toLowerCase());

    // Click outside listener for desktop expansion
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (barRef.current && !barRef.current.contains(event.target)) {
                setOpenDropdown(null);
                if (isScrolled) {
                    setIsExpanded(false);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isScrolled]);

    // Scroll and resize listener
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 80) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
                setIsExpanded(false);
            }
        };
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);
        
        // Initial check
        handleScroll();
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Prevent body scrolling when mobile search modal is open
    useEffect(() => {
        if (isMobile && isMobileExpanded) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobile, isMobileExpanded]);

    const handleLocationSelect = (loc) => {
        update({ location: loc });
        setLocationSearch("");
        setOpenDropdown(null);
    };

    const handleBackdropClick = () => {
        setIsExpanded(false);
        setOpenDropdown(null);
    };

    const renderDateLabel = () => {
        if (filters.checkIn && filters.checkOut) {
            const start = new Date(filters.checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric" });
            const end = new Date(filters.checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric" });
            return `${start} - ${end}`;
        }
        return "Any time";
    };

    const renderGuestsLabel = () => {
        return `${filters.guests} passenger${filters.guests !== 1 ? "s" : ""}`;
    };

    const handleCompactClick = () => {
        if (isMobile) {
            setIsMobileExpanded(true);
        } else {
            setIsExpanded(true);
        }
    };

    // Render mobile full screen modal
    const renderMobileModal = () => {
        if (!isMobile || !isMobileExpanded) return null;

        return (
            <div className="filter-mobile-modal">
                <div className="mobile-modal-header">
                    <button className="close-modal-btn" onClick={() => setIsMobileExpanded(false)} aria-label="Close search filters">
                        <X size={20} />
                    </button>
                    <h3>Filter vehicles</h3>
                </div>
                <div className="mobile-modal-body">
                    {/* Location Card */}
                    <div className="mobile-modal-card">
                        <span className="card-label">Where</span>
                        <div className="mobile-input-wrapper">
                            <MapPin size={18} className="input-icon" />
                            <input
                                type="text"
                                placeholder="Type city or vehicle name..."
                                value={locationSearch}
                                onChange={(e) => {
                                    setLocationSearch(e.target.value);
                                    update({ location: e.target.value });
                                }}
                                className="mobile-text-input"
                            />
                        </div>
                        
                        <div className="mobile-suggestions-list" style={{ marginTop: '8px' }}>
                            <button
                                onClick={() => { 
                                    update({ location: "" }); 
                                    setLocationSearch("");
                                }}
                                className={`mobile-suggest-item ${!filters.location ? 'active' : ''}`}
                            >
                                <span>Clear / Show All Vehicles</span>
                            </button>

                            {locationSearch && !matchFound && (
                                <button
                                    onClick={() => { update({ location: locationSearch }); }}
                                    className="mobile-suggest-item custom-location-item"
                                >
                                    <MapPin size={12} className="suggest-pin" />
                                    <span>Enter "{locationSearch}"</span>
                                </button>
                            )}

                            {filteredLocations.map((loc) => (
                                <button
                                    key={loc}
                                    onClick={() => { handleLocationSelect(loc); }}
                                    className={`mobile-suggest-item ${filters.location === loc ? 'active' : ''}`}
                                >
                                    <MapPin size={12} className="suggest-pin" />
                                    <span>{loc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dates Card */}
                    <div className="mobile-modal-card">
                        <span className="card-label">When</span>
                        <div className="mobile-date-inputs">
                            <div className="mobile-date-group">
                                <label>Pick-up</label>
                                <input
                                    type="date"
                                    value={filters.checkIn ? new Date(filters.checkIn).toISOString().split('T')[0] : ''}
                                    onChange={(e) => update({ checkIn: e.target.value ? new Date(e.target.value) : undefined })}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div className="mobile-date-group">
                                <label>Drop-off</label>
                                <input
                                    type="date"
                                    value={filters.checkOut ? new Date(filters.checkOut).toISOString().split('T')[0] : ''}
                                    onChange={(e) => update({ checkOut: e.target.value ? new Date(e.target.value) : undefined })}
                                    min={filters.checkIn ? new Date(filters.checkIn).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Passengers Card */}
                    <div className="mobile-modal-card">
                        <span className="card-label">Who</span>
                        <div className="mobile-guest-row">
                            <div className="guest-info">
                                <span className="guest-title">Passengers</span>
                                <span className="guest-subtitle">Required seating capacity</span>
                            </div>
                            <div className="guest-counter">
                                <button
                                    onClick={() => update({ guests: Math.max(1, filters.guests - 1) })}
                                    className="counter-btn"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="counter-value">{filters.guests}</span>
                                <button
                                    onClick={() => update({ guests: Math.min(10, filters.guests + 1) })}
                                    className="counter-btn"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mobile-modal-footer">
                    <button className="clear-all-btn" onClick={() => {
                        onChange({
                            location: "",
                            checkIn: undefined,
                            checkOut: undefined,
                            guests: 1,
                        });
                        setLocationSearch("");
                    }}>
                        Clear all
                    </button>
                    <button className="search-submit-btn" onClick={() => setIsMobileExpanded(false)}>
                        <Search size={16} />
                        <span>Search</span>
                    </button>
                </div>
            </div>
        );
    };

    const isCollapsed = isMobile || (isScrolled && !isExpanded);

    return (
        <>
            {isScrolled && isExpanded && !isMobile && (
                <div className="filter-bar-backdrop" onClick={handleBackdropClick} />
            )}

            {renderMobileModal()}

            <div className={`filter-bar-wrapper ${isScrolled ? "is-sticky" : ""} ${isCollapsed ? "is-collapsed-wrapper" : "is-expanded-wrapper"}`}>
                {isCollapsed ? (
                    <div className="filter-bar-compact" onClick={handleCompactClick} role="button" tabIndex={0}>
                        <div className="compact-text-group">
                            <span className="compact-item text-bold">{filters.location || "Anywhere"}</span>
                            <span className="compact-item-dot">•</span>
                            <span className="compact-item">{renderDateLabel()}</span>
                            <span className="compact-item-dot">•</span>
                            <span className="compact-item text-muted">{renderGuestsLabel()}</span>
                        </div>
                        <div className="compact-search-circle">
                            <Search size={15} />
                        </div>
                    </div>
                ) : (
                    <div className="filter-bar-container" ref={barRef}>
                        {/* Location Dropdown */}
                        <div className="filter-dropdown-container">
                            <button
                                className="filter-trigger location-trigger"
                                onClick={() => toggleDropdown('location')}
                            >
                                <MapPin className="filter-icon" />
                                <div className="filter-text-content">
                                    <p className="filter-label">Where</p>
                                    <p className="filter-value">{filters.location || "Anywhere"}</p>
                                </div>
                                <ChevronDown className="filter-chevron" />
                            </button>

                            {openDropdown === 'location' && (
                                <div className="filter-popover location-popover">
                                    <div className="popover-content">
                                        <div className="location-search-container">
                                            <Search size={16} className="search-icon-inline" />
                                            <input
                                                type="text"
                                                placeholder="Type city or vehicle name..."
                                                className="location-search-input"
                                                value={locationSearch}
                                                onChange={(e) => {
                                                    setLocationSearch(e.target.value);
                                                    update({ location: e.target.value });
                                                }}
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        setOpenDropdown(null);
                                                    }
                                                }}
                                            />
                                        </div>
                                        
                                        <button
                                            onClick={() => { 
                                                update({ location: "" }); 
                                                setLocationSearch("");
                                                setOpenDropdown(null); 
                                            }}
                                            className={`dropdown-item ${!filters.location ? 'active' : ''}`}
                                        >
                                            Clear Filter / Show All
                                        </button>

                                        {locationSearch && !matchFound && (
                                            <div className="location-suggest-section">
                                                <p className="suggest-header">Add new location</p>
                                                <button
                                                    onClick={() => { update({ location: locationSearch }); setOpenDropdown(null); }}
                                                    className="dropdown-item custom-location-item"
                                                >
                                                    <MapPin size={14} className="suggest-icon" />
                                                    <span>Enter "{locationSearch}"</span>
                                                </button>
                                            </div>
                                        )}

                                        {filteredLocations.length > 0 && (
                                            <div className="location-suggest-section">
                                                <p className="suggest-header">Matching Locations</p>
                                                {filteredLocations.map((loc) => (
                                                    <button
                                                        key={loc}
                                                        onClick={() => { update({ location: loc }); setOpenDropdown(null); }}
                                                        className={`dropdown-item ${filters.location === loc ? 'active' : ''}`}
                                                    >
                                                        {loc}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        
                                        {filteredLocations.length === 0 && !locationSearch && (
                                            <p className="no-results-text">Start typing to find a location</p>
                                        )}
                                        
                                        {filteredLocations.length === 0 && locationSearch && !matchFound && (
                                            <p className="no-results-text">No matching predefined locations found</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="filter-divider" />

                        {/* Dates Dropdown */}
                        <div className="filter-dropdown-container">
                            <button
                                className="filter-trigger date-trigger"
                                onClick={() => toggleDropdown('dates')}
                            >
                                <Calendar className="filter-icon" />
                                <div className="filter-text-content">
                                    <p className="filter-label">When</p>
                                    <p className="filter-value">{renderDateLabel()}</p>
                                </div>
                                <ChevronDown className="filter-chevron" />
                            </button>

                            {openDropdown === 'dates' && (
                                <div className="filter-popover dates-popover">
                                    <div className="popover-content">
                                        <p className="popover-title">Select dates</p>
                                        <div className="date-inputs">
                                            <div className="date-input-group">
                                                <label>Pick-up</label>
                                                <input
                                                    type="date"
                                                    value={filters.checkIn ? new Date(filters.checkIn).toISOString().split('T')[0] : ''}
                                                    onChange={(e) => update({ checkIn: e.target.value ? new Date(e.target.value) : undefined })}
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
                                            <div className="date-input-group">
                                                <label>Drop-off</label>
                                                <input
                                                    type="date"
                                                    value={filters.checkOut ? new Date(filters.checkOut).toISOString().split('T')[0] : ''}
                                                    onChange={(e) => update({ checkOut: e.target.value ? new Date(e.target.value) : undefined })}
                                                    min={filters.checkIn ? new Date(filters.checkIn).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="filter-divider" />

                        {/* Guests Dropdown */}
                        <div className="filter-dropdown-container">
                            <button
                                className="filter-trigger guest-trigger"
                                onClick={() => toggleDropdown('guests')}
                            >
                                <Users className="filter-icon" />
                                <div className="filter-text-content">
                                    <p className="filter-label">Who</p>
                                    <p className="filter-value">{renderGuestsLabel()}</p>
                                </div>
                                <ChevronDown className="filter-chevron" />
                            </button>

                            {openDropdown === 'guests' && (
                                <div className="filter-popover guests-popover">
                                    <div className="popover-content">
                                        <div className="guest-row">
                                            <span className="guest-title">Passengers</span>
                                            <div className="guest-counter">
                                                <button
                                                    onClick={() => update({ guests: Math.max(1, filters.guests - 1) })}
                                                    className="counter-btn"
                                                >
                                                    <Minus className="counter-icon" />
                                                </button>
                                                <span className="counter-value">{filters.guests}</span>
                                                <button
                                                    onClick={() => update({ guests: Math.min(10, filters.guests + 1) })}
                                                    className="counter-btn"
                                                >
                                                    <Plus className="counter-icon" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search Button */}
                        <button className="search-button" onClick={() => setOpenDropdown(null)}>
                            <Search className="search-icon" />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default DriveablesFilterBar;
