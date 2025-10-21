import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getJobByIdAPI,
  saveJobAPI,
  unsaveJobAPI,
  checkSavedJobAPI,
} from "../../../apis";
import {
  Card,
  Typography,
  Spin,
  Row,
  Col,
  Button,
  Divider,
  Tag,
  message,
} from "antd";
import {
  EnvironmentOutlined,
  DollarOutlined,
  FieldTimeOutlined,
  ApartmentOutlined,
  CalendarOutlined,
  LeftOutlined,
  CheckCircleTwoTone,
  BuildOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import ApplicationDialog from "./ApplicationDialog";
import "./JobDetailPage.css";

const { Title, Paragraph } = Typography;

const JobDetailPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoOk, setLogoOk] = useState(true);
  const [openApply, setOpenApply] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { isAuthorized } = useSelector((state) => state.user);

  // Lấy chi tiết job
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

  // Kiểm tra job đã được lưu hay chưa
  useEffect(() => {
    const checkSaved = async () => {
      if (!isAuthorized) return; // nếu chưa đăng nhập thì bỏ qua
      try {
        const saved = await checkSavedJobAPI(jobId);
        setIsSaved(saved);
      } catch (err) {
        console.warn("⚠️ Không thể kiểm tra trạng thái lưu:", err);
      }
    };
    checkSaved();
  }, [jobId, isAuthorized]);

  // Toggle lưu / bỏ lưu job
  const handleToggleSaveJob = async () => {
    if (!isAuthorized) {
      message.warning("Vui lòng đăng nhập để lưu công việc!");
      navigate("/login");
      return;
    }

    try {
      if (isSaved) {
        await unsaveJobAPI(job.id);
        setIsSaved(false);
        message.info("Đã bỏ lưu công việc!");
      } else {
        await saveJobAPI(job.id);
        setIsSaved(true);
        message.success("Đã lưu công việc!");
      }
    } catch (err) {
      console.error("❌ Lỗi khi lưu/bỏ lưu job:", err);
      message.error("Không thể thay đổi trạng thái lưu. Vui lòng thử lại!");
    }
  };

  //  Loading state
  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" tip="Đang tải chi tiết công việc..." />
      </div>
    );

  if (!job) return <div>Không tìm thấy công việc</div>;

  // 💵 Hiển thị lương
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

            {/* Required Skills */}
            {Array.isArray(job.requiredSkills) && job.requiredSkills.length > 0 && (
              <Card className="jd-card">
                <Title level={4} className="jd-section-title">
                  Kỹ năng yêu cầu
                </Title>
                <div className="jd-skill-tags">
                  {job.requiredSkills.map((skill) => (
                    <Tag
                      key={skill.id || skill.name}
                      color="blue"
                      className="skill-tag"
                    >
                      {skill.name}
                    </Tag>
                  ))}
                </div>
              </Card>
            )}

            {/* General info */}
            <Card className="jd-card">
              <Title level={4} className="jd-section-title">
                Thông tin chung
              </Title>
              <Paragraph className="jd-text">
                <EnvironmentOutlined /> <b>Địa điểm:</b>{" "}
                {job.address || "Không xác định"}
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
                <Button
                  size="large"
                  className="jd-btn-primary"
                  block
                  onClick={() => setOpenApply(true)}
                >
                  Ứng tuyển ngay
                </Button>
                <Button
                  size="large"
                  block
                  type={isSaved ? "primary" : "default"}
                  onClick={handleToggleSaveJob}
                >
                  {isSaved ? "Đã lưu" : "Lưu tin"}
                </Button>
              </Card>

              {/* Company info */}
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

      <ApplicationDialog
        open={openApply}
        onClose={() => setOpenApply(false)}
        jobId={job.id}
        jobTitle={job.title}
        companyName={job.companyName}
        onSubmitted={() => {
        }}
      />
    </div>
  );
};

export default JobDetailPage;
