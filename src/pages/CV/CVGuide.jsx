import React from "react";
import { Layout, Card, Typography, Row, Col, Space, Collapse, Tag, Divider } from "antd";
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  BulbOutlined,
  FileTextOutlined,
  AimOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import "./CVGuide.css";

// Nếu bạn có Header riêng, import & dùng ở trên cùng Layout.Header
// import HeaderBar from "@/components/Header";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const CVGuide = () => {
  const sections = [
    {
      icon: <AimOutlined className="cvg-icon-primary" />,
      title: "Cấu trúc CV chuẩn",
      items: [
        { text: "Thông tin cá nhân (Họ tên, SĐT, Email, LinkedIn)", good: true },
        { text: "Mục tiêu nghề nghiệp ngắn gọn (2-3 câu)", good: true },
        { text: "Kinh nghiệm làm việc (theo thứ tự thời gian ngược)", good: true },
        { text: "Học vấn và chứng chỉ", good: true },
        { text: "Kỹ năng chuyên môn và kỹ năng mềm", good: true },
        { text: "Dự án nổi bật (nếu có)", good: true },
      ],
    },
    {
      icon: <CheckCircleTwoTone twoToneColor="#1677ff" className="cvg-icon-primary" />,
      title: "Nên làm",
      items: [
        { text: "Sử dụng font chữ chuyên nghiệp (Arial, Calibri, Times New Roman)", good: true },
        { text: "Độ dài 1-2 trang, không quá dài dòng", good: true },
        { text: "Tùy chỉnh CV cho từng vị trí ứng tuyển", good: true },
        { text: "Sử dụng số liệu cụ thể để thể hiện thành tích", good: true },
        { text: "Kiểm tra kỹ chính tả và ngữ pháp", good: true },
        { text: "Lưu file PDF để giữ nguyên format", good: true },
      ],
    },
    {
      icon: <CloseCircleTwoTone twoToneColor="#ff4d4f" className="cvg-icon-primary" />,
      title: "Không nên làm",
      items: [
        { text: "Sử dụng quá nhiều màu sắc, font chữ khó đọc", good: false },
        { text: "Viết sai chính tả, lỗi ngữ pháp", good: false },
        { text: "Copy paste mô tả công việc chung chung", good: false },
        { text: "Khai khống kinh nghiệm, kỹ năng", good: false },
        { text: "Thêm thông tin cá nhân không liên quan (chiều cao, cân nặng...)", good: false },
        { text: "Dùng email không chuyên nghiệp", good: false },
      ],
    },
  ];

  const tips = [
    {
      title: "Mục tiêu nghề nghiệp",
      description:
        "Viết ngắn gọn, cụ thể về vị trí bạn muốn ứng tuyển và giá trị bạn mang lại cho công ty.",
      example:
        "Senior Frontend Developer với 5 năm kinh nghiệm React, mong muốn đóng góp vào các dự án web ứng dụng quy mô lớn tại công ty công nghệ hàng đầu.",
    },
    {
      title: "Mô tả kinh nghiệm",
      description: "Sử dụng động từ hành động và số liệu cụ thể để thể hiện thành tích.",
      example:
        "Phát triển và tối ưu hóa giao diện web, giảm thời gian tải trang 40% và tăng conversion rate 25%.",
    },
    {
      title: "Kỹ năng",
      description:
        "Chia thành kỹ năng chuyên môn và kỹ năng mềm, đánh giá mức độ thành thạo.",
      example:
        "Technical: React (Advanced), TypeScript (Advanced), Node.js (Intermediate)\nSoft skills: Làm việc nhóm, Giải quyết vấn đề, Quản lý thời gian",
    },
  ];

  const faqs = [
    {
      q: "CV nên dài bao nhiêu trang?",
      a: "CV tiêu chuẩn nên là 1-2 trang. Với người mới bắt đầu (0-3 năm kinh nghiệm), 1 trang là đủ. Với người có kinh nghiệm (3+ năm), có thể mở rộng thành 2 trang nhưng cần đảm bảo mọi thông tin đều có giá trị và liên quan đến vị trí ứng tuyển.",
    },
    {
      q: "Có cần thêm ảnh vào CV không?",
      a: "Tùy thuộc vào ngành nghề và văn hóa công ty. Ở Việt Nam, nhiều công ty yêu cầu có ảnh trên CV. Nếu thêm ảnh, hãy chọn ảnh chuyên nghiệp, chân dung với trang phục lịch sự và nền đơn giản.",
    },
    {
      q: "Làm thế nào để CV nổi bật với nhà tuyển dụng?",
      a: "1) Tùy chỉnh CV cho từng vị trí cụ thể; 2) Sử dụng từ khóa từ job description; 3) Thể hiện thành tích bằng số liệu cụ thể; 4) Thiết kế sạch sẽ, dễ đọc; 5) Không có lỗi chính tả hay ngữ pháp.",
    },
    {
      q: "Có nên viết Cover Letter không?",
      a: "Cover Letter rất quan trọng, đặc biệt khi ứng tuyển vào các công ty lớn hoặc vị trí cao. Đây là cơ hội để bạn thể hiện sự nhiệt tình, giải thích tại sao bạn phù hợp với vị trí và công ty. Tuy nhiên, cần viết ngắn gọn, súc tích (không quá 1 trang).",
    },
    {
      q: "Cập nhật CV bao lâu một lần?",
      a: "Nên cập nhật CV ngay khi có thành tích mới, dự án mới hoàn thành, hoặc kỹ năng mới đạt được. Ít nhất mỗi 6 tháng nên review và cập nhật CV một lần.",
    },
  ];

  return (
    <Layout className="cvg-layout">
      {/* <HeaderBar /> nếu bạn dùng header riêng */}
      <Content className="cvg-content">
        <div className="cvg-hero">
          <Title level={1} className="cvg-title">Hướng dẫn viết CV</Title>
          <Text type="secondary" className="cvg-subtitle">
            Tất cả những gì bạn cần biết để tạo một CV chuyên nghiệp và ấn tượng
          </Text>
        </div>

        {/* Sections */}
        <Space direction="vertical" size={16} className="cvg-stack">
          {sections.map((sec, i) => (
            <Card key={i} className="cvg-card">
              <div className="cvg-card-head">
                <div className="cvg-icon-box">{sec.icon}</div>
                <Title level={4} className="cvg-card-title">{sec.title}</Title>
              </div>
              <Divider className="cvg-divider" />
              <Row gutter={[0, 8]}>
                {sec.items.map((item, idx) => (
                  <Col span={24} key={idx}>
                    <div className="cvg-list-item">
                      {item.good ? (
                        <CheckCircleTwoTone twoToneColor="#52c41a" className="cvg-li-icon" />
                      ) : (
                        <CloseCircleTwoTone twoToneColor="#ff4d4f" className="cvg-li-icon" />
                      )}
                      <Text className="cvg-li-text">{item.text}</Text>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          ))}
        </Space>

        {/* Tips */}
        <Card className="cvg-card cvg-mt">
          <div className="cvg-card-head">
            <div className="cvg-icon-box">
              <BulbOutlined className="cvg-icon-primary" />
            </div>
            <Title level={4} className="cvg-card-title">Mẹo và ví dụ cụ thể</Title>
          </div>
          <Divider className="cvg-divider" />
          <Space direction="vertical" size={16} className="w-100">
            {tips.map((tip, idx) => (
              <div key={idx} className="cvg-tip">
                <div className="cvg-tip-title">
                  <Tag className="cvg-badge" bordered>
                    {tip.title}
                  </Tag>
                </div>
                <Text type="secondary" className="cvg-muted">{tip.description}</Text>
                <div className="cvg-example">
                  <div className="cvg-example-head">
                    <ThunderboltOutlined className="cvg-icon-primary small" />
                    <Text strong>Ví dụ:</Text>
                  </div>
                  <pre className="cvg-example-text">{tip.example}</pre>
                </div>
              </div>
            ))}
          </Space>
        </Card>

        {/* FAQ */}
        <Card className="cvg-card cvg-mt">
          <div className="cvg-card-head">
            <div className="cvg-icon-box">
              <FileTextOutlined className="cvg-icon-primary" />
            </div>
            <div>
              <Title level={4} className="cvg-card-title">Câu hỏi thường gặp</Title>
              <Text type="secondary">Giải đáp những thắc mắc phổ biến về viết CV</Text>
            </div>
          </div>
          <Divider className="cvg-divider" />
          <Collapse accordion className="cvg-accordion">
            {faqs.map((f, i) => (
              <Panel header={f.q} key={i}>
                <Text type="secondary">{f.a}</Text>
              </Panel>
            ))}
          </Collapse>
        </Card>
      </Content>
    </Layout>
  );
};

export default CVGuide;
