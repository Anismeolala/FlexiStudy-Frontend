import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  Space,
} from "antd";
import {
  EnvironmentOutlined,
  DollarOutlined,
  FieldTimeOutlined,
  ApartmentOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const JobDetailPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await getJobByIdAPI(jobId);
        setJob(res.result);
        console.log("Chi tiết job:", res.result);
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
        )} ${job.currency}`
      : "Thoả thuận";

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN");
  };

  return (
    <div style={{ padding: "40px 80px", backgroundColor: "#fafafa" }}>
      <Row gutter={32}>
        {/* =============== Cột trái =============== */}
        <Col xs={24} md={16}>
          <Card bordered={false} style={{ borderRadius: 8, padding: "24px 32px" }}>
            {/* --- Header job --- */}
            <Title level={3} style={{ marginBottom: 0 }}>
              {job.title}
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              {job.companyName}
            </Text>

            <Divider />

            {/* --- Tag thông tin nhanh --- */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col>
                <Tag color="blue">
                  <DollarOutlined /> {salaryText}
                </Tag>
              </Col>
              <Col>
                <Tag color="green">
                  <EnvironmentOutlined /> {job.city || "Không rõ"}
                </Tag>
              </Col>
              <Col>
                <Tag color="orange">
                  <ApartmentOutlined /> {job.mode}
                </Tag>
              </Col>
              <Col>
                <Tag color="purple">
                  <FieldTimeOutlined /> {job.type}
                </Tag>
              </Col>
            </Row>

            {/* =============== I. Mô tả công việc =============== */}
            {job.description && (
              <>
                <Divider />
                <Title level={4}>I. Mô tả công việc</Title>
                <Paragraph style={{ whiteSpace: "pre-line" }}>
                  {job.description}
                </Paragraph>
              </>
            )}

            {/* =============== II. Yêu cầu ứng viên =============== */}
            {job.requirements && (
              <>
                <Divider />
                <Title level={4}>II. Yêu cầu ứng viên</Title>
                <Paragraph style={{ whiteSpace: "pre-line" }}>
                  {job.requirements}
                </Paragraph>
              </>
            )}

            {/* =============== III. Quyền lợi =============== */}
            {job.benefits && (
              <>
                <Divider />
                <Title level={4}>III. Quyền lợi</Title>
                <Paragraph style={{ whiteSpace: "pre-line" }}>
                  {job.benefits}
                </Paragraph>
              </>
            )}

            {/* =============== IV. Thông tin chung =============== */}
            <Divider />
            <Title level={4}>IV. Thông tin chung</Title>
            <Paragraph>
              <EnvironmentOutlined /> <b>Địa điểm làm việc:</b>{" "}
              {job.address || "Không xác định"}
            </Paragraph>
            <Paragraph>
              <CalendarOutlined /> <b>Hạn nộp hồ sơ:</b>{" "}
              {job.expiryDate ? formatDate(job.expiryDate) : "Không rõ"}
            </Paragraph>

            {/* =============== Kỹ năng yêu cầu =============== */}
            {job.requiredSkills?.length > 0 && (
              <>
                <Divider />
                <Title level={4}>V. Kỹ năng yêu cầu</Title>
                <Space wrap>
                  {job.requiredSkills.map((s, i) => (
                    <Tag key={i} color="geekblue">
                      {s.name}
                    </Tag>
                  ))}
                </Space>
              </>
            )}

            <Divider />
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Button type="primary" size="large">
                Ứng tuyển ngay
              </Button>
              <Button
                style={{ marginLeft: 12 }}
                size="large"
                ghost
                type="default"
              >
                Lưu công việc
              </Button>
            </div>
          </Card>
        </Col>

        {/* =============== Cột phải =============== */}
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{ textAlign: "center", borderRadius: 8, padding: "24px 16px" }}
          >
            <img
              src={job.companyLogoUrl || "/default-company.png"}
              alt={job.companyName}
              style={{
                maxHeight: 80,
                objectFit: "contain",
                marginBottom: 12,
              }}
            />
            <Title level={4}>{job.companyName}</Title>
            <Text>{job.city}</Text>
            <Divider />
            <Paragraph>
              Công ty cung cấp môi trường làm việc năng động, chuyên nghiệp và
              tạo điều kiện phát triển nghề nghiệp cho sinh viên.
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default JobDetailPage;
