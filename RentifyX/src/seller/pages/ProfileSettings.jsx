import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, Save } from 'lucide-react';
import './ProfileSettings.css';

export default function ProfileSettings() {
  const { user, updateProfile } = useAuth();
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize with user data or empty strings
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    paymentMethod: user?.paymentMethod || '',
    currentPassword: '',
    newPassword: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    // In a real app, you'd add password checking here.
    setTimeout(() => {
      updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        paymentMethod: formData.paymentMethod,
        ...(formData.newPassword && { password: formData.newPassword })
      });
      setSuccessMsg('Profile updated successfully!');
      setLoading(false);
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: ''
      }));

      setTimeout(() => setSuccessMsg(''), 3000);
    }, 600);
  };

  const initials = formData.name
    ? formData.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="profile-settings">
      <div className="page-header">
        <h1>Profile Settings</h1>
        <p>Manage your account details and preferences.</p>
      </div>

      <div className="settings-container">
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="profile-photo-section">
            <div className="avatar-preview">
              {initials}
              <button type="button" className="upload-btn" title="Change Photo">
                <Camera size={16} />
              </button>
            </div>
            <div className="photo-info">
              <h3>Profile Photo</h3>
              <p>We recommend an image of at least 400x400px.</p>
            </div>
          </div>

          <div className="form-section-title">Personal Information</div>
          <div className="settings-grid">
            <div className="seller-form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="seller-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled // Usually email changes require extra verification
              />
            </div>
            <div className="seller-form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-section-title mt-2">Payment Details</div>
          <div className="settings-grid">
            <div className="seller-form-group full-width">
              <label htmlFor="paymentMethod">Preferred Payment Receiving Method</label>
              <input
                id="paymentMethod"
                name="paymentMethod"
                type="text"
                placeholder="e.g., UPI ID (name@okhdfcbank) or Bank Account info"
                value={formData.paymentMethod}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-section-title mt-2">Change Password</div>
          <div className="settings-grid">
            <div className="seller-form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="Leave blank to keep current"
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </div>
            <div className="seller-form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Must be at least 6 characters"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {successMsg && <div className="success-message">{successMsg}</div>}

          <div className="form-actions border-top">
            <button type="submit" className="btn-save" disabled={loading}>
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
