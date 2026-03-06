import { useContext } from "react";
import { SearchContext } from "../context/SearchContext";

export default function GuestsPanel() {
  const { filters, setFilters } = useContext(SearchContext);

  const update = (type, value) => {
    setFilters({
      ...filters,
      [type]: Math.max(0, filters[type] + value)
    });
  };

  const Row = ({ label, sub, type }) => (
    <div className="guest-row">
      <div>
        <div className="guest-title">{label}</div>
        <div className="guest-sub">{sub}</div>
      </div>
      <div className="counter">
        <button onClick={() => update(type, -1)}>-</button>
        <span>{filters[type]}</span>
        <button onClick={() => update(type, 1)}>+</button>
      </div>
    </div>
  );

  return (
    <div className="dropdown-panel">
      <Row label="Adults" sub="Ages 13 or above" type="adults" />
      <Row label="Children" sub="Ages 2–12" type="children" />
      <Row label="Infants" sub="Under 2" type="infants" />
      <Row label="Pets" sub="Bringing a service animal?" type="pets" />
    </div>
  );
}
