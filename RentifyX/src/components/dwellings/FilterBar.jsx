import { useState, useRef, useEffect } from "react";
import { MapPin, Calendar, Users, ChevronDown, Search, PawPrint, Plus, Minus } from "lucide-react";
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
    const barRef = useRef(null);

    const update = (partial) => onChange({ ...filters, ...partial });

    const toggleDropdown = (name) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (barRef.current && !barRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

    return (
        <div className="filter-bar-wrapper">
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
                            <p className="filter-value">
                                {filters.checkIn && filters.checkOut
                                    ? `${new Date(filters.checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${new Date(filters.checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                                    : "Add dates"
                                }
                            </p>
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
                            <p className="filter-value">
                                {filters.guests} guest{filters.guests !== 1 ? "s" : ""}
                                {filters.pets ? " + pet" : ""}
                            </p>
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

                {/* Search */}
                <button className="search-button" onClick={() => setOpenDropdown(null)}>
                    <Search className="search-icon" />
                </button>

            </div>
        </div>
    );
};

export default FilterBar;
