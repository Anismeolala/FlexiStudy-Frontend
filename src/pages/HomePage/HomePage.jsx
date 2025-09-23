import React from "react";
import "./HomePage.css";
import { Input, Button } from "antd";
import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import banner_home from "../../assets/img/banner_home4.png";

const HomePage = () => {
  return (
    <div
      className="homepage-banner"
      style={{ backgroundImage: `url(${banner_home})` }}
    >
      <div className="banner-content">
        <h1 className="banner-title">
          Chủ động thời gian - Chủ động cơ hội!
        </h1>
        <p className="banner-subtitle">
          Hơn 500 công việc đang chờ bạn, <br />
          hãy nhanh tay ứng tuyển với công việc phù hợp nhất
        </p>

        {/* Thanh tìm kiếm */}
        <div className="search-box">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm công việc, công ty"
            className="search-input"
          />
          <Input
            prefix={<EnvironmentOutlined />}
            placeholder="Địa điểm"
            className="search-input location-input"
          />
          <Button type="primary" className="search-button">
            Tìm kiếm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
