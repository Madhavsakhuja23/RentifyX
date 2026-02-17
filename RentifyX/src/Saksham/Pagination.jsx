// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import './Driveables.css';

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
      className="pagination-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      <div className="pagination">
        <motion.button 
          className="pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
          whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
        >
          ← Prev
        </motion.button>

        <div className="pagination-numbers">
          {getPageNumbers().map((page, index) => (
            <motion.button
              key={index}
              className={`page-number ${page === currentPage ? 'active' : ''} ${page === '...' ? 'ellipsis' : ''}`}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              whileHover={page !== '...' && page !== currentPage ? { scale: 1.1 } : {}}
              whileTap={page !== '...' && page !== currentPage ? { scale: 0.9 } : {}}
            >
              {page}
            </motion.button>
          ))}
        </div>

        <motion.button 
          className="pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
          whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
        >
          Next →
        </motion.button>
      </div>

      <p className="pagination-info">
        Showing {startItem}–{endItem} of {totalItems} vehicles
      </p>
    </motion.div>
  );
};

export default Pagination;
