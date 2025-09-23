import React from "react";
import { Layout, Row, Col, Typography } from "antd";
import {
  RightOutlined
} from "@ant-design/icons";
import "./Footer.css";

const { Footers } = Layout;
const { Title, Text, Link } = Typography;

const Footer = () => {
  return (
    <Footer className="custom-footer">
      <Row gutter={[32, 32]}>
        {/* Cột logo + FlexiStudy */}
        <Col xs={24} md={6}>
          <div className="footer-logo">
            <img
              src="/logo.png"
              alt="FlexiStudy"
              className="logo-img"
            />
          </div>
          <Title level={5} className="footer-title">FlexiStudy</Title>
          <ul className="footer-list">
            <li><Link>Về FlexiStudy</Link></li>
            <li><Link>Liên Hệ</Link></li>
            <li><Link>Hỏi Đáp</Link></li>
            <li><Link>Thỏa Thuận Sử Dụng</Link></li>
            <li><Link>Quy Định Bảo Mật</Link></li>
          </ul>
        </Col>

        {/* Dành cho nhà tuyển dụng */}
        <Col xs={24} md={6}>
          <Title level={5} className="footer-title">Dành cho Nhà tuyển dụng</Title>
          <ul className="footer-list">
            <li><Link>Đăng tuyển dụng</Link></li>
            <li><Link>Tìm kiếm hồ sơ</Link></li>
            <li><Link>Sản phẩm Dịch vụ khác</Link></li>
            <li><Link>Liên hệ</Link></li>
          </ul>
        </Col>

        {/* Việc làm theo khu vực */}
        <Col xs={24} md={6}>
          <Title level={5} className="footer-title">Việc làm theo khu vực</Title>
          <ul className="footer-list">
            <li><Link>Hồ Chí Minh</Link></li>
            <li><Link>Hà Nội</Link></li>
            <li><Link>Hải Phòng</Link></li>
            <li><Link>Đà Nẵng</Link></li>
            <li><Link>Cần Thơ</Link></li>
            <li><Link>Xem tất cả khu vực <RightOutlined /></Link></li>
          </ul>
        </Col>

        {/* Việc làm theo ngành nghề */}
        <Col xs={24} md={6}>
          <Title level={5} className="footer-title">Việc làm theo ngành nghề</Title>
          <ul className="footer-list">
            <li><Link>Kế toán</Link></li>
            <li><Link>Ngân hàng</Link></li>
            <li><Link>Phần mềm máy tính</Link></li>
            <li><Link>IT Support / Help Desk</Link></li>
            <li><Link>Xây dựng</Link></li>
            <li><Link>Tìm việc làm <RightOutlined /></Link></li>
          </ul>
        </Col>
      </Row>

      {/* Copyright */}
      <div className="footer-bottom">
        <Text>Copyright © FlexiStudy All rights reserved.</Text>
      </div>
    </Footer>
  );
};

export default Footer;
