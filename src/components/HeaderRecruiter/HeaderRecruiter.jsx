import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Dropdown, Menu, message } from "antd";
import { PlusOutlined, BankOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import "./HeaderRecruiter.css";
import { useSelector, useDispatch } from "react-redux";
import { setIsAuthorized, resetUser } from "../../redux/userSlice";

const HeaderRecruiter = () => {
  const { companyName } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    dispatch(resetUser());
    dispatch(setIsAuthorized(false));
    message.success("Đăng xuất thành công");
    navigate("/login");
  };

  //  Menu dropdown Ant Design
  const accountMenu = (
    <Menu
      items={[
        {
          key: "profile",
          label: (
            <span>
              <UserOutlined style={{ marginRight: 8 }} />
              Hồ sơ cá nhân
            </span>
          ),
          onClick: () => {message.info("Chức năng Profile đang được phát triển!")},
        },
        {
          type: "divider",
        },
        {
          key: "logout",
          label: (
            <span style={{ color: "red" }}>
              <LogoutOutlined style={{ marginRight: 8 }} />
              Đăng xuất
            </span>
          ),
          onClick: handleLogout,
        },
      ]}
    />
  );

  const handleClickLogo = () => {
    navigate("/recruiter")
  }

  return (
    <header className="header">
      <div className="header-container">
        <div 
         className="header-left" 
         onClick={() => handleClickLogo()}
         style={{cursor: "pointer"}}
        >
          <div className="header-icon">
            <BankOutlined className="icon" />
          </div>
          <div className="header-text">
            <h1 className="header-title">RecruiterHub</h1>
            <p className="header-subtitle">{companyName || "Your Company"}</p>
          </div>
        </div>

        {/* Menu điều hướng */}
        <nav className="header-nav">
          <Link to="." className="nav-link">
            Dashboard
          </Link>
          <Link to="jobs-recruiter" className="nav-link">
            Jobs
          </Link>
          <Link to="candidates" className="nav-link">
            Candidates
          </Link>
          <Link to="company" className="nav-link">
            Company
          </Link>
          <Link to="jobs/new">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="btn-post"
            >
              Post Job
            </Button>
          </Link>

          {/* 🔹 Dropdown Account */}
          <Dropdown overlay={accountMenu} placement="bottomRight" arrow>
            <Button className="account-btn" icon={<UserOutlined />}>
              Account
            </Button>
          </Dropdown>
        </nav>
      </div>
    </header>
  );
};

export default HeaderRecruiter;
