import { useState } from 'react';
import {
    Car,
    Bike,
    Zap,
    CircleDot,
    Upload,
    MapPin,
    DollarSign,
    Save,
    Gauge,
    Shield,
    Navigation,
    Bluetooth,
    Music,
    Users,
    Fuel,
    Settings
} from 'lucide-react';

const AddVehicles = () => {
    const [selectedType, setSelectedType] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        pricePerDay: '',
        pricePerHour: '',
        features: []
    });

    const vehicleTypes = [
        { id: 'car', label: 'Car', icon: Car },
        { id: 'bike', label: 'Bike', icon: Bike },
        { id: 'ev', label: 'EV', icon: Zap },
        { id: 'bicycle', label: 'Bicycle', icon: CircleDot },
    ];

    const features = [
        { id: 'ac', label: 'AC', icon: Settings },
        { id: 'gps', label: 'GPS Navigation', icon: Navigation },
        { id: 'bluetooth', label: 'Bluetooth', icon: Bluetooth },
        { id: 'music', label: 'Music System', icon: Music },
        { id: 'helmet', label: 'Helmet Included', icon: Shield },
        { id: 'insurance', label: 'Insurance', icon: Shield },
        { id: 'multiSeater', label: '5+ Seater', icon: Users },
        { id: 'fuelIncluded', label: 'Fuel Included', icon: Fuel },
    ];

    const handleFeatureToggle = (featureId) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.includes(featureId)
                ? prev.features.filter(id => id !== featureId)
                : [...prev.features, featureId]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting:', { type: selectedType, ...formData });
        alert('Vehicle listing submitted successfully!');
    };

    return (
        <div>
            {/* Page Header */}
            <div className="seller-page-header">
                <h1>Add Vehicle</h1>
                <p>List your vehicle for rent</p>
            </div>

            <div className="seller-form-container">
                <form onSubmit={handleSubmit}>
                    {/* Type Selection */}
                    <div className="seller-form-group">
                        <label className="seller-form-label">Select Vehicle Type</label>
                        <div className="seller-type-selector">
                            {vehicleTypes.map((type) => (
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
                        <label className="seller-form-label">Vehicle Title</label>
                        <input
                            type="text"
                            className="seller-form-input"
                            placeholder="e.g., Honda City 2023 - Automatic"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    {/* Description */}
                    <div className="seller-form-group">
                        <label className="seller-form-label">Description</label>
                        <textarea
                            className="seller-form-textarea"
                            placeholder="Describe your vehicle. Mention condition, mileage, special features, etc."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Images */}
                    <div className="seller-form-group">
                        <label className="seller-form-label">Vehicle Images</label>
                        <div className="seller-image-upload">
                            <Upload />
                            <p>Drag and drop images here or click to browse</p>
                            <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>Upload up to 8 images (JPG, PNG)</p>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="seller-form-group">
                        <label className="seller-form-label">
                            <MapPin size={16} style={{ display: 'inline', marginRight: '6px' }} />
                            Pickup Location
                        </label>
                        <input
                            type="text"
                            className="seller-form-input"
                            placeholder="e.g., Airport, City Center, Your Address"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    {/* Pricing */}
                    <div className="seller-form-row">
                        <div className="seller-form-group">
                            <label className="seller-form-label">
                                <DollarSign size={16} style={{ display: 'inline', marginRight: '6px' }} />
                                Price per Day
                            </label>
                            <input
                                type="number"
                                className="seller-form-input"
                                placeholder="Daily rental price"
                                value={formData.pricePerDay}
                                onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                            />
                        </div>
                        <div className="seller-form-group">
                            <label className="seller-form-label">
                                <Gauge size={16} style={{ display: 'inline', marginRight: '6px' }} />
                                Price per Hour (Optional)
                            </label>
                            <input
                                type="number"
                                className="seller-form-input"
                                placeholder="Hourly rental price"
                                value={formData.pricePerHour}
                                onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Features */}
                    <div className="seller-form-group">
                        <label className="seller-form-label">Features & Inclusions</label>
                        <div className="seller-amenities-grid">
                            {features.map((feature) => (
                                <label key={feature.id} className="seller-amenity-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={formData.features.includes(feature.id)}
                                        onChange={() => handleFeatureToggle(feature.id)}
                                    />
                                    <feature.icon size={18} />
                                    <span>{feature.label}</span>
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

export default AddVehicles;
