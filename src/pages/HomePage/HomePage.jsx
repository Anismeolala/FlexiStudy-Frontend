import React, { useState } from "react";
import "./HomePage.css";
import { Input, Button, Card, Carousel, Typography, Row, Col } from "antd";
import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import banner_home from "../../assets/img/galweb-banner.jpg";
import {
  AppstoreOutlined,
  CodeOutlined,
  DollarOutlined,
  TeamOutlined,
  BarChartOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";

import {
  UserAddOutlined,
  CloudUploadOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  CalendarOutlined,
  SafetyCertificateOutlined,
  LineChartOutlined,
  AimOutlined,
} from "@ant-design/icons";
import Paragraph from "antd/es/skeleton/Paragraph";

const { Title, Text } = Typography;

const plans = [
  {
    title: "Miễn phí",
    price: "Miễn phí",
    description:
      "Dành cho sinh viên mới bắt đầu hoặc muốn trải nghiệm các tính năng cơ bản của FlexiStudy.",
    features: [
      "Miễn phí truy cập và ứng tuyển.",
      "Đề xuất việc làm AI phiên bản giới hạn",
      "Cập nhật thủ công lịch rảnh",
    ],
    button: "Đăng ký ngay",
    type: "free",
  },
  {
    title: "Premeium",
    price: "49.000đ/THÁNG",
    description:
      "Dành cho sinh viên muốn tăng khả năng hiển thị hồ sơ, nhận gợi ý việc làm chính xác và theo dõi quá trình ứng tuyển hiệu quả hơn.",
    features: [
      "Đề xuất theo năng lực & khung giờ rảnh",
      "Ưu tiên hiển thị hồ sơ",
      "Nhắn Tin Trực Tiếp Với Nhà Tài Trợ",
      "Báo Cáo Hiệu Quả & Phân Tích Dự Án",
    ],
    button: "Đăng ký ngay",
    type: "premium",
  },
  {
    title: "Career Pro Plan",
    price: "99.000đ/THÁNG",
    description:
      "Dành cho sinh viên nghiêm túc đầu tư vào sự nghiệp. Gói nâng cao giúp cá nhân hóa hành trình nghề nghiệp, phân tích hiệu suất và cải thiện CV định kỳ.",
    features: [
      "Phân tích hiệu suất ứng tuyển",
      "CV review định kỳ (AI hoặc mentor)",
      "Gợi ý lộ trình nghề nghiệp cá nhân hóa",
      "Khóa học kỹ năng mềm tích hợp",
    ],
    button: "Đăng ký ngay",
    type: "pro",
  },
];

const steps = [
  {
    icon: <UserAddOutlined />,
    title: "Tạo tài khoản",
    description:
      "Tạo tài khoản và bắt đầu hành trình tìm việc làm phù hợp cùng FlexiStudy",
  },
  {
    icon: <CloudUploadOutlined />,
    title: "Tải lên hồ sơ",
    description:
      "Gửi CV để nhận gợi ý việc làm tốt hơn và hoàn thiện hồ sơ cá nhân",
  },
  {
    icon: <SearchOutlined />,
    title: "Khám phá việc làm",
    description:
      "Khám phá công việc linh hoạt đúng với kỹ năng và lịch học của bạn",
  },
  {
    icon: <CheckCircleOutlined />,
    title: "Gửi hồ sơ ứng tuyển",
    description:
      "Ứng tuyển dễ dàng, kết nối nhanh chóng với công việc phù hợp",
  },
];

const features = [
  {
    icon: <AppstoreOutlined style={{ fontSize: 36, color: "#1677ff" }} />,
    title: "Tìm việc nhanh chóng",
    description:
      "FlexiStudy sử dụng công nghệ gợi ý AI dựa trên hồ sơ cá nhân, thời gian rảnh và hành vi tìm kiếm của bạn để đưa ra công việc phù hợp nhất.",
  },
  {
    icon: <CalendarOutlined style={{ fontSize: 36, color: "#1677ff" }} />,
    title: "Linh hoạt tuyệt đối về thời gian",
    description:
      "Chỉ cần cập nhật thời gian rảnh trong tuần, bạn sẽ nhận được gợi ý việc làm khớp lịch – không lo trùng lịch học, thi cử hay hoạt động cá nhân.",
  },
  {
    icon: (
      <SafetyCertificateOutlined style={{ fontSize: 36, color: "#1677ff" }} />
    ),
    title: "Nhà tuyển dụng uy tín",
    description:
      "Tất cả nhà tuyển dụng trên FlexiStudy đều được xác minh và có thể bị đánh giá nếu không uy tín.",
  },
  {
    icon: <LineChartOutlined style={{ fontSize: 36, color: "#1677ff" }} />,
    title: "Theo dõi tiến trình phát triển cá nhân",
    description:
      "Sau mỗi công việc, bạn có thể đánh giá kỹ năng đã phát triển, lưu thành tích làm việc, và dùng làm minh chứng trong CV sau này.",
  },
  {
    icon: <AimOutlined style={{ fontSize: 36, color: "#1677ff" }} />,
    title: "Hiểu sinh viên – Tạo khác biệt",
    description:
      "FlexiStudy được thiết kế riêng cho sinh viên, không chỉ giúp bạn tìm việc, mà còn phát triển kỹ năng, quản lý thời gian và xây dựng hồ sơ nghề nghiệp ngay từ trên ghế giảng đường.",
  },
];

const jobs = [
  {
    title: "Nhân Viên Bán Hàng Th...",
    company: "Công ty TNHH Wabe Sabe",
    location: "Hồ Chí Minh",
  },
  {
    title: "Nhân Viên Marketing (Pa...",
    company: "Công Ty TNHH Nội Thất ZAADA",
    location: "Hồ Chí Minh",
  },
  {
    title: "Nhân Viên Thu Ngân (Fu...",
    company: "Công Ty TNHH Thương Mại Dịch Vụ",
    location: "Hồ Chí Minh",
  },
  {
    title: "Nhân Viên Social Media",
    company: "Công Ty TNHH Công Nghệ VA",
    location: "Hồ Chí Minh",
  },
];

const categories = [
  { icon: <AppstoreOutlined />, name: "Thiết kế", jobs: 235 },
  { icon: <BarChartOutlined />, name: "Sales", jobs: 756 },
  { icon: <SolutionOutlined />, name: "Marketing", jobs: 140 },
  { icon: <DollarOutlined />, name: "Tài chính", jobs: 325 },
  { icon: <CodeOutlined />, name: "Công nghệ", jobs: 436 },
  { icon: <UserOutlined />, name: "Kỹ sư", jobs: 542 },
  { icon: <TeamOutlined />, name: "Kinh doanh", jobs: 211 },
  { icon: <UserOutlined />, name: "Nhân sự", jobs: 346 },
];

const JobCard = ({ job }) => (
  <Card
    hoverable
    style={{ width: 220, margin: "0 8px" }}
    cover={<div style={{ height: 80, background: "#f5f5f5" }} />}
  >
    <Card.Meta title={job.title} description={`${job.company} - ${job.location}`} />
  </Card>
);


const HomePage = () => {

    const [activeCategory, setActiveCategory] = useState("Marketing");

  return (
    <>
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
 <div style={{ padding: 24 }}>
      {/* Công việc tuyển gấp */}
      <Title level={4}>Công việc tuyển gấp</Title>
 <Carousel dots={true}>
  {[0, 1].map((slide) => (   // ví dụ có 8 job => 2 slide
    <div key={slide}>
      <div className="job-carousel-slide">
        {jobs.slice(slide * 4, slide * 4 + 4).map((job, i) => (
          <JobCard key={i} job={job} />
        ))}
      </div>
    </div>
  ))}
</Carousel>

      {/* Việc làm theo ngành */}
      <Title level={4} style={{ marginTop: 40 }}>
        Việc làm theo ngành
      </Title>
      <Row gutter={[16, 16]}>
        {categories.map((cat, i) => (
          <Col xs={12} sm={8} md={6} lg={6} key={i}>
            <Card
              hoverable
              style={{
                textAlign: "center",
                border:
                  activeCategory === cat.name
                    ? "2px solid #1677ff"
                    : "1px solid #f0f0f0",
                backgroundColor:
                  activeCategory === cat.name ? "#1677ff" : "#fff",
                color: activeCategory === cat.name ? "#fff" : "#000",
              }}
              onClick={() => setActiveCategory(cat.name)}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{cat.icon}</div>
              <Text strong style={{ color: activeCategory === cat.name ? "#fff" : "#000" }}>
                {cat.name}
              </Text>
              <br />
              <Text style={{ color: activeCategory === cat.name ? "#fff" : "#888" }}>
                {cat.jobs} Việc làm
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

     {/* Công việc mới nhất */}
<Title level={4} style={{ marginTop: 40 }}>
  Công việc mới nhất
</Title>
<Carousel dots={true}>
  {[...Array(Math.ceil(jobs.length / 4))].map((_, slide) => (
    <div key={slide}>
      <div className="job-carousel-slide">
        {jobs.slice(slide * 4, slide * 4 + 4).map((job, i) => (
          <JobCard key={i} job={job} />
        ))}
      </div>
    </div>
  ))}
</Carousel>
    </div>

    {/* <div
      className="promotion-section"
      style={{ backgroundImage: `url(${bgBanner})` }}
    >
      <div className="promotion-content">
        <p className="promotion-sub">Xây dựng thương hiệu cá nhân cùng FlexiStudy</p>
        <Title level={2} className="promotion-title">
          Hãy trở thành ứng viên mà <br /> nhà tuyển dụng đang tìm kiếm
        </Title>
        <Paragraph className="promotion-text">
          Tạo hồ sơ toàn diện và bắt đầu nhận được lời mời phỏng vấn cùng những
          cơ hội việc làm phù hợp với kỹ năng riêng của bạn.
          <br />
          <br />
          Bắt đầu hành trình đến công việc mơ ước – từ một hồ sơ ấn tượng
        </Paragraph>
        <Button type="primary" size="large" className="promotion-btn">
          Tạo CV ngay
        </Button>
      </div>
    </div> */}

    <div className="why-section">
      <Title level={2} className="why-title">
        Vì sao sinh viên chọn FlexiStudy?
      </Title>
      <Row gutter={[24, 24]} justify="center">
        {features.map((feature, index) => (
          <Col xs={24} sm={12} md={8} lg={8} key={index}>
            <Card className="why-card" hoverable>
              <div className="why-icon">{feature.icon}</div>
              <Title level={4} className="why-card-title">
                {feature.title}
              </Title>
              <p className="why-card-text">{feature.description}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>

<div className="pricing-section">
      <Title level={3} className="pricing-title">
        Nâng cấp tài khoản
      </Title>
      <Title level={2} className="pricing-subtitle">
        Mở khóa nhiều quyền lợi hơn
      </Title>

      <Row gutter={24} align="stretch">
      {plans.map((p, idx) => (
        <Col xs={24} md={8} key={idx} className="plan-col">
          <Card className={`plan-card ${p.type}`} bordered={false}>
            <div className="plan-inner">
              <h4 className="plan-title">{p.title}</h4>
              <h2 className="plan-price">{p.price}</h2>
              <p className="plan-desc">{p.desc}</p>

              <ul className="plan-list">
                {p.features.map((f, i) => (
                  <li key={i}>✔ {f}</li>
                ))}
              </ul>

              <Button type="primary" size="large" className="plan-btn" block>
                Đăng ký ngay
              </Button>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
    </div>

    </>
  );
};

export default HomePage;
