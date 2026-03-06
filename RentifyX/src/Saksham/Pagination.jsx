import { motion } from 'framer-motion';
// import './Driveables.css'; // Removed custom CSS

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (startPage > 2) pages.push('...');
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      if (endPage < totalPages - 1) pages.push('...');
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <motion.div 
      className="d-flex flex-column align-items-center mt-5 mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      <nav aria-label="Vehicle pagination">
        <ul className="pagination mb-2">
          {/* Previous Button */}
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button 
              className="page-link shadow-none" 
              onClick={() => onPageChange(currentPage - 1)}
              tabIndex={currentPage === 1 ? -1 : 0}
            >
              &laquo; Prev
            </button>
          </li>

          {/* Page Numbers */}
          {getPageNumbers().map((page, index) => (
            <li 
              key={index} 
              className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}
            >
              <button
                className="page-link shadow-none"
                onClick={() => typeof page === 'number' && onPageChange(page)}
              >
                {page}
              </button>
            </li>
          ))}

          {/* Next Button */}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button 
              className="page-link shadow-none" 
              onClick={() => onPageChange(currentPage + 1)}
              tabIndex={currentPage === totalPages ? -1 : 0}
            >
              Next &raquo;
            </button>
          </li>
        </ul>
      </nav>

      {/* Pagination Info */}
      <p className="text-muted small mb-0">
        Showing {startItem}–{endItem} of {totalItems} vehicles
      </p>
    </motion.div>
  );
};

export default Pagination;