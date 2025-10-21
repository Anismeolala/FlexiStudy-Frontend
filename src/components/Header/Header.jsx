import React, { useEffect, useState } from "react";
import { Layout, Menu, Dropdown, Avatar, Space, message, Button } from "antd";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ROLE } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap-icons/font/bootstrap-icons.css";
import { fetchLogoutAPI } from "../../apis";
import { resetUser, setIsAuthorized } from "../../redux/userSlice";
import ProfilePopup from "../ProfilePopup/ProfilePopup";

const { Header: AntHeader } = Layout;


const jobsMenu = {
  items: [
    { key: "1", label: <Link to="/jobs">Tìm kiếm việc làm</Link> },
    { key: "2", label: <Link to="/jobs/saved">Việc làm của tôi</Link> },
  ],
};

const cvMenu = {
  items: [
    { key: "1", label: <Link to="/cv/templates">Mẫu CV</Link> },
    { key: "2", label: <Link to="/cv/upload">Tải CV lên</Link> },
    { key: "3", label: <Link to="/cv/guide">Hướng dẫn viết CV</Link> },
  ],
};

const HeaderBar = () => {
  const isAuthorized = useSelector((state) => state.user.isAuthorized);
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const userData = useSelector((state) => state.user);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const navigate = useNavigate();

    const onMenuClick = ({ key }) => {
      if (key === "logout") handleButtonLogin();
      if (key === "profile") handleProfileClick();
    };
    

   const items = [
    {
      key: "profile",
      label: (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          Profile
        </span>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: (
        <span>
          <LogoutOutlined style={{ marginRight: 8 }} />
          Log out
        </span>
      ),
    },
  ];

    const handleClosePopup = () => {
    setShowProfilePopup(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  }


  const handleButtonLogin = () => {
    navigate("/login");
  };
  useEffect(() => {
    setUser(userData);
  }, [userData]);

return (
    <AntHeader
  style={{
    background: "#fff",
    padding: "0 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    height: 64,
  }}
>
  {/* Logo */}
  <div style={{ display: "flex", alignItems: "center" }}>
    <Link to="/">
      <img
        src="/logo2.png"
        alt="FlexiStudy"
        style={{
          height: 200,
          marginRight: 12,
          marginTop: 5
        }}
      />
    </Link>
  </div>

  {/* Menu */}
  <Space size="large" style={{ fontSize: 15, fontWeight: 500 }}>
    <Dropdown menu={jobsMenu} trigger={["hover"]}>
      <span
        style={{
          cursor: "pointer",
          color: "#333",
          transition: "color 0.2s",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#1677ff")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
      >
        Việc làm <DownOutlined style={{ fontSize: 11 }} />
      </span>
    </Dropdown>

    <Dropdown menu={cvMenu} trigger={["hover"]}>
      <span
        style={{
          cursor: "pointer",
          color: "#333",
          transition: "color 0.2s",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#1677ff")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
      >
        Hồ sơ/CV <DownOutlined style={{ fontSize: 11 }} />
      </span>
    </Dropdown>

    <Link
      to="/schedule"
      style={{
        color: "#333",
        textDecoration: "none",
        transition: "color 0.2s",
        fontWeight: 500,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#1677ff")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
    >
      Cập nhật lịch
    </Link>

    <Link
      to="/career-guide"
      style={{
        color: "#333",
        textDecoration: "none",
        transition: "color 0.2s",
        fontWeight: 500,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#1677ff")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
    >
      Cẩm nang nghề nghiệp
    </Link>
  </Space>

  <div style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
  {isAuthorized ? (
    <>
      <Avatar
        src={user?.avatarUrl}
        icon={<UserOutlined />}
        onClick={() => setShowProfilePopup(!showProfilePopup)}
        style={{ cursor: "pointer" }}
      />
      <ProfilePopup 
        visible={showProfilePopup} 
        onClose={handleClosePopup} 
      />
    </>
  ) : (
    <Button
      className="btn btn-outline-light me-2"
      type="primary"
      onClick={handleButtonLogin}
    >
      Login
    </Button>
  )}
</div>


</AntHeader>

  );
};

export default HeaderBar;
