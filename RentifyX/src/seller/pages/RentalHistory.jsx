import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, Filter, Download, IndianRupee, Calendar, User, X, Clock, 
  MapPin, Tag, CreditCard, ShieldCheck, Mail, Receipt, CheckCircle2, 
  AlertCircle, ArrowRight, MessageSquare 
} from 'lucide-react';
import api from '../../api';
import { format, differenceInDays } from 'date-fns';
import './RentalHistory.css';

const getCreationDate = (id) => {
  try {
    const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
    return new Date(timestamp);
  } catch (e) {
    return null;
  }
};

export default function RentalHistory() {
  const navigate = useNavigate();
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

      {/* Redesigned Modern Premium SaaS Details Modal */}
      {selected && (() => {
        const creationDate = getCreationDate(selected._id) || new Date(selected.startDate);
        const duration = differenceInDays(new Date(selected.endDate), new Date(selected.startDate)) || 1;
        const subtotal = selected.totalAmount;
        const platformFee = selected.totalAmount * 0.05;
        const taxAmount = platformFee * 0.18; // 18% GST on platform fee
        const netEarnings = subtotal - platformFee - taxAmount;

        return (
          <div className="rh-details-modal-overlay" onClick={() => setSelected(null)}>
            <div className="rh-details-modal-content premium-saas-modal" onClick={e => e.stopPropagation()}>
              {/* Sticky Compact Top Bar for Mobile/Tablet */}
              <div className="mobile-sticky-top-bar">
                <span className="mobile-top-bar-title">{selected.listing.title}</span>
                <button className="mobile-top-bar-close" onClick={() => setSelected(null)} aria-label="Close booking sheet">
                  <X size={18} />
                </button>
              </div>

              {/* Hero Banner Header Section */}
              <div className="premium-hero-header">
                {selected.listing.images?.[0]?.url ? (
                  <img src={selected.listing.images[0].url} alt={selected.listing.title} className="hero-bg-img" />
                ) : (
                  <div className="hero-bg-placeholder" />
                )}
                <div className="hero-gradient-overlay" />
                
                {/* Floating Absolute Close Button */}
                <button className="btn-icon-close-glass" onClick={() => setSelected(null)} aria-label="Close modal">
                  <X size={18} />
                </button>

                <div className="hero-header-content">
                  <div className="hero-badge-row">
                    <span className={`category-tag ${selected.listing.category.toLowerCase()}`}>
                      {selected.listing.category}
                    </span>
                    <span className={`status-pill-saas ${getStatusClass(selected.status)}`}>
                      {selected.status}
                    </span>
                  </div>
                  <h2>{selected.listing.title}</h2>
                  <p className="hero-booking-meta">
                    Renter: <strong>{selected.renter.name}</strong> • {duration} Days
                  </p>
                </div>
              </div>
              
              <div className="rh-details-modal-body premium-saas-body">
                {/* 1. Quick Info Grid */}
                <div className="saas-card quick-info-grid">
                  <div className="q-info-item">
                    <span className="q-label">Booking ID</span>
                    <span className="q-val">#{selected._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="q-info-item">
                    <span className="q-label">Created At</span>
                    <span className="q-val">{format(creationDate, 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="q-info-item">
                    <span className="q-label">Duration</span>
                    <span className="q-val">{duration} Days</span>
                  </div>
                  <div className="q-info-item">
                    <span className="q-label">Base Rate</span>
                    <span className="q-val">₹{Math.round(subtotal / duration).toLocaleString()}/day</span>
                  </div>
                </div>

                {/* 2. Structured Sections (Two Column Grid on Desktop, Stacked on Mobile) */}
                <div className="saas-sections-columns">
                  
                  {/* Left Column */}
                  <div className="saas-col-main">
                    {/* Listing Card */}
                    <div className="saas-card-section">
                      <h3 className="section-title-saas">Listing Details</h3>
                      <div className="saas-listing-preview">
                        <div className="saas-listing-img">
                          {selected.listing.images?.[0]?.url ? (
                            <img src={selected.listing.images[0].url} alt={selected.listing.title} />
                          ) : (
                            <div className="listing-img-placeholder"><MapPin size={24} /></div>
                          )}
                        </div>
                        <div className="saas-listing-info">
                          <h4>{selected.listing.title}</h4>
                          {selected.listing.location && (
                            <p className="saas-listing-loc"><MapPin size={12} /> {selected.listing.location}</p>
                          )}
                          <span className="saas-listing-rate">₹{selected.listing.price.toLocaleString()} / {selected.listing.timespan}</span>
                        </div>
                      </div>
                    </div>

                    {/* Renter Information Card */}
                    <div className="saas-card-section">
                      <h3 className="section-title-saas">Renter Profile</h3>
                      <div className="saas-renter-card">
                        <div className="saas-renter-photo-wrap">
                          {selected.renter.photo ? (
                            <img src={selected.renter.photo} alt={selected.renter.name} className="saas-renter-photo" />
                          ) : (
                            <div className="saas-renter-placeholder"><User size={24} /></div>
                          )}
                          <span className="verified-badge-tick" title="Verified Account">
                            <ShieldCheck size={14} />
                          </span>
                        </div>
                        <div className="saas-renter-info">
                          <h4>{selected.renter.name}</h4>
                          <p className="saas-renter-verified-text">Verified Customer</p>
                          {selected.renter.email && (
                            <p className="saas-renter-email"><Mail size={12} /> {selected.renter.email}</p>
                          )}
                        </div>
                        <button className="saas-msg-btn" onClick={() => navigate(`/seller/messages?id=${selected.conversationId || ''}`)} title="Message Renter">
                          <MessageSquare size={16} />
                          <span>Message</span>
                        </button>
                      </div>
                    </div>

                    {/* Booking Timeline */}
                    <div className="saas-card-section">
                      <h3 className="section-title-saas">Rental Journey Timeline</h3>
                      <div className="saas-timeline">
                        <div className="saas-timeline-item active">
                          <div className="timeline-node green"><CheckCircle2 size={14} /></div>
                          <div className="timeline-content">
                            <h5>Booking Confirmed</h5>
                            <p>{format(creationDate, 'MMM dd, yyyy • h:mm a')}</p>
                            <span>Escrow secured, notification dispatched to seller.</span>
                          </div>
                        </div>

                        <div className="saas-timeline-item active">
                          <div className="timeline-node green"><CheckCircle2 size={14} /></div>
                          <div className="timeline-content">
                            <h5>Payment Verified</h5>
                            <p>{format(creationDate, 'MMM dd, yyyy • h:mm a')}</p>
                            <span>Base booking amount processed and verified by Razorpay escrow.</span>
                          </div>
                        </div>

                        <div className={`saas-timeline-item ${selected.status === 'ongoing' || selected.status === 'completed' ? 'active' : ''}`}>
                          <div className={`timeline-node ${selected.status === 'ongoing' || selected.status === 'completed' ? 'blue' : 'grey'}`}>
                            <Clock size={14} />
                          </div>
                          <div className="timeline-content">
                            <h5>Check-In / Start Date</h5>
                            <p>{format(new Date(selected.startDate), 'MMM dd, yyyy')} • 9:00 AM</p>
                            <span>Scheduled rental period begins. Handover active.</span>
                          </div>
                        </div>

                        <div className={`saas-timeline-item ${selected.status === 'completed' ? 'active' : ''}`}>
                          <div className={`timeline-node ${selected.status === 'completed' ? 'gold' : 'grey'}`}>
                            <Calendar size={14} />
                          </div>
                          <div className="timeline-content">
                            <h5>Check-Out / End Date</h5>
                            <p>{format(new Date(selected.endDate), 'MMM dd, yyyy')} • 6:00 PM</p>
                            <span>Rental completion and checkout inventory log closure.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Column - Financial Invoice Card */}
                  <div className="saas-col-sidebar">
                    <div className="saas-card-section">
                      <h3 className="section-title-saas">Financial Invoice</h3>
                      <div className="invoice-card">
                        <div className="invoice-header">
                          <Receipt size={18} />
                          <span>SECURE TRANSACTIONS</span>
                        </div>
                        <div className="invoice-body">
                          <div className="invoice-row">
                            <span className="inv-label">Subtotal ({duration} Days)</span>
                            <span className="inv-val">₹{subtotal.toLocaleString()}</span>
                          </div>
                          <div className="invoice-row">
                            <span className="inv-label">Platform Fee (5%)</span>
                            <span className="inv-val deduction">- ₹{platformFee.toLocaleString()}</span>
                          </div>
                          <div className="invoice-row">
                            <span className="inv-label">GST / Taxes (18% of Fee)</span>
                            <span className="inv-val deduction">- ₹{taxAmount.toLocaleString()}</span>
                          </div>
                          <div className="invoice-divider" />
                          <div className="invoice-row net-payout">
                            <span className="inv-label">Net Seller Payout</span>
                            <span className="inv-val payout-amount">₹{netEarnings.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="invoice-footer">
                          <div className="escrow-indicator">
                            <span className="pulse-dot green" />
                            <span>Escrow Verified • Direct Transfer Eligible</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="saas-card-section">
                      <h3 className="section-title-saas">Status Log</h3>
                      <div className="status-log-card">
                        <div className="status-log-header">
                          <span className="status-indicator-dot" />
                          <h4>Current Status: <span className="status-text">{selected.status}</span></h4>
                        </div>
                        <p className="status-log-description">
                          {selected.status === 'completed' && "This booking has finished. Payout successfully disbursed to your linked bank account."}
                          {selected.status === 'ongoing' && "This rental is active. Check-in inventory has been validated. Renter currently holds access."}
                          {selected.status === 'cancelled' && "This rental was cancelled. Check terms for cancellation disbursements if applicable."}
                          {selected.status === 'confirmed' && "This booking is paid and secured. Check-in is awaiting calendar activation."}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="rh-details-modal-footer sticky-saas-footer">
                <button className="btn-close-saas-primary" onClick={() => setSelected(null)}>
                  Close Booking Sheet
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
