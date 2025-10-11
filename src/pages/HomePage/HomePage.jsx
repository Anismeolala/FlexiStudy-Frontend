import React, { useEffect, useState } from "react";
import "./HomePage.css";
import {
  Input,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Pagination,
  Spin,
  Tabs,
} from "antd";
import { EnvironmentOutlined, SearchOutlined, AppstoreOutlined } from "@ant-design/icons";
import banner_home from "../../assets/img/banner12.jpg";
import { getAllJobsAPI, getJobCategoriesAPI } from "../../apis";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

  const JobCard = ({ job, onClick }) => {
    const salaryText =
      job.minSalary && job.maxSalary
        ? `${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()} ${job.currency || "VND"}`
        : job.minSalary
        ? `${job.minSalary.toLocaleString()} ${job.currency || "VND"}`
        : "Thoả thuận";

    const daysLeft = job.expiryDate ? dayjs(job.expiryDate).diff(dayjs(), "day") : null;
    const isExpiringSoon = daysLeft !== null && daysLeft <= 3 && daysLeft >= 0;

    return (
      <Card
        hoverable
        style={{ borderRadius: 10, height: "100%", overflow: "hidden" }}
        onClick={onClick}
        cover={
          <div
            style={{
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f8f9fa",
              position: "relative",
            }}
          >
            <img
              src={job.companyLogoUrl || "/default-company.png"}
              alt={job.companyName}
              style={{ maxHeight: 60, objectFit: "contain" }}
            />
            {/* 🔥 Nhãn Sắp hết hạn */}
            {isExpiringSoon && (
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "#ff4d4f",
                  color: "#fff",
                  fontSize: 12,
                  padding: "2px 6px",
                  borderRadius: 6,
                }}
              >
                Sắp hết hạn
              </div>
            )}
          </div>
        }
      >
        <Card.Meta
          title={
            <div style={{ fontWeight: 600, fontSize: 15, color: "#1677ff" }}>
              {job.title}
            </div>
          }
          description={
            <>
              <div style={{ color: "#000", fontWeight: 500 }}>{job.companyName}</div>
              <div style={{ color: "#888" }}>
                <EnvironmentOutlined /> {job.city}
              </div>
              <div style={{ color: "#1677ff", marginTop: 4 }}>💰 {salaryText}</div>
              {job.expiryDate && (
                <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                  ⏰ Hạn: {dayjs(job.expiryDate).format("DD/MM/YYYY")}
                </div>
              )}
            </>
          }
        />
      </Card>
    );
  };

