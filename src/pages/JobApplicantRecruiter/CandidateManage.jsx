import React, { useEffect, useState } from "react";
import { Card, Input, Button, Avatar, Badge, Spin, message, Modal } from "antd";
import {
  SearchOutlined,
  EnvironmentOutlined,
  StarFilled,
} from "@ant-design/icons";
import { IoBagOutline } from "react-icons/io5";
import { FaGraduationCap } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./CandidateManage.css";
import {
  getApplicationsForMyCompanyAPI,
  updateApplicationStatusAPI,
} from "../../apis";

const CandidateManage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [filterText, setFilterText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    try {
      const res = await getApplicationsForMyCompanyAPI();
      const apps = res || [];

      console.log(res);

      const mapped = apps.map((app) => ({
        id: app.id,
        name: app.fullName,
        email: app.email,
        phone: app.phone,
        appliedFor: app.jobTitle,
        location: app.city,
        jobType: app.type,
        status: app.status?.toLowerCase() || "review",
        appliedDate: app.appliedAt
          ? new Date(app.appliedAt).toLocaleDateString()
          : "N/A",
        cvUrl: app.cvUrl,
        coverLetter: app.coverLetter,
        matchScore: Math.floor(Math.random() * 21) + 80, // random 80-100
      }));

      setCandidates(mapped);
    } catch (err) {
      console.error(err);
      message.error("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "HIRED":
        return "green";
      case "INTERVIEW":
        return "orange";
      case "REJECTED":
        return "red";
      case "PENDING":
        return "purple";
      default:
        return "default";
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
      console.error(err);
      message.error("Failed to update status!");
    } finally {
      setUpdating(false);
    }
  };

  const openStatusModal = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const filtered = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.appliedFor.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Spin size="large" style={{ marginTop: 40 }} />;

  return (
    <div className="candidates-page">
      {/* Header */}
      <div className="candidates-header">
        <div>
          <h1>Candidate Pipeline</h1>
          <p>Review and manage applications</p>
        </div>
      </div>

      {/* Search */}
      <div className="candidates-toolbar">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search candidates..."
          size="large"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="candidates-list">
        {filtered.map((c) => (
          <Card key={c.id} className="candidate-card" hoverable>
            <div className="candidate-content">
              <Avatar size={64} style={{ backgroundColor: "#1677ff" }}>
                {c.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>

              <div className="candidate-info">
                <div className="candidate-header">
                  <div>
                    <h3>{c.name}</h3>
                    <p className="candidate-email">{c.email}</p>
                  </div>

                  <div className="candidate-status">
                    <div className="match-score">
                      <StarFilled className="star-icon" />
                      <span>{c.matchScore}%</span>
                    </div>
                    <Badge
                      color={getStatusColor(c.status)}
                      text={c.status.toUpperCase()}
                    />
                  </div>
                </div>

                <div className="candidate-role">
                  <IoBagOutline />
                  <span>Applied for: {c.appliedFor}</span>
                </div>

                <div className="candidate-meta">
                  <span>
                    <EnvironmentOutlined /> {c.location}
                  </span>
                  <span>• {c.jobType}</span>
                  <span>
                    • <FaGraduationCap /> Updating
                  </span>
                </div>

                <div className="candidate-footer">
                  <span className="applied-date">Applied: {c.appliedDate}</span>

                  <div className="footer-buttons">
                    <a href={c.cvUrl} target="_blank" rel="noopener noreferrer">
                      <Button>View CV</Button>
                    </a>
                    <Button type="primary" onClick={() => openStatusModal(c)}>
                      Update Status
                    </Button>
                  </div>
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
            style={{ marginTop: 10 }}
          >
            Hired ✅
          </Button>

          <Button
            block
            danger
            onClick={() => handleUpdateStatus("REJECTED")}
            loading={updating}
            style={{ marginTop: 10 }}
          >
            Rejected ❌
          </Button>
        </Modal>
      </div>
    </div>
  );
};

export default CandidateManage;
