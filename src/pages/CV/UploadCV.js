import React from "react";
import { Layout, Typography, Upload, Button, Row, Col, Card } from "antd";
import { UploadOutlined, InboxOutlined, ThunderboltOutlined, BarChartOutlined, GlobalOutlined, TeamOutlined } from "@ant-design/icons";
import "./UploadCVPage.css";

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { Dragger } = Upload;

const UploadCV = () => {
  const props = {
    name: "file",
    multiple: false,
    action: "#", // TODO: thay bằng API upload thực tế
  };

  return (
    <Layout className="upload-cv-layout">
      <Content className="upload-cv-content">
        {/* Banner */}
        <div className="upload-banner">
          <Title level={3} style={{ color: "#fff" }}>
            Tải CV của bạn - Để tăng cơ hội chủ động tìm đến
          </Title>
          <Paragraph style={{ color: "#fff", margin: 0 }}>
            Không cần mất hàng giờ tìm việc. Khi bạn upload CV, hệ thống sẽ tự động kết nối bạn với các Nhà tuyển dụng phù hợp.
          </Paragraph>
        </div>

        {/* Upload Card */}
        <Card className="upload-card">
          <Paragraph style={{ marginBottom: 16 }}>
            Bạn đã có sẵn CV? Đừng để nó nằm yên trong máy tính. Hãy tải lên FlexiStudy – nơi hệ thống thông minh sẽ tự động phân tích, đối chiếu và đề xuất CV của bạn đến những nhà tuyển dụng uy tín, phù hợp với kỹ năng và lịch rảnh của bạn.
          </Paragraph>

          <Dragger {...props} className="upload-dragger">
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ fontSize: 40, color: "#1890ff" }} />
            </p>
            <p className="ant-upload-text">Tải lên CV từ máy tính, chọn hoặc kéo thả</p>
            <p className="ant-upload-hint">
              Hỗ trợ định dạng .doc, .docx, .pdf với kích thước tối đa 5MB
            </p>
          </Dragger>

          <Button type="primary" block style={{ marginTop: 20 }}>
            Lưu
          </Button>
        </Card>

        {/* Lợi ích */}
        <Row gutter={16} className="benefit-row">
        <Col xs={24} md={12} lg={6}>
            <Card className="benefit-card" bordered={false}>
              <ThunderboltOutlined className="benefit-icon" />
              <Title level={5}>Sẵn sàng đón nhận cơ hội tốt nhất</Title>
              <Paragraph>
                Khi bạn hoàn thiện và tải CV lên FlexiStudy, hệ thống sẽ gợi ý và kết nối bạn với những nhà tuyển dụng phù hợp.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card className="benefit-card" bordered={false}>
              <BarChartOutlined className="benefit-icon" />
              <Title level={5}>Theo dõi hiệu quả – Tối ưu CV thông minh</Title>
              <Paragraph>
                Bạn sẽ nhận được đề xuất chỉnh sửa CV giúp hồ sơ của bạn nổi bật hơn và tăng khả năng trúng tuyển.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card className="benefit-card" bordered={false}>
              <GlobalOutlined className="benefit-icon" />
              <Title level={5}>Chia sẻ CV mọi lúc, mọi nơi</Title>
              <Paragraph>
                FlexiStudy cho phép bạn sử dụng link CV trực tuyến để gửi đến nhà tuyển dụng chỉ với một cú nhấp.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card className="benefit-card" bordered={false}>
              <TeamOutlined className="benefit-icon" />
              <Title level={5}>Kết nối nhanh chóng với nhà tuyển dụng phù hợp</Title>
              <Paragraph>
                Nhờ AI phân tích CV, bạn được gợi ý các kết nối ngay với những nhà tuyển dụng uy tín.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default UploadCV;