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
                                <button
                                    onClick={() => { update({ location: "" }); setOpenDropdown(null); }}
                                    className={`dropdown-item ${!filters.location ? 'active' : ''}`}
                                >
                                    Anywhere
                                </button>
                                {vehicleLocations.map((loc) => (
                                    <button
                                        key={loc}
                                        onClick={() => { update({ location: loc }); setOpenDropdown(null); }}
                                        className={`dropdown-item ${filters.location === loc ? 'active' : ''}`}
                                    >
                                        {loc}
                                    </button>
                                ))}
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
