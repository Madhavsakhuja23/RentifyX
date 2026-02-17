import { useContext } from "react";
import { DateRange } from "react-date-range";
import { SearchContext } from "../context/SearchContext";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function CalendarPanel() {
  const { filters, setFilters } = useContext(SearchContext);

  const selectionRange = {
    startDate: filters.startDate || new Date(),
    endDate: filters.endDate || new Date(),
    key: "selection"
  };

  return (
    <div className="dropdown-panel">
      <DateRange
        ranges={[selectionRange]}
        onChange={(item) =>
          setFilters({
            ...filters,
            startDate: item.selection.startDate.toLocaleDateString(),
            endDate: item.selection.endDate.toLocaleDateString()
          })
        }
        months={2}
        direction="horizontal"
      />
    </div>
  );
}
