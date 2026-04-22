import { useState } from 'react';
import { useListings } from '../context/ListingsContext';
import { Pencil, Trash2, EyeOff, Eye, Search } from 'lucide-react';
import './MyListings.css';

export default function MyListings() {
  const { listings, deleteListing, toggleAvailability, updateListing } = useListings();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const filtered = listings.filter((l) => {
    const matchSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || l.category === filter;
    return matchSearch && matchFilter;
  });

  const startEdit = (listing) => {
    setEditingId(listing.id);
    setEditForm({ title: listing.title, description: listing.description, price: listing.price, location: listing.location || '' });
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
            <a href="/dashboard/add-listing" className="empty-cta">
              + Add Your First Listing
            </a>
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
                    <span className="listing-price">{listing.price}</span>
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
                      className="action-icon delete"
                      title="Delete"
                      onClick={() => deleteListing(listing.id)}
                    >
                      <Trash2 size={15} />
                    </button>
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
