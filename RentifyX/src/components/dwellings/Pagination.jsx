import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
    if (totalPages <= 1 && (!totalItems || totalItems === 0)) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Calculate the start and end item indices
    const startItem = totalItems ? Math.min((currentPage - 1) * itemsPerPage + 1, totalItems) : 0;
    const endItem = totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

    return (
        <div className="pagination-wrapper">
            <div className="pagination-container">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="pagination-arrow"
                >
                    <ChevronLeft className="icon-small" /> Prev
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
                    Next <ChevronRight className="icon-small" />
                </button>
            </div>

            {totalItems && (
                <div className="pagination-info mt-3 text-center text-muted small">
                    Showing {startItem}–{endItem} of {totalItems} items
                </div>
            )}
        </div>
    );
};

export default Pagination;
