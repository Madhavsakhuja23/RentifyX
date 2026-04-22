import { useState } from 'react';
import { ChevronRight, Filter } from 'lucide-react';
import './RentalHistory.css';

const dummyHistory = [
  {
    id: 'TR-1082',
    customer: 'Rahul Verma',
    item: 'Honda City 2023',
    start: '2023-10-15',
    end: '2023-10-18',
    duration: '3 Days',
    payment: '₹7,500',
    status: 'Completed',
    paymentStatus: 'Paid',
    avatar: 'https://i.pravatar.cc/150?u=rahul'
  },
  {
    id: 'TR-1083',
    customer: 'Priya Sharma',
    item: 'Modern 2BHK Flat',
    start: '2023-10-20',
    end: '2023-10-25',
    duration: '5 Days',
    payment: '₹12,000',
    status: 'Active',
    paymentStatus: 'Paid',
    avatar: 'https://i.pravatar.cc/150?u=priya'
  },
  {
    id: 'TR-1084',
    customer: 'Amit Patel',
    item: 'Yamaha R15',
    start: '2023-10-28',
    end: '2023-10-29',
    duration: '1 Day',
    payment: '₹1,500',
    status: 'Cancelled',
    paymentStatus: 'Refunded',
    avatar: 'https://i.pravatar.cc/150?u=amit'
  },
  {
    id: 'TR-1085',
    customer: 'Sneha Gupta',
    item: 'Luxury Villa',
    start: '2023-11-01',
    end: '2023-11-05',
    duration: '4 Days',
    payment: '₹32,000',
    status: 'Upcoming',
    paymentStatus: 'Pending',
    avatar: 'https://i.pravatar.cc/150?u=sneha'
  },
  {
    id: 'TR-1086',
    customer: 'Vikram Singh',
    item: 'Royal Enfield Classic',
    start: '2023-09-10',
    end: '2023-09-12',
    duration: '2 Days',
    payment: '₹3,000',
    status: 'Completed',
    paymentStatus: 'Paid',
    avatar: 'https://i.pravatar.cc/150?u=vikram'
  }
];

export default function RentalHistory() {
  const [selected, setSelected] = useState(null);

  const getStatusClass = (status) => {
    switch(status) {
      case 'Completed': return 'status-completed';
      case 'Active': return 'status-active';
      case 'Upcoming': return 'status-upcoming';
      case 'Cancelled': return 'status-cancelled';
      case 'Paid': return 'status-completed';
      case 'Pending': return 'status-upcoming';
      case 'Refunded': return 'status-cancelled';
      default: return '';
    }
  };

  return (
    <div className="rental-history">
      <div className="page-header flex-between">
        <div>
          <h1>Rental History</h1>
          <p>View all past and current rentals for your listings.</p>
        </div>
        <button className="filter-btn">
          <Filter size={18} />
          Filter Options
        </button>
      </div>

      <div className="table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>ID</th>
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
            {dummyHistory.map(row => (
              <tr key={row.id}>
                <td className="row-id">{row.id}</td>
                <td>
                  <div className="customer-cell">
                    <img src={row.avatar} alt={row.customer} className="cell-avatar" />
                    <span>{row.customer}</span>
                  </div>
                </td>
                <td className="row-item">{row.item}</td>
                <td className="row-dates">{row.start} to {row.end}</td>
                <td>{row.duration}</td>
                <td className="row-payment">{row.payment}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td>
                  <button className="details-btn" onClick={() => setSelected(row)}>
                    Details <ChevronRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Booking Details</h2>
              <span className="modal-id">{selected.id}</span>
            </div>
            
            <div className="modal-body">
              <div className="detail-group">
                <label>Customer Name</label>
                <div className="detail-customer">
                  <img src={selected.avatar} alt={selected.customer} className="cell-avatar" />
                  <span>{selected.customer}</span>
                </div>
              </div>
              <div className="detail-group">
                <label>Item Rented</label>
                <p>{selected.item}</p>
              </div>
              <div className="detail-grid">
                <div className="detail-group">
                  <label>Start Date</label>
                  <p>{selected.start}</p>
                </div>
                <div className="detail-group">
                  <label>End Date</label>
                  <p>{selected.end}</p>
                </div>
                <div className="detail-group">
                  <label>Duration</label>
                  <p>{selected.duration}</p>
                </div>
                <div className="detail-group">
                  <label>Rental Status</label>
                  <span className={`status-badge ${getStatusClass(selected.status)}`}>{selected.status}</span>
                </div>
              </div>
              
              <div className="payment-breakdown">
                <h3>Payment Breakdown</h3>
                <div className="pb-row">
                  <span>Rental Fee</span>
                  <span>{selected.payment}</span>
                </div>
                <div className="pb-row">
                  <span>Platform Fee (5%)</span>
                  <span>- ₹{parseInt(selected.payment.replace(/\D/g,'')) * 0.05}</span>
                </div>
                <div className="pb-row total">
                  <span>Net Earnings</span>
                  <span className="earn-color">₹{parseInt(selected.payment.replace(/\D/g,'')) * 0.95}</span>
                </div>
                <div className="pb-status">
                  Payment Status: <strong className={getStatusClass(selected.paymentStatus)}>{selected.paymentStatus}</strong>
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
