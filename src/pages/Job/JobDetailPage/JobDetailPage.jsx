import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getJobByIdAPI } from "../../../apis";
import {
  Card,
  Typography,
  Spin,
  Row,
  Col,
  Button,
  Divider,
  Tag,
} from "antd";
import {
  EnvironmentOutlined,
  DollarOutlined,
  FieldTimeOutlined,
  ApartmentOutlined,
  CalendarOutlined,
  LeftOutlined,
  CheckCircleTwoTone,
  BuildOutlined ,
} from "@ant-design/icons";
import "./JobDetailPage.css"; 

const { Title, Text, Paragraph } = Typography;

const JobDetailPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoOk, setLogoOk] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await getJobByIdAPI(jobId);
        setJob(res.result);
        setLogoOk(!!res?.result?.companyLogoUrl);
      } catch (error) {
        console.error("❌ Lỗi khi tải job:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [jobId]);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" tip="Đang tải chi tiết công việc..." />
      </div>
    );

  if (!job) return <div>Không tìm thấy công việc</div>;

  const salaryText =
    job.minSalary && job.maxSalary
      ? `${job.minSalary.toLocaleString("vi-VN")} - ${job.maxSalary.toLocaleString(
          "vi-VN"
        )} ${job.currency || "VND"}`
      : job.minSalary
      ? `${job.minSalary.toLocaleString("vi-VN")} ${job.currency || "VND"}`
      : "Thoả thuận";

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

  const isFeatured = !!job.featured || !!job.urgent;

  const reqList = (text) =>
    (text || "")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);

  return (
    <div className="jobdetail">
      <div className="container">
        <Button
          icon={<LeftOutlined />}
          type="text"
          className="jd-back"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>

        <Row gutter={24}>
          {/* =================== Main =================== */}
          <Col xs={24} lg={16}>
            {/* Header Card */}
            <Card className="jd-card">
              <div className="jd-head">
                <div className="jd-head__left">
                  <div className="jd-logo">
                    {logoOk ? (
                      <img
                        src={job.companyLogoUrl}
                        alt={job.companyName}
                        onError={() => setLogoOk(false)}
                      />
                    ) : (
                      <div className="jd-logo__fallback">
                        {(job.companyName || "CT")
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="jd-titlebox">
                    <h1 className="jd-title">{job.title}</h1>
                    <div className="jd-company">
                      <BuildOutlined /> <span>{job.companyName}</span>
                    </div>
                  </div>
                </div>

                {isFeatured && <Tag className="jd-badge">Nổi bật</Tag>}
              </div>

              <div className="jd-infos">
                <span>
                  <EnvironmentOutlined /> {job.city || "Toàn quốc"}
                </span>
                <span>
                  <ApartmentOutlined /> {job.mode || "Không rõ"}
                </span>
                <span>
                  <FieldTimeOutlined /> {job.type || "Không rõ"}
                </span>
                <span className="jd-salary">
                  <DollarOutlined /> {salaryText}
                </span>
                {job.postedAt && (
                  <span>
                    <CalendarOutlined /> {formatDate(job.postedAt)}
                  </span>
                )}
              </div>
            </Card>

            {/* Description */}
            {job.description && (
              <Card className="jd-card">
                <Title level={4} className="jd-section-title">
                  Mô tả công việc
                </Title>
                <Paragraph className="jd-text">{job.description}</Paragraph>
              </Card>
            )}

            {/* Requirements */}
            {job.requirements && (
              <Card className="jd-card">
                <Title level={4} className="jd-section-title">
                  Yêu cầu công việc
                </Title>
                <ul className="jd-list">
                  {reqList(job.requirements).map((req, i) => (
                    <li key={i}>
                      <CheckCircleTwoTone twoToneColor="#52c41a" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Benefits */}
            {job.benefits && (
              <Card className="jd-card">
                <Title level={4} className="jd-section-title">
                  Quyền lợi
                </Title>
                <ul className="jd-list">
                  {reqList(job.benefits).map((b, i) => (
                    <li key={i}>
                      <CheckCircleTwoTone twoToneColor="#52c41a" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* General info */}
            <Card className="jd-card">
              <Title level={4} className="jd-section-title">
                Thông tin chung
              </Title>
              <Paragraph className="jd-text">
                <EnvironmentOutlined /> <b>Địa điểm:</b> {job.address || "Không xác định"}
              </Paragraph>
              <Paragraph className="jd-text">
                <CalendarOutlined /> <b>Hạn nộp hồ sơ:</b>{" "}
                {job.expiryDate ? formatDate(job.expiryDate) : "Không rõ"}
              </Paragraph>
            </Card>
          </Col>

          {/* =================== Sidebar =================== */}
          <Col xs={24} lg={8}>
            <div className="jd-sticky">
              <Card className="jd-apply">
                <Button size="large" className="jd-btn-primary" block>
                  Ứng tuyển ngay
                </Button>
                <Button size="large" block>
                  Lưu tin
                </Button>
              </Card>

              <Card className="jd-card">
                <Title level={4} className="jd-section-title">
                  Về công ty
                </Title>
                <div className="jd-companybox">
                  <div className="jd-logo jd-logo--sm">
                    {logoOk ? (
                      <img
                        src={job.companyLogoUrl}
                        alt={job.companyName}
                        onError={() => setLogoOk(false)}
                      />
                    ) : (
                      <div className="jd-logo__fallback">{(job.companyName || "CT")
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}</div>
                    )}
                  </div>
                  <div>
                    <div className="jd-companyname">{job.companyName}</div>
                    <div className="jd-companysub">Technology</div>
                  </div>
                </div>
                <Divider />
                <Paragraph className="jd-text">
                  Công ty công nghệ hàng đầu chuyên phát triển giải pháp phần mềm
                  cho thị trường quốc tế.
                </Paragraph>
                <Button block>Trang công ty</Button>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default JobDetailPage;
