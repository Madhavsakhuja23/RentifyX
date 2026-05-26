import { useState, useRef, useEffect } from "react";
import { MapPin, Calendar, Users, ChevronDown, Search, PawPrint, Plus, Minus, X } from "lucide-react";
import { getNormalizedLocationName } from "../../data/dwellings";
import "./FilterBar.css";

const FilterBar = ({
    filters,
    onChange,
    locations = [],
    topSearchLocations = [],
}) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [locationInput, setLocationInput] = useState(filters.location || "");
    const [isScrolled, setIsScrolled] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isMobileExpanded, setIsMobileExpanded] = useState(false);
    const barRef = useRef(null);

    const update = (partial) => onChange({ ...filters, ...partial });

    const toggleDropdown = (name) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

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

    useEffect(() => {
        setLocationInput(filters.location || "");
    }, [filters.location]);

    const normalizedLocationInput = locationInput.trim().toLowerCase();
    const suggestedLocations = normalizedLocationInput
        ? locations.filter((loc) => loc.toLowerCase().includes(normalizedLocationInput))
        : topSearchLocations;

    const handleLocationInputChange = (event) => {
        const nextValue = event.target.value;
        setLocationInput(nextValue);
        update({ location: nextValue });
    };

    const handleLocationSelect = (location) => {
        const normalizedLocation = getNormalizedLocationName(location);
        setLocationInput(normalizedLocation);
        update({ location: normalizedLocation });
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
        return "Any week";
    };

    const renderGuestsLabel = () => {
        let label = `${filters.guests} guest${filters.guests !== 1 ? "s" : ""}`;
        if (filters.pets) {
            label += " + pet";
        }
        return label;
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
                    <h3>Filter stays</h3>
                </div>
                <div className="mobile-modal-body">
                    {/* Location Card */}
                    <div className="mobile-modal-card">
                        <span className="card-label">Where</span>
                        <div className="mobile-input-wrapper">
                            <MapPin size={18} className="input-icon" />
                            <input
                                type="text"
                                value={locationInput}
                                onChange={handleLocationInputChange}
                                placeholder="Search destinations"
                                className="mobile-text-input"
                            />
                        </div>
                        <div className="mobile-suggestions-list">
                            {suggestedLocations.slice(0, 5).map((loc) => (
                                <button
                                    key={loc}
                                    onClick={() => handleLocationSelect(loc)}
                                    className={`mobile-suggest-item ${getNormalizedLocationName(filters.location) === loc ? 'active' : ''}`}
                                >
                                    <MapPin size={14} className="suggest-pin" />
                                    <span>{loc}</span>
                                </button>
                            ))}
                            {normalizedLocationInput && suggestedLocations.length === 0 && (
                                <button
                                    onClick={() => handleLocationSelect(locationInput.trim())}
                                    className="mobile-suggest-item"
                                >
                                    <MapPin size={14} className="suggest-pin" />
                                    <span>Search for "{locationInput.trim()}"</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Dates Card */}
                    <div className="mobile-modal-card">
                        <span className="card-label">When</span>
                        <div className="mobile-date-inputs">
                            <div className="mobile-date-group">
                                <label>Check In</label>
                                <input
                                    type="date"
                                    value={filters.checkIn ? new Date(filters.checkIn).toISOString().split('T')[0] : ''}
                                    onChange={(e) => update({ checkIn: e.target.value ? new Date(e.target.value) : undefined })}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div className="mobile-date-group">
                                <label>Check Out</label>
                                <input
                                    type="date"
                                    value={filters.checkOut ? new Date(filters.checkOut).toISOString().split('T')[0] : ''}
                                    onChange={(e) => update({ checkOut: e.target.value ? new Date(e.target.value) : undefined })}
                                    min={filters.checkIn ? new Date(filters.checkIn).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Guests Card */}
                    <div className="mobile-modal-card">
                        <span className="card-label">Who</span>
                        <div className="mobile-guest-row">
                            <div className="guest-info">
                                <span className="guest-title">Guests</span>
                                <span className="guest-subtitle">Number of travelers</span>
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
                                    onClick={() => update({ guests: Math.min(16, filters.guests + 1) })}
                                    className="counter-btn"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="mobile-guest-row pet-row">
                            <div className="guest-info">
                                <span className="guest-title">Pets</span>
                                <span className="guest-subtitle">Bringing a pet?</span>
                            </div>
                            <button
                                onClick={() => update({ pets: !filters.pets })}
                                className={`toggle-switch ${filters.pets ? 'active' : ''}`}
                            >
                                <div className="toggle-thumb" />
                            </button>
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
                            pets: false
                        });
                        setLocationInput("");
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
                            <div
                                className={`filter-trigger location-trigger ${openDropdown === 'location' ? 'active-trigger' : ''}`}
                                onClick={() => {
                                    if (openDropdown !== 'location') toggleDropdown('location');
                                }}
                                role="button"
                                tabIndex={0}
                            >
                                <MapPin className="filter-icon" />
                                <div className="filter-text-content">
                                    <p className="filter-label">Where</p>
                                    {openDropdown === 'location' ? (
                                        <input
                                            type="text"
                                            value={locationInput}
                                            onChange={handleLocationInputChange}
                                            onKeyDown={(event) => {
                                                if (event.key === "Enter") {
                                                    setOpenDropdown(null);
                                                }
                                            }}
                                            className="where-inline-input"
                                            placeholder="Search destinations"
                                            autoFocus
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    ) : (
                                        <p className="filter-value">{filters.location || "Anywhere"}</p>
                                    )}
                                </div>
                                {openDropdown !== 'location' && <ChevronDown className="filter-chevron" />}
                            </div>

                            {openDropdown === 'location' && (
                                <div className="filter-popover location-popover">
                                    <div className="popover-content">
                                        <p className="popover-title">
                                            {normalizedLocationInput ? "Matching locations" : "Top searches"}
                                        </p>
                                        
                                        {suggestedLocations.map((loc) => (
                                            <button
                                                key={loc}
                                                onClick={() => handleLocationSelect(loc)}
                                                className={`dropdown-item ${getNormalizedLocationName(filters.location) === loc ? 'active' : ''}`}
                                            >
                                                <span className="location-item-text">{loc}</span>
                                            </button>
                                        ))}
                                        {normalizedLocationInput && suggestedLocations.length === 0 && (
                                            <button
                                                onClick={() => handleLocationSelect(locationInput.trim())}
                                                className="dropdown-item"
                                            >
                                                <span className="location-item-text">Search for "{locationInput.trim()}"</span>
                                            </button>
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
                                                <label>Check In</label>
                                                <input
                                                    type="date"
                                                    value={filters.checkIn ? new Date(filters.checkIn).toISOString().split('T')[0] : ''}
                                                    onChange={(e) => update({ checkIn: e.target.value ? new Date(e.target.value) : undefined })}
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
                                            <div className="date-input-group">
                                                <label>Check Out</label>
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
                                            <span className="guest-title">Guests</span>
                                            <div className="guest-counter">
                                                <button
                                                    onClick={() => update({ guests: Math.max(1, filters.guests - 1) })}
                                                    className="counter-btn"
                                                >
                                                    <Minus className="counter-icon" />
                                                </button>
                                                <span className="counter-value">{filters.guests}</span>
                                                <button
                                                    onClick={() => update({ guests: Math.min(16, filters.guests + 1) })}
                                                    className="counter-btn"
                                                >
                                                    <Plus className="counter-icon" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="guest-row" style={{ marginTop: '1rem' }}>
                                            <div className="pet-label">
                                                <PawPrint className="pet-icon" />
                                                <span>Bringing a pet?</span>
                                            </div>
                                            <button
                                                onClick={() => update({ pets: !filters.pets })}
                                                className={`toggle-switch ${filters.pets ? 'active' : ''}`}
                                            >
                                                <div className="toggle-thumb" />
                                            </button>
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

export default FilterBar;