const HomePage = () => {
  const navigate = useNavigate();

  // Shared config
  const pageSize = 8;
  const cityList = ["Tất cả", "Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Bình Dương"];

  // 🔥 Tuyển gấp
  const [urgentJobs, setUrgentJobs] = useState([]);
  const [pageUrgent, setPageUrgent] = useState(1);
  const [totalUrgent, setTotalUrgent] = useState(0);
  const [cityUrgent, setCityUrgent] = useState("");
  const [loadingUrgent, setLoadingUrgent] = useState(true);

  // 🆕 Mới nhất
  const [newestJobs, setNewestJobs] = useState([]);
  const [pageNewest, setPageNewest] = useState(1);
  const [totalNewest, setTotalNewest] = useState(0);
  const [cityNewest, setCityNewest] = useState("");
  const [loadingNewest, setLoadingNewest] = useState(true);

  // 📂 Category
  const [categories, setCategories] = useState([]);

  // 🔥 Fetch tuyển gấp
  const fetchUrgentJobs = async () => {
    try {
      setLoadingUrgent(true);
      const res = await getAllJobsAPI({
        page: pageUrgent,
        size: pageSize,
        city: cityUrgent,
        urgent: true,
      });
      setUrgentJobs(res.result.data || []);
      setTotalUrgent(res.result.totalElements || 0);
    } catch (e) {
      console.error("❌ Lỗi tải việc làm tuyển gấp:", e);
    } finally {
      setLoadingUrgent(false);
    }
  };

  // 🆕 Fetch mới nhất
  const fetchNewestJobs = async () => {
    try {
      setLoadingNewest(true);
      const res = await getAllJobsAPI({
        page: pageNewest,
        size: pageSize,
        city: cityNewest,
        urgent: false,
      });
      setNewestJobs(res.result.data || []);
      setTotalNewest(res.result.totalElements || 0);
    } catch (e) {
      console.error("❌ Lỗi tải việc làm mới nhất:", e);
    } finally {
      setLoadingNewest(false);
    }
  };

  // 📊 Fetch category
  const fetchCategories = async () => {
    try {
      const res = await getJobCategoriesAPI();
      setCategories(res.result || []);
    } catch (e) {
      console.error("❌ Lỗi tải danh mục:", e);
    }
  };

  useEffect(() => {
    fetchUrgentJobs();
  }, [pageUrgent, cityUrgent]);

  useEffect(() => {
    fetchNewestJobs();
  }, [pageNewest, cityNewest]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      {/* ==== Banner Section ==== */}
      <div className="homepage-banner" style={{ backgroundImage: `url(${banner_home})` }}>
        <div className="banner-content">
          <h1 className="banner-title">Chủ động thời gian - Chủ động cơ hội!</h1>
          <p className="banner-subtitle">
            Hơn 500 công việc đang chờ bạn, <br /> hãy nhanh tay ứng tuyển với công việc phù hợp nhất
          </p>

          <div className="search-box">
            <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm công việc, công ty" className="search-input" />
            <Input prefix={<EnvironmentOutlined />} placeholder="Địa điểm" className="search-input location-input" />
            <Button type="primary" className="search-button">
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>

      {/* ==== Jobs Tabs Section ==== */}
      <div style={{ padding: 24, background: "#fff" }}>
        <Tabs defaultActiveKey="newest" centered>
          {/* 🆕 Mới nhất */}
          <TabPane tab="🆕 Việc làm mới nhất" key="newest">
            <div className="city-filter-bar" style={{ marginBottom: 16 }}>
              {cityList.map((c) => (
                <button
                  key={c}
                  className={cityNewest === c || (c === "Tất cả" && cityNewest === "") ? "active" : ""}
                  onClick={() => {
                    setCityNewest(c === "Tất cả" ? "" : c);
                    setPageNewest(1);
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            {loadingNewest ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Spin size="large" tip="Đang tải công việc..." />
              </div>
            ) : (
              <>
                <Row gutter={[16, 16]}>
                  {newestJobs.map((job) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={job.id}>
                      <JobCard job={job} onClick={() => navigate(`/jobs/${job.id}`)} />
                    </Col>
                  ))}
                </Row>

                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <Pagination
                    current={pageNewest}
                    total={totalNewest}
                    pageSize={pageSize}
                    onChange={(p) => setPageNewest(p)}
                    showSizeChanger={false}
                  />
                </div>
              </>
            )}
          </TabPane>

          {/* 🔥 Tuyển gấp */}
          <TabPane tab="🔥 Việc làm tuyển gấp" key="urgent">
            <div className="city-filter-bar" style={{ marginBottom: 16 }}>
              {cityList.map((c) => (
                <button
                  key={c}
                  className={cityUrgent === c || (c === "Tất cả" && cityUrgent === "") ? "active" : ""}
                  onClick={() => {
                    setCityUrgent(c === "Tất cả" ? "" : c);
                    setPageUrgent(1);
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            {loadingUrgent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Spin size="large" tip="Đang tải công việc..." />
              </div>
            ) : (
              <>
                <Row gutter={[16, 16]}>
                  {urgentJobs.map((job) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={job.id}>
                      <JobCard job={job} onClick={() => navigate(`/jobs/${job.id}`)} />
                    </Col>
                  ))}
                </Row>

                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <Pagination
                    current={pageUrgent}
                    total={totalUrgent}
                    pageSize={pageSize}
                    onChange={(p) => setPageUrgent(p)}
                    showSizeChanger={false}
                  />
                </div>
              </>
            )}
          </TabPane>      
        </Tabs>
      </div>

      {/* ==== Category Section ==== */}
      <div style={{ padding: "40px 24px" }}>
        <Title level={4}>📂 Việc làm theo ngành</Title>
        <Row gutter={[16, 16]}>
          {categories.map((cat, i) => (
            <Col xs={12} sm={8} md={6} lg={6} key={i}>
              <Card
                hoverable
                style={{
                  textAlign: "center",
                  border: "1px solid #f0f0f0",
                  borderRadius: 8,
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>
                  <AppstoreOutlined />
                </div>
                <Text strong>{cat.category}</Text>
                <br />
                <Text type="secondary">{cat.count} việc làm</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default HomePage;
