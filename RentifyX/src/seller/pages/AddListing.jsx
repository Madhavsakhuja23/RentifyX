import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import { Upload, Home, Car, X, ImagePlus, CheckCircle, AlertCircle, ChevronDown, Clock } from 'lucide-react';
import './AddListing.css';

const SUBCATEGORY_OPTIONS = {
  Dwelling: ['Villa', 'Flat', 'PG', 'Travel Stay'],
  Vehicle: ['Cars', 'EV', 'Bike', 'Bicycle'],
};

const API_URL = 'http://localhost:5001/api/listings';

export default function AddListing() {
  const navigate = useNavigate();
  const { addListing } = useListings();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]); // Array of { file, preview }

  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    category: 'Dwelling',
    subcategory: '',
    price: '',
    timespan: '',
    location: '',
    availableDates: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      // Reset subcategory when category changes
      if (name === 'category') {
        return { ...prev, category: value, subcategory: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  // ---- Image handling ----

  const addFiles = (fileList) => {
    setError('');
    const newFiles = Array.from(fileList).filter((f) => f.type.startsWith('image/'));

    if (newFiles.length === 0) {
      setError('Only image files are allowed.');
      return;
    }

    const combined = [...images];

    for (const file of newFiles) {
      if (combined.length >= 5) break;
      // Avoid duplicates by name + size
      const dup = combined.find((i) => i.file.name === file.name && i.file.size === file.size);
      if (!dup) {
        combined.push({ file, preview: URL.createObjectURL(file) });
      }
    }

    if (combined.length > 5) {
      setError('You can upload a maximum of 5 images.');
      setImages(combined.slice(0, 5));
    } else {
      setImages(combined);
    }
  };

  const removeImage = (index) => {
    setError('');
    setImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleFileInput = (e) => {
    addFiles(e.target.files);
    e.target.value = ''; // reset so same file can be re-selected
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  // ---- Submit ----

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (images.length !== 5) {
      setError('You must upload exactly 5 images.');
      return;
    }

    setLoading(true);

    try {
      const body = new FormData();
      body.append('title', formData.title);
      body.append('tagline', formData.tagline);
      body.append('description', formData.description);
      body.append('category', formData.category);
      body.append('subcategory', formData.subcategory);
      body.append('price', formData.price);
      body.append('timespan', formData.timespan);
      body.append('location', formData.location);
      body.append('availableDates', formData.availableDates);

      images.forEach((img) => {
        body.append('images', img.file);
      });

      const currentUser = JSON.parse(localStorage.getItem('currentUser'));

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: currentUser?.id || '',
        },
        body,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || 'Something went wrong');
      }

      // Cleanup previews
      images.forEach((img) => URL.revokeObjectURL(img.preview));

      // Add to local context to show in My Listings immediately
      addListing(data.listing);

      navigate('/seller/listings');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const imageCount = images.length;

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

          {/* Subcategory Dropdown */}
          <div className="form-section">
            <label className="section-label">Subcategory <span className="req">*</span></label>
            <div className="select-wrapper">
              <select
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                required
                className="styled-select"
              >
                <option value="" disabled>Select a subcategory</option>
                {SUBCATEGORY_OPTIONS[formData.category]?.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
              <ChevronDown size={18} className="select-icon" />
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
              <label htmlFor="tagline">Tagline</label>
              <input
                id="tagline"
                name="tagline"
                type="text"
                placeholder="e.g., Stunning pool villa with mountain views"
                value={formData.tagline}
                onChange={handleChange}
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

            <div className="input-group full-width">
              <label htmlFor="price">Rent Price <span className="req">*</span></label>
              <div className="price-timespan-row">
                <div className="price-input-wrapper">
                  <span className="currency-symbol">₹</span>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    placeholder="e.g., 2500"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="timespan-select-wrapper">
                  <Clock size={16} className="timespan-icon" />
                  <select
                    id="timespan"
                    name="timespan"
                    value={formData.timespan}
                    onChange={handleChange}
                    required
                    className="styled-select timespan-select"
                  >
                    <option value="" disabled>Select</option>
                    <option value="hour">per Hour</option>
                    <option value="night">per Night</option>
                    <option value="week">per Week</option>
                    <option value="month">per Month</option>
                  </select>
                  <ChevronDown size={16} className="select-icon" />
                </div>
              </div>
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

            {/* ── Image Upload Section ── */}
            <div className="input-group full-width">
              <label>
                Images <span className="req">*</span>
                <span className={`image-counter ${imageCount === 5 ? 'complete' : ''}`}>
                  {imageCount === 5 ? (
                    <><CheckCircle size={14} /> {imageCount}/5</>
                  ) : (
                    <>{imageCount}/5</>
                  )}
                </span>
              </label>

              {/* Preview grid */}
              {images.length > 0 && (
                <div className="image-preview-grid">
                  {images.map((img, idx) => (
                    <div key={idx} className="preview-card">
                      <img src={img.preview} alt={`Preview ${idx + 1}`} />
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeImage(idx)}
                        title="Remove image"
                      >
                        <X size={14} />
                      </button>
                      <span className="preview-index">{idx + 1}</span>
                    </div>
                  ))}

                  {/* Add-more slot if < 5 */}
                  {images.length < 5 && (
                    <button
                      type="button"
                      className="preview-card add-more-slot"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImagePlus size={24} />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              )}

              {/* Drop zone — shown when no images yet */}
              {images.length === 0 && (
                <div
                  className={`image-upload-area ${dragOver ? 'drag-over' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <Upload size={32} />
                  <p>Drag & drop images here, or click to browse</p>
                  <span>Upload exactly 5 images (required)</span>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileInput}
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="form-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || images.length !== 5}
            >
              {loading ? 'Uploading & Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
