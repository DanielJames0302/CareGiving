import React from "react";
import "./manage-admin.css";
import AdminDashboard from "../../components/manage-admin/admin-dashboard";

const ManageAdmin = () => {
  return (
    <div className="manage-admin-page">
      <div className="manage-admin-page-wrapper">
        <AdminDashboard />
      </div>
    </div>
  );
};

export default ManageAdmin;
