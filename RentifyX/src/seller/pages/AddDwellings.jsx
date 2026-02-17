import { useState } from 'react';
import {
    Home,
    Building2,
    Hotel,
    Plane,
    Upload,
    MapPin,
    DollarSign,
    Save,
    Wifi,
    Wind,
    Car,
    Waves,
    Tv,
    UtensilsCrossed,
    Shirt,
    Dumbbell
} from 'lucide-react';

const AddDwellings = () => {
    const [selectedType, setSelectedType] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        address: '',
        price: '',
        amenities: []
    });

    const dwellingTypes = [
        { id: 'house', label: 'House', icon: Home },
        { id: 'flat', label: 'Flat', icon: Building2 },
        { id: 'pg', label: 'PG', icon: Hotel },
        { id: 'travel', label: 'Travel Stay', icon: Plane },
    ];

    const amenities = [
        { id: 'wifi', label: 'WiFi', icon: Wifi },
        { id: 'ac', label: 'AC', icon: Wind },
        { id: 'parking', label: 'Parking', icon: Car },
        { id: 'pool', label: 'Pool', icon: Waves },
        { id: 'tv', label: 'TV', icon: Tv },
        { id: 'kitchen', label: 'Kitchen', icon: UtensilsCrossed },
        { id: 'laundry', label: 'Laundry', icon: Shirt },
        { id: 'gym', label: 'Gym', icon: Dumbbell },
    ];

    const handleAmenityToggle = (amenityId) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenityId)
                ? prev.amenities.filter(id => id !== amenityId)
                : [...prev.amenities, amenityId]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting:', { type: selectedType, ...formData });
        alert('Dwelling listing submitted successfully!');
    };

    return (
        <div>
            {/* Page Header */}
            <div className="seller-page-header">
                <h1>Add Dwelling</h1>
                <p>Create a new property listing for rent</p>
            </div>

            <div className="seller-form-container">
                <form onSubmit={handleSubmit}>
                    {/* Type Selection */}
                    <div className="seller-form-group">
                        <label className="seller-form-label">Select Property Type</label>
                        <div className="seller-type-selector">
                            {dwellingTypes.map((type) => (
                                <div
                                    key={type.id}
                                    className={`seller-type-option ${selectedType === type.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedType(type.id)}
                                >
                                    <type.icon />
                                    <span>{type.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="seller-form-group">
                        <label className="seller-form-label">Listing Title</label>
                        <input
                            type="text"
                            className="seller-form-input"
                            placeholder="e.g., Cozy 2BHK Apartment with Sea View"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    {/* Description */}
                    <div className="seller-form-group">
                        <label className="seller-form-label">Description</label>
                        <textarea
                            className="seller-form-textarea"
                            placeholder="Describe your property in detail. Mention key features, nearby attractions, etc."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Images */}
                    <div className="seller-form-group">
                        <label className="seller-form-label">Property Images</label>
                        <div className="seller-image-upload">
                            <Upload />
                            <p>Drag and drop images here or click to browse</p>
                            <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>Upload up to 10 images (JPG, PNG)</p>
                        </div>
                    </div>

                    {/* Location & Address */}
                    <div className="seller-form-row">
                        <div className="seller-form-group">
                            <label className="seller-form-label">
                                <MapPin size={16} style={{ display: 'inline', marginRight: '6px' }} />
                                City / Location
                            </label>
                            <input
                                type="text"
                                className="seller-form-input"
                                placeholder="e.g., Mumbai, Bangalore"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <div className="seller-form-group">
                            <label className="seller-form-label">Full Address</label>
                            <input
                                type="text"
                                className="seller-form-input"
                                placeholder="Complete address with landmark"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Price */}
                    <div className="seller-form-group" style={{ maxWidth: '300px' }}>
                        <label className="seller-form-label">
                            <DollarSign size={16} style={{ display: 'inline', marginRight: '6px' }} />
                            Price per Night
                        </label>
                        <input
                            type="number"
                            className="seller-form-input"
                            placeholder="Enter price"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>

                    {/* Amenities */}
                    <div className="seller-form-group">
                        <label className="seller-form-label">Amenities & Offerings</label>
                        <div className="seller-amenities-grid">
                            {amenities.map((amenity) => (
                                <label key={amenity.id} className="seller-amenity-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={formData.amenities.includes(amenity.id)}
                                        onChange={() => handleAmenityToggle(amenity.id)}
                                    />
                                    <amenity.icon size={18} />
                                    <span>{amenity.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="seller-submit-btn">
                        <Save size={20} />
                        Create Listing
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddDwellings;
