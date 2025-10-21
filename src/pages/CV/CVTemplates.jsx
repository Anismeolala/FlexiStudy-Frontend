import React from "react";
import { Layout, Card, Typography, Button, Row, Col, Tag } from "antd";
import { EyeOutlined, DownloadOutlined } from "@ant-design/icons";
import "./CVTemplates.css";

const { Content } = Layout;
const { Title, Text } = Typography;

// 🔹 Mock data mẫu CV
const cvTemplates = [
  {
    id: "tpl-1",
    name: "CV Chuẩn ATS",
    description: "Bố cục rõ ràng, thân thiện với hệ thống lọc ATS.",
    category: "ATS Friendly",
    thumbnail: "https://i.imgur.com/r7oW7NO.png", // ví dụ thumbnail
  },
  {
    id: "tpl-2",
    name: "CV Chuyên nghiệp",
    description: "Thiết kế tối giản, phù hợp cho mọi ngành nghề.",
    category: "Professional",
    thumbnail: "https://i.imgur.com/y0eTz2A.png",
  },
  {
    id: "tpl-3",
    name: "CV Sáng tạo",
    description: "Bố cục độc đáo, nhấn mạnh cá tính & hình ảnh.",
    category: "Creative",
    thumbnail: "https://i.imgur.com/CX8m3cg.png",
  },
  {
    id: "tpl-4",
    name: "CV Sinh viên / Thực tập",
    description: "Phù hợp sinh viên, dễ chỉnh sửa và trình bày rõ ràng.",
    category: "Entry Level",
    thumbnail: "https://i.imgur.com/9t9oBOd.png",
  },
];

const CVTemplates = () => {
  const handleDownloadTemplate = (templateName) => {
    // Tạm thời chỉ báo tải demo
    // TODO: thay bằng API thật hoặc link download
    // eslint-disable-next-line no-alert
    alert(`Đang tải mẫu CV: ${templateName}`);
  };

  const handlePreview = (template) => {
    // Tạm thời chỉ xem demo
    // TODO: mở modal preview hoặc navigate
    // eslint-disable-next-line no-alert
    alert(`Xem trước: ${template.name}`);
  };

  return (
    <Layout className="cv-layout">
      <Content className="cv-content">
        <div className="cv-hero">
          <Title level={1} className="cv-title">Mẫu CV</Title>
          <Text type="secondary" className="cv-subtitle">
            Tải về các mẫu CV chuyên nghiệp, tối ưu ATS
          </Text>
        </div>

        <Row gutter={[16, 16]}>
          {cvTemplates.map((t) => (
            <Col key={t.id} xs={24} sm={12} lg={8}>
              <Card hoverable className="cv-tpl-card">
                <div className="cv-tpl-thumb">
                  <img src={t.thumbnail} alt={t.name} />
                  <Tag className="cv-tpl-badge">{t.category}</Tag>
                </div>
                <div className="cv-tpl-body">
                  <Title level={4} className="cv-tpl-title">{t.name}</Title>
                  <Text type="secondary" className="cv-tpl-desc">{t.description}</Text>
                  <div className="cv-tpl-actions">
                    <Button className="cv-btn" onClick={() => handleDownloadTemplate(t.name)}>
                      <DownloadOutlined className="mr-6" />
                      Tải về
                    </Button>
                    <Button className="cv-btn" onClick={() => handlePreview(t)}>
                      <EyeOutlined className="mr-6" />
                      Xem
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default CVTemplates;
