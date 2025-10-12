import React from "react";
import { Layout, Row, Col, Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import "./Footer.css";

const { Title, Text, Link } = Typography;

export default function AppFooter() {
  return (
    <div className="site-footer">
      <div className="footer-inner">
        <Row gutter={[48, 32]}>
         
          <Col xs={24} md={6}>
            {/* <div className="footer-logo">
              <img src="/logo.png" alt="FlexiStudy" />
            </div> */}
            <Title level={5} className="footer-heading">FlexiStudy</Title>
            <ul className="footer-list">
              <li><Link href="#">Về FlexiStudy</Link></li>
              <li><Link href="#">Liên Hệ</Link></li>
              <li><Link href="#">Hỏi Đáp</Link></li>
              <li><Link href="#">Thỏa Thuận Sử Dụng</Link></li>
              <li><Link href="#">Quy Định Bảo Mật</Link></li>
            </ul>
          </Col>

     
          <Col xs={24} md={6}>
            <Title level={5} className="footer-heading">Dành cho Nhà tuyển dụng</Title>
            <ul className="footer-list">
              <li><Link href="#">Đăng tuyển dụng</Link></li>
              <li><Link href="#">Tìm kiếm hồ sơ</Link></li>
              <li><Link href="#">Sản phẩm Dịch vụ khác</Link></li>
              <li><Link href="#">Liên hệ</Link></li>
            </ul>
          </Col>

      
          <Col xs={24} md={6}>
            <Title level={5} className="footer-heading">Việc làm theo khu vực</Title>
            <ul className="footer-list">
              <li><Link href="#">Hồ Chí Minh</Link></li>
              <li><Link href="#">Hà Nội</Link></li>
              <li><Link href="#">Hải Phòng</Link></li>
              <li><Link href="#">Đà Nẵng</Link></li>
              <li><Link href="#">Cần Thơ</Link></li>
              <li>
                <Link href="#">
                  Xem tất cả khu vực <RightOutlined />
                </Link>
              </li>
            </ul>
          </Col>

         
          <Col xs={24} md={6}>
            <Title level={5} className="footer-heading">Việc làm theo ngành nghề</Title>
            <ul className="footer-list">
              <li><Link href="#">Kế toán</Link></li>
              <li><Link href="#">Ngân hàng</Link></li>
              <li><Link href="#">Phần mềm máy tính</Link></li>
              <li><Link href="#">IT Support / Help Desk</Link></li>
              <li><Link href="#">Xây dựng</Link></li>
              <li>
                <Link href="#">
                  Tìm việc làm <RightOutlined />
                </Link>
              </li>
            </ul>
          </Col>
        </Row>

        <div className="footer-bottom">
          <Text>Copyright © FlexiStudy All rights reserved.</Text>
        </div>
      </div>
    </div>
  );
}
