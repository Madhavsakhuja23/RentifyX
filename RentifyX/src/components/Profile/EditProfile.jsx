import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Check, X } from "lucide-react";
import { useAuth } from "../../seller/context/AuthContext";
import { updateProfileApi } from "../../api";

const EditProfile = ({ user, setEditMode }) => {
  const { updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    dob: user?.dob || ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      // Save to backend (MongoDB)
      const data = await updateProfileApi(form);

      // Update AuthContext + localStorage with fresh data from server
      updateProfile(data.user);

      setEditMode(false);
    } catch (err) {
      console.log("Profile update error:", err);
      setError(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // Get today's date in YYYY-MM-DD format to restrict future dates
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="settings-premium-card">
      <div className="settings-header">
        <h2>Account Settings</h2>
        <p>Update your personal details to enhance your RentifyX experience.</p>
      </div>

      {error && (
        <p style={{ color: "#ff4d4f", fontSize: "14px", marginBottom: "16px" }}>
          {error}
        </p>
      )}

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
        <button className="save-btn-premium" onClick={handleSave} disabled={saving}>
          <Check size={16} style={{ display: 'inline', marginRight: '8px' }} />
          {saving ? "Saving..." : "Save Changes"}
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