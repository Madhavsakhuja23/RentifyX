import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Check, X } from "lucide-react";

const EditProfile = ({ user, setEditMode }) => {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    dob: user?.dob || ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      ...form
    };

    localStorage.setItem(
      "currentUser",
      JSON.stringify(updatedUser)
    );

    // Trigger storage event so Profile.jsx can pick up the changes if needed
    window.dispatchEvent(new Event('storage'));

    setEditMode(false);
  };

  // Get today's date in YYYY-MM-DD format to restrict future dates
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="settings-premium-card">
      <div className="settings-header">
        <h2>Account Settings</h2>
        <p>Update your personal details to enhance your RentifyX experience.</p>
      </div>

      <div className="settings-form-grid">
        <div className="form-group-premium">
          <label>Full Name</label>
          <div className="input-wrapper-premium">
            <User className="input-icon" size={18} />
            <input
              className="input-premium"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>
        </div>

        <div className="form-group-premium">
          <label>Email Address</label>
          <div className="input-wrapper-premium">
            <Mail className="input-icon" size={18} />
            <input
              type="email"
              className="input-premium"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div className="form-group-premium">
          <label>Phone Number</label>
          <div className="input-wrapper-premium">
            <Phone className="input-icon" size={18} />
            <input
              type="tel"
              className="input-premium"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <div className="form-group-premium">
          <label>Location</label>
          <div className="input-wrapper-premium">
            <MapPin className="input-icon" size={18} />
            <input
              className="input-premium"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="City, Country"
            />
          </div>
        </div>

        <div className="form-group-premium">
          <label>Date of Birth</label>
          <div className="input-wrapper-premium">
            <Calendar className="input-icon" size={18} />
            <input
              type="date"
              className="input-premium"
              name="dob"
              value={form.dob}
              max={today}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="save-btn-premium" onClick={handleSave}>
          <Check size={16} style={{ display: 'inline', marginRight: '8px' }} />
          Save Changes
        </button>
        <button className="cancel-btn-premium" onClick={() => setEditMode(false)}>
          <X size={16} style={{ display: 'inline', marginRight: '8px' }} />
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditProfile;