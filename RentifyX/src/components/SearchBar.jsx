import { useState } from "react";

const cities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Goa",
  "Jaipur"
];

function SearchBar({ filters, setFilters }) {
  const [active, setActive] = useState(null);
  const [guests, setGuests] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0
  });

  const totalGuests =
    guests.adults + guests.children + guests.infants + guests.pets;

  const updateGuest = (type, value) => {
    setGuests({ ...guests, [type]: Math.max(0, guests[type] + value) });
  };

  return (
    <div className="search-wrapper">
      <div className={`search-container ${active ? "expanded" : ""}`}>

        {/* WHERE */}
        <div
          className="search-section"
          onClick={() => setActive("where")}
        >
          <span className="label">Where</span>
          <span className="value">
            {filters.location || "Search destinations"}
          </span>

          {filters.location && (
            <button
              className="clear-btn"
              onClick={(e) => {
                e.stopPropagation();
                setFilters({ ...filters, location: "" });
              }}
            >
              ✕
            </button>
          )}

          {active === "where" && (
            <div className="dropdown">
              {cities.map((city) => (
                <div
                  key={city}
                  className="dropdown-item"
                  onClick={() =>
                    setFilters({ ...filters, location: city })
                  }
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* WHEN */}
        <div
          className="search-section"
          onClick={() => setActive("when")}
        >
          <span className="label">When</span>
          <span className="value">
            {filters.startDate && filters.endDate
              ? `${filters.startDate} - ${filters.endDate}`
              : "Add dates"}
          </span>

          {active === "when" && (
            <div className="dropdown calendar">
              <div className="calendar-inputs">
                <input
                  type="date"
                  onChange={(e) =>
                    setFilters({ ...filters, startDate: e.target.value })
                  }
                />
                <input
                  type="date"
                  onChange={(e) =>
                    setFilters({ ...filters, endDate: e.target.value })
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* WHO */}
        <div
          className="search-section"
          onClick={() => setActive("who")}
        >
          <span className="label">Who</span>
          <span className="value">
            {totalGuests > 0 ? `${totalGuests} guests` : "Add guests"}
          </span>

          {active === "who" && (
            <div className="dropdown guests">
              {["adults", "children", "infants", "pets"].map((type) => (
                <div key={type} className="guest-row">
                  <div>
                    <strong>{type.charAt(0).toUpperCase() + type.slice(1)}</strong>
                  </div>
                  <div className="guest-controls">
                    <button onClick={() => updateGuest(type, -1)}>-</button>
                    <span>{guests[type]}</span>
                    <button onClick={() => updateGuest(type, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="search-button">Search</button>
      </div>

      {active && (
        <div
          className="overlay"
          onClick={() => setActive(null)}
        ></div>
      )}
    </div>
  );
}

export default SearchBar;
