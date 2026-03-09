import { useState } from "react";

const EditProfile = ({ user, setEditMode }) => {

  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    location: user.location || "",
    dob: user.dob || ""
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

  setEditMode(false);

};

  return (
    <div className="profile-card">

      <h4>Edit Profile</h4>

      <input
        className="form-control mb-3"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
      />

      <input
        className="form-control mb-3"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />

      <input
        className="form-control mb-3"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone"
      />

      <input
        className="form-control mb-3"
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="Location"
      />

      <input
        className="form-control mb-3"
        name="dob"
        value={form.dob}
        onChange={handleChange}
        placeholder="Date of Birth"
      />

      <button className="btn btn-primary me-2" onClick={handleSave}>
        Save
      </button>

      <button className="btn btn-outline-secondary" onClick={() => setEditMode(false)}>
        Cancel
      </button>

    </div>
  );
};

export default EditProfile;