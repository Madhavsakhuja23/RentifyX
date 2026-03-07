import { Mail, Phone, MapPin, Calendar, Edit } from "lucide-react";
import { useState } from "react";

const ProfileInfo = ({ user, setEditMode }) => {
    const [avatar,setAvatar] = useState(
  localStorage.getItem("avatar") || ""
);
const handleAvatarChange = (e) => {

  const file = e.target.files[0];

  const reader = new FileReader();

  reader.onloadend = () => {
    localStorage.setItem("avatar", reader.result);
    setAvatar(reader.result);
  };

  if(file){
    reader.readAsDataURL(file);
  }

};

  if (!user) {
    return <p>No user data found</p>;
  }

  return (
    <div className="profile-card">

      <div className="profile-info-header">

        <div className="profile-avatar">

  {avatar ? (
    <img src={avatar} alt="avatar"/>
  ) : (
    user?.name?.charAt(0)
  )}

  <label className="avatar-upload">
    <input type="file" onChange={handleAvatarChange}/>
  </label>

</div>

        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>

        <button className="edit-btn" onClick={() => setEditMode(true)}>
          <Edit size={16} /> Edit Profile
        </button>

      </div>


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