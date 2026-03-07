import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="pagination-container">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="pagination-arrow"
            >
                <ChevronLeft className="icon-small" />
            </button>
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`pagination-number ${page === currentPage ? "active" : ""}`}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="pagination-arrow"
            >
                <ChevronRight className="icon-small" />
            </button>
        </div>
    );
};

export default Pagination;
