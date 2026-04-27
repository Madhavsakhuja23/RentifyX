import { useState, useRef, useEffect } from "react";
import { MapPin, Calendar, Users, ChevronDown, Search, Plus, Minus } from "lucide-react";
import "../components/dwellings/FilterBar.css";

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (barRef.current && !barRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="filter-bar-wrapper">
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
                                            // Real-time update for better UX
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
                            <p className="filter-value">
                                {filters.guests} guest{filters.guests !== 1 ? "s" : ""}
                            </p>
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

                {/* Search */}
                <button className="search-button">
                    <Search className="search-icon" />
                </button>

            </div>
        </div>
    );
};

export default DriveablesFilterBar;
