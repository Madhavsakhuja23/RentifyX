import { useState, useEffect } from 'react';
import { useListings } from '../context/ListingsContext';
import { Pencil, Trash2, EyeOff, Eye, Search, MessageCircle, Clock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import './MyListings.css';

export default function MyListings() {
  const { listings, deleteListing, toggleAvailability, updateListing } = useListings();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  // Live countdown timer
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (endDate) => {
    const end = new Date(endDate).getTime();
    const diff = end - now;
    if (diff <= 0) return 'Expired';

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);

    return `${d}d ${h}h ${m}m ${s}s remaining`;
  };

  const filtered = listings.filter((l) => {
    const matchSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || l.category === filter;
    return matchSearch && matchFilter;
  });

  const startEdit = (listing) => {
    setEditingId(listing.id);
    setEditForm({
      title: listing.title,
      description: listing.description,
      price: listing.price,
      location: listing.location || '',
    });
  };

  const saveEdit = () => {
    updateListing(editingId, editForm);
    setEditingId(null);
  };

  return (
    <div className="my-listings">
      <div className="page-header">
        <h1>My Listings</h1>
        <p>Manage your dwellings and vehicles</p>
      </div>

      <div className="listings-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {['All', 'Dwelling', 'Vehicle'].map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏠</div>
          <h3>
            {listings.length === 0
              ? "You haven't added any listings yet."
              : 'No matching listings found.'}
          </h3>
          <p>
            {listings.length === 0
              ? 'Start by adding your first dwelling or vehicle.'
              : 'Try adjusting your search or filter.'}
          </p>
          {listings.length === 0 && (
            <Link to="/seller/add-listing" className="empty-cta">
              + Add Your First Listing
            </Link>
          )}
        </div>
      ) : (
        <div className="listings-grid">
          {filtered.map((listing) => (
            <div
              className={`listing-card ${!listing.available ? 'unavailable' : ''}`}
              key={listing.id}
            >
              <div className="listing-img-wrap">
                <img src={listing.image} alt={listing.title} loading="lazy" />
                <span className={`category-badge ${listing.category.toLowerCase()}`}>
                  {listing.category}
                </span>
                {!listing.available && (
                  <div className="unavailable-overlay">Unavailable</div>
                )}
              </div>

              {editingId === listing.id ? (
                <div className="listing-edit-form">
                  <input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Title"
                  />
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Description"
                    rows={2}
                  />
                  <input
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    placeholder="Price"
                  />
                  <input
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="Location"
                  />
                  <div className="edit-actions">
                    <button className="save-btn" onClick={saveEdit}>Save</button>
                    <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="listing-body">
                  <h3>{listing.title}</h3>
                  <p className="listing-desc">{listing.description}</p>
                  <div className="listing-meta">
                    <span className="listing-price">₹{listing.price}/{listing.timespan}</span>
                    {listing.location && (
                      <span className="listing-location">📍 {listing.location}</span>
                    )}
                  </div>
                  <div className="listing-actions">
                    <button
                      className="action-icon edit"
                      title="Edit"
                      onClick={() => startEdit(listing)}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      className="action-icon toggle"
                      title={listing.available ? 'Mark Unavailable' : 'Mark Available'}
                      onClick={() => toggleAvailability(listing.id)}
                    >
                      {listing.available ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button
                      className="action-icon message-btn"
                      title="Messages"
                      onClick={() => navigate(`/seller/messages?listingId=${listing.id}`)}
                    >
                      <MessageCircle size={15} />
                    </button>
                    <button
                      className="action-icon delete"
                      title="Delete"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this listing?')) {
                          deleteListing(listing.id);
                        }
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* Ongoing Booking Info (seller dashboard feature) */}
              {listing.ongoingBookings && listing.ongoingBookings.length > 0 && !editingId && (
                <div className="ongoing-booking-banner">
                  <div className="booking-info">
                    <strong>Current Renter:</strong> {listing.ongoingBookings[0].renter?.name || 'Unknown'}
                  </div>
                  <div className="booking-countdown">
                    <Clock size={14} />
                    <span>{formatCountdown(listing.ongoingBookings[0].endDate)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
