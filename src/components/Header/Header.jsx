import React from "react";
import { Layout, Menu, Dropdown, Avatar, Space } from "antd";
import {
  BellOutlined,
  MessageOutlined,
  DownOutlined,
} from "@ant-design/icons";
import "bootstrap-icons/font/bootstrap-icons.css";

const { Header } = Layout;

const HeaderBar = () => {
  const jobsMenu = (
    <Menu
      items={[
        { key: "1", label: "Tìm kiếm việc làm" },
        { key: "2", label: "Việc làm đã lưu" },
        { key: "3", label: "Việc làm đã ứng tuyển" },
      ]}
    />
  );

  const cvMenu = (
    <Menu
      items={[
        { key: "1", label: "Mẫu CV" },
        { key: "2", label: "Tải CV lên" },
        { key: "3", label: "Hướng dẫn viết CV" },
      ]}
    />
  );

  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src="./Flexistudy-logo.png" alt="FlexiStudy" style={{ height: 200, marginRight: 8 }} />
      </div>

      {/* Menu chính */}
      <Space size="large">
        <Dropdown overlay={jobsMenu}>
          <a onClick={(e) => e.preventDefault()}>
            Việc làm <DownOutlined />
          </a>
        </Dropdown>

        <Dropdown overlay={cvMenu}>
          <a onClick={(e) => e.preventDefault()}>
            Hồ sơ/CV <DownOutlined />
          </a>
        </Dropdown>

        <a>Cập nhật lịch</a>
        <a>Cẩm nang nghề nghiệp</a>
      </Space>

      {/* Icon & Avatar */}
      <Space size="large">
        <Avatar src="https://i.pravatar.cc/40" />
      </Space>
    </Header>
  );
};

export default HeaderBar;
