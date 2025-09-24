import React from "react";
import { Layout, Dropdown, Avatar, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Header: AntHeader } = Layout;

const jobsMenu = {
  items: [
    { key: "1", label: <Link to="/jobs">Tìm kiếm việc làm</Link> },
    { key: "2", label: <Link to="/jobs/saved">Việc làm đã lưu</Link> },
    { key: "3", label: <Link to="/jobs/applied">Việc làm đã ứng tuyển</Link> },
  ],
};

const cvMenu = {
  items: [
    { key: "1", label: <Link to="/cv/templates">Mẫu CV</Link> },
    { key: "2", label: <Link to="/cv/upload">Tải CV lên</Link> },
    { key: "3", label: <Link to="/cv/guide">Hướng dẫn viết CV</Link> },
  ],
};

const Header = () => {
  return (
    <AntHeader style={{ background: "#fff", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/"><img src="/Flexistudy-logo.png" alt="FlexiStudy" style={{ height: 60, marginRight: 8 }} /></Link>
      </div>

      <Space size="large">
        <Dropdown menu={jobsMenu}>
          <span style={{ cursor: "pointer" }}>Việc làm <DownOutlined /></span>
        </Dropdown>

        <Dropdown menu={cvMenu}>
          <span style={{ cursor: "pointer" }}>Hồ sơ/CV <DownOutlined /></span>
        </Dropdown>

        <Link to="/schedule">Cập nhật lịch</Link>
        <Link to="/career-guide">Cẩm nang nghề nghiệp</Link>
      </Space>

      <Space size="large">
        <Avatar src="https://i.pravatar.cc/40" />
      </Space>
    </AntHeader>
  );
};

export default Header;
