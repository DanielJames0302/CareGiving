import React from "react";
import "./profile.css";
import ProfileDashboard from "../../components/profile/profile-dashboard";

const Profile = () => {
  return (
    <div className="profile-page">
      <div className="profile-page-wrapper">
        <ProfileDashboard />
      </div>
    </div>
  );
};

export default Profile;
