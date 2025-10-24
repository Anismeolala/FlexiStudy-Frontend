import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Tag,
  Button,
  Input,
  message,
  Spin,
  Modal,
  Select,
} from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  getApplicationsByJobAPI,
  getJobByIdAPI,
  updateApplicationStatusAPI,
} from "../../apis";
import "./ApplicationRecruiter.css";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

dayjs.extend(relativeTime);

const ApplicationRecruiter = () => {
  const { jobId } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchApplicants = async () => {
    try {
      setLoading(true);

      const [appsRes, jobRes] = await Promise.all([
        getApplicationsByJobAPI(jobId),
        getJobByIdAPI(jobId),
      ]);

      const apps = appsRes?.result || [];
      setJob(jobRes?.result || null);

      setCandidates(
        apps.map((a) => ({
          id: a.id,
          name: a.userFullName,
          email: a.email,
          phone: a.phone,
          status: a.status,
          cvUrl: a.cvUrl,
          coverLetter: a.coverLetter,
          appliedDate: dayjs(a.appliedAt).fromNow(),
        }))
      );
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch applicants");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedApp) return;

    try {
      setUpdating(true);

      await updateApplicationStatusAPI(selectedApp.id, newStatus);

      message.success("Application status updated!");

      setCandidates((prev) =>
        prev.map((c) =>
          c.id === selectedApp.id ? { ...c, status: newStatus } : c
        )
      );

      setIsModalOpen(false);
    } catch (err) {
      message.error("Failed to update status!");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "HIRED":
        return "green";
      case "INTERVIEW":
        return "gold";
      case "PENDING":
        return "processing";
      case "REJECTED":
        return "red";
      default:
        return "default";
    }
  };

  const openStatusModal = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  if (loading)
    return (
      <Spin
        size="large"
        style={{ marginTop: 100, display: "block", textAlign: "center" }}
      />
    );

  return (
    <div className="app-page">
      {/* Back Button */}
      <Button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ← Back to Jobs
      </Button>

      {job && (
        <Card className="job-info-card">
          <h2 className="job-title">{job.title}</h2>

          <div className="job-details">
            <span className="icon">
              <EnvironmentOutlined />
            </span>{" "}
            {job.city}
            <span className="divider">•</span>
            <span>{job.category || "Engineering"}</span>
            <span className="divider">•</span>
            <span>{job.type === "FULLTIME" ? "Full-time" : "Part-time"}</span>
            <span className="divider">•</span>
            <span className="salary">
              {job.minSalary?.toLocaleString()} -{" "}
              {job.maxSalary?.toLocaleString()} VND
            </span>
          </div>
        </Card>
      )}

      {/* Applicants section */}
      <h3 className="section-title">Applicants</h3>
      <p className="count">{candidates.length} candidates found</p>

      {/* Search + Filter */}
      <div className="filter-row">
        <Input.Search
          placeholder="Search by name or email..."
          style={{ maxWidth: 500 }}
        />
        <Select defaultValue="ALL" style={{ width: 150 }}>
          <Select.Option value="ALL">All Status</Select.Option>
          <Select.Option value="PENDING">Pending</Select.Option>
          <Select.Option value="HIRED">Hired</Select.Option>
          <Select.Option value="REJECTED">Rejected</Select.Option>
        </Select>
      </div>

      {/* Candidate Cards */}
      <div className="candidate-list">
        {candidates.map((item) => (
          <Card key={item.id} className="candidate-card">
            <div className="candidate-info-appli">
              <div className="left">
                <Avatar size={56} icon={<UserOutlined />} />
                <div>
                  <h4>{item.name}</h4>
                  <div className="contact">
                    <MailOutlined /> {item.email} • <PhoneOutlined />{" "}
                    {item.phone} • <ClockCircleOutlined /> {item.appliedDate}
                  </div>
                </div>
              </div>

              <div className="right">
                <Tag color={getStatusColor(item.status)}>{item.status}</Tag>

                <div className="btns">
                  <Button type="default" href={item.cvUrl} target="_blank">
                    View Profile
                  </Button>

                  <Button type="primary" onClick={() => openStatusModal(item)}>
                    Update Status
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
        <Modal
          title="Update Application Status"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <div className="status-btn-group">
            <Button
              block
              type="default"
              onClick={() => handleUpdateStatus("PENDING")}
            >
              Pending
            </Button>

            <Button
              block
              type="primary"
              onClick={() => handleUpdateStatus("HIRED")}
              loading={updating}
            >
              Hired ✅
            </Button>

            <Button
              block
              danger
              onClick={() => handleUpdateStatus("REJECTED")}
              loading={updating}
            >
              Rejected ❌
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ApplicationRecruiter;
