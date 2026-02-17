import { useState } from "react";
import Carousel from "../components/Carousel";
import CategoryTabs from "../components/CategoryTabs";
import SearchBar from "../components/SearchBar";
import Listings from "../components/Listings";
import Pagination from "../components/Pagination";
import listingsData from "../data/listingsData";
import "../styles/dwellings.css";

function Dwellings() {
  const [selectedCategory, setSelectedCategory] = useState("Houses");
  const [filters, setFilters] = useState({
    location: "",
    date: "",
    guests: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredData = listingsData.filter(
    (item) =>
      item.category === selectedCategory &&
      item.location.toLowerCase().includes(filters.location.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Carousel />
      <CategoryTabs
        selected={selectedCategory}
        setSelected={setSelectedCategory}
      />
      <SearchBar filters={filters} setFilters={setFilters} />
      <Listings data={paginatedData} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}

export default Dwellings;
