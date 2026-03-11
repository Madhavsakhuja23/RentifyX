import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import { Upload, Home, Car } from 'lucide-react';
import './AddListing.css';

export default function AddListing() {
  const { addListing } = useListings();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Dwelling',
    price: '',
    location: '',
    availableDates: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      addListing(formData);
      setLoading(false);
      navigate('/dashboard/listings');
    }, 600);
  };

  return (
    <div className="add-listing">
      <div className="page-header">
        <h1>Add New Listing</h1>
        <p>Fill out the details below to add a new dwelling or vehicle.</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="listing-form">
          {/* Category Selection */}
          <div className="form-section">
            <label className="section-label">Category</label>
            <div className="category-options">
              <label className={`cat-option ${formData.category === 'Dwelling' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="category"
                  value="Dwelling"
                  checked={formData.category === 'Dwelling'}
                  onChange={handleChange}
                />
                <Home size={24} />
                <span>Dwelling</span>
              </label>
              <label className={`cat-option ${formData.category === 'Vehicle' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="category"
                  value="Vehicle"
                  checked={formData.category === 'Vehicle'}
                  onChange={handleChange}
                />
                <Car size={24} />
                <span>Vehicle</span>
              </label>
            </div>
          </div>

          <div className="form-grid">
            <div className="input-group full-width">
              <label htmlFor="title">Listing Title <span className="req">*</span></label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., Luxury 2BHK Apartment or Honda City 2023"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group full-width">
              <label htmlFor="description">Description <span className="req">*</span></label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Describe your listing, highlights, amenities..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="price">Rent per Day/Hour <span className="req">*</span></label>
              <input
                id="price"
                name="price"
                type="text"
                placeholder="e.g., ₹2,500/day"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="location">Location <span className="req">*</span></label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="City, Area"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group full-width">
              <label htmlFor="availableDates">Availability Dates</label>
              <input
                id="availableDates"
                name="availableDates"
                type="text"
                placeholder="e.g., Weekends, or specific dates"
                value={formData.availableDates}
                onChange={handleChange}
              />
            </div>

            <div className="input-group full-width">
              <label>Images</label>
              <div className="image-upload-area">
                <Upload size={32} />
                <p>Drag & drop images here, or click to browse</p>
                <span>(Optional: A random placeholder will be used if skipped)</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
