import React from "react";
import { Card, Button, Row, Col, Tag } from "antd";
import "./CVTemplates.css";

const cvData = [
  { id: 1, name: "Anne Robertson", img: "/cv-samples/cv1.png" },
  { id: 2, name: "Name Surname", img: "/cv-samples/cv2.png" },
  { id: 3, name: "Laura Parker", img: "/cv-samples/cv3.png" },
  { id: 4, name: "Laura Anderson", img: "/cv-samples/cv4.png" },
  { id: 5, name: "Henry Smith", img: "/cv-samples/cv5.png" },
  { id: 6, name: "Thomas Smith", img: "/cv-samples/cv6.png" },
  { id: 7, name: "Alexa Smith", img: "/cv-samples/cv7.png" },
  { id: 8, name: "Stephanie Galraven", img: "/cv-samples/cv8.png" },
  { id: 9, name: "Mary Johnson", img: "/cv-samples/cv9.png" },
];

function CVTemplates() {
  return (
    <div className="cv-template-page">
      {/* Banner xanh */}
      <div className="cv-template-banner">
        <h2>CV Mẫu – Gây ấn tượng từ cái nhìn đầu tiên</h2>
        <p>
          Tại FlexiStudy, bạn có thể tạo CV chuẩn chỉnh theo từng ngành nghề và
          vị trí. Từ phong cách đơn giản, chuyên nghiệp đến sáng tạo – tất cả
          đều được thiết kế riêng để phù hợp với sinh viên và người mới đi làm.
        </p>
      </div>

      {/* Bộ lọc */}
      <div className="cv-template-filter">
        <Tag className="filter-tag active">Đơn giản</Tag>
        <Tag className="filter-tag">Hiện đại</Tag>
        <Tag className="filter-tag">Sáng tạo</Tag>
        <Tag className="filter-tag">Chuyên nghiệp</Tag>
      </div>

      {/* Danh sách CV */}
      <Row gutter={[20, 20]} justify="center">
        {cvData.map((cv) => (
          <Col key={cv.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={<img alt={cv.name} src={cv.img} className="cv-img" />}
              className="cv-card"
            >
              <h4 className="cv-name">{cv.name}</h4>
              <Button type="primary" block>
                Tạo CV
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Phân trang */}
      <div className="cv-pagination">
        <span className="dot active"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
}

export default CVTemplates;
