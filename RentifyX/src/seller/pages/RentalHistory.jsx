import React, { useState, useEffect } from 'react';
import { ChevronRight, Filter, Download, IndianRupee, Calendar, User } from 'lucide-react';
import api from '../../api';
import { format, differenceInDays } from 'date-fns';
import './RentalHistory.css';

export default function RentalHistory() {
  const [bookings, setBookings] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [status, type, dateFrom, dateTo]);

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selected]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        status,
        type,
        from: dateFrom,
        to: dateTo
      }).toString();
      
      const res = await api.get(`/bookings/history?${query}`);
      setBookings(res.bookings || []);
      setTotalEarnings(res.totalEarnings || 0);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'completed': return 'status-completed';
      case 'ongoing': return 'status-active';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const exportToCSV = () => {
    const headers = ['ID,Customer,Item,Start Date,End Date,Duration,Amount,Status\n'];
    const rows = bookings.map(b => {
      const duration = differenceInDays(new Date(b.endDate), new Date(b.startDate));
      return `${b._id},${b.renter.name},${b.listing.title},${format(new Date(b.startDate), 'yyyy-MM-dd')},${format(new Date(b.endDate), 'yyyy-MM-dd')},${duration} Days,${b.totalAmount},${b.status}`;
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rental_history_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rental-history">
      <div className="page-header flex-between">
        <div>
          <h1>Rental History</h1>
          <p>View all past and current rentals for your listings.</p>
        </div>
        <button className="export-btn" onClick={exportToCSV}>
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="history-stats-cards">
        <div className="stat-card earnings">
          <div className="stat-icon-wrap">
            <IndianRupee size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Earnings</span>
            <span className="stat-value">₹{totalEarnings.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All Types</option>
            <option value="Dwelling">Dwelling</option>
            <option value="Vehicle">Vehicle</option>
          </select>
        </div>
        <div className="filter-group">
          <label>From</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div className="filter-group">
          <label>To</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-state">Loading history...</div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">No rentals found for the selected criteria.</div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Item Rented</th>
                <th>Dates</th>
                <th>Duration</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(row => (
                <tr key={row._id}>
                  <td data-label="Customer">
                    <div className="customer-cell">
                      {row.renter.photo ? (
                        <img src={row.renter.photo} alt={row.renter.name} className="cell-avatar" />
                      ) : (
                        <div className="avatar-placeholder-sm"><User size={14} /></div>
                      )}
                      <span>{row.renter.name}</span>
                    </div>
                  </td>
                  <td className="row-item" data-label="Item Rented">
                    <span className={`type-badge ${row.listing.category.toLowerCase()}`}>
                      {row.listing.category}
                    </span>
                    {row.listing.title}
                  </td>
                  <td className="row-dates" data-label="Dates">
                    {format(new Date(row.startDate), 'MMM dd')} - {format(new Date(row.endDate), 'MMM dd, yyyy')}
                  </td>
                  <td data-label="Duration">{differenceInDays(new Date(row.endDate), new Date(row.startDate))} Days</td>
                  <td className="row-payment" data-label="Amount">₹{row.totalAmount.toLocaleString()}</td>
                  <td data-label="Status">
                    <span className={`status-badge ${getStatusClass(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td data-label="Action">
                    <button className="details-btn" onClick={() => setSelected(row)}>
                      Details <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Booking Details</h2>
              <span className="modal-id">#{selected._id.slice(-6)}</span>
            </div>
            
            <div className="modal-body">
              <div className="detail-group">
                <label>Customer Name</label>
                <div className="detail-customer">
                   {selected.renter.photo ? (
                    <img src={selected.renter.photo} alt={selected.renter.name} className="cell-avatar" />
                  ) : (
                    <div className="avatar-placeholder"><User size={20} /></div>
                  )}
                  <span>{selected.renter.name}</span>
                </div>
              </div>
              <div className="detail-group">
                <label>Item Rented</label>
                <p>{selected.listing.title}</p>
              </div>
              <div className="detail-grid">
                <div className="detail-group">
                  <label>Start Date</label>
                  <p>{format(new Date(selected.startDate), 'PPP')}</p>
                </div>
                <div className="detail-group">
                  <label>End Date</label>
                  <p>{format(new Date(selected.endDate), 'PPP')}</p>
                </div>
                <div className="detail-group">
                  <label>Duration</label>
                  <p>{differenceInDays(new Date(selected.endDate), new Date(selected.startDate))} Days</p>
                </div>
                <div className="detail-group">
                  <label>Status</label>
                  <span className={`status-badge ${getStatusClass(selected.status)}`}>{selected.status}</span>
                </div>
              </div>
              
              <div className="payment-breakdown">
                <h3>Payment Breakdown</h3>
                <div className="pb-row">
                  <span>Rental Fee</span>
                  <span>₹{selected.totalAmount.toLocaleString()}</span>
                </div>
                <div className="pb-row">
                  <span>Platform Fee (5%)</span>
                  <span>- ₹{(selected.totalAmount * 0.05).toLocaleString()}</span>
                </div>
                <div className="pb-row total">
                  <span>Net Earnings</span>
                  <span className="earn-color">₹{(selected.totalAmount * 0.95).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-close" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
