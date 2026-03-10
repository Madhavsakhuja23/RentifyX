import { Mail, Phone, MapPin, Calendar } from "lucide-react";

const ProfileInfo = ({ user, setEditMode }) => {
  if (!user) {
    return <p>No user data found</p>;
  }

  return (
    <div className="profile-card">
      <div className="profile-details">

        <div className="profile-field">
          <Mail size={16} />
          <span>{user.email}</span>
        </div>

        <div className="profile-field">
          <Phone size={16} />
          <span>{user.phone || "Not added"}</span>
        </div>

        <div className="profile-field">
          <MapPin size={16} />
          <span>{user.location || "Not added"}</span>
        </div>

        <div className="profile-field">
          <Calendar size={16} />
          <span>{user.dob || "Not added"}</span>
        </div>

      </div>
    </div>
  );
};

export default ProfileInfo;