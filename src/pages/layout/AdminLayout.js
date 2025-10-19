import React, { useState } from 'react'
import './AdminLayout.css' 
import { Avatar, Layout } from 'antd'
import { UserOutlined } from "@ant-design/icons";
import { Outlet } from 'react-router-dom'
import { useSelector } from "react-redux";
import ProfilePopup from '../../components/ProfilePopup/ProfilePopup';
import Sidebar from '../../components/Sidebar/Sidebar';

const AdminLayout = (children) => {
  const [collapsed, setCollapsed] = useState(true);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const user = useSelector((state) => state.user);
  const layout = useSelector((state) => state.layout);
  const handleAvatarClick = () => {
    setShowProfilePopup(!showProfilePopup);
  };

  const handleClosePopup = () => {
    setShowProfilePopup(false);
  };

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="admin-container">
      <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <Sidebar
          collapsed={collapsed} handleToggleSidebar={handleToggleSidebar}
        />
      </div>
      <div className={`admin-content ${collapsed ? 'collapsed' : ''}`}>
        <div className="admin-header">
          <div className="left-side">
            <div className="admin-title">
              <span className="admin-title-icon" style={{ marginRight: "8px" }}>
                {layout.icon}
              </span>
              {layout.title}
            </div>
          </div>

          <div className="right-side">
            <div className="profile-section" onClick={handleAvatarClick}>
              <Avatar
                size="default"
                src={user.avatarUrl}
                icon={<UserOutlined />}
                className="header-avatar"
              />
              <span className="admin-header-title">
                {user.fullName || user.username || "Admin"}
              </span>
            </div>
          </div>
        </div>
          <div className="admin-main-scrollable">
            <Outlet />
          </div>
      </div>

      <ProfilePopup visible={showProfilePopup} onClose={handleClosePopup} />
    </div>
  );
};

export default AdminLayout;