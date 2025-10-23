import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Badge, Spin, Tag, Tooltip } from "antd";
import {
  UserOutlined,
  ProfileOutlined,
  RiseOutlined,
  EditOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { getApplicationsForMyCompanyAPI, getJobsByCompanyAPI } from "../../apis";
import { useSelector } from "react-redux";
import "./RecruiterDashboard.css";

const RecruiterDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [jobs, setJobs] = useState([]);
  const companyId = useSelector((state) => state.user?.companyId);

  useEffect(() => {
    if (!companyId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [apps, jobsRes] = await Promise.all([
          getApplicationsForMyCompanyAPI(),
          getJobsByCompanyAPI(companyId),
        ]);

        const jobsData = jobsRes?.result || [];

        // --- Stats ---
        const totalApplicants = apps?.length || 0;
        const interviewCount = apps?.filter((a) => a.status === "INTERVIEW").length || 0;
        const activeJobs = jobsData?.filter((j) => j.status === "ACTIVE").length || 0;

        setStats([
          { label: "Active Jobs", value: activeJobs, trend: "+2 this week", icon: <ProfileOutlined /> },
          { label: "Total Applicants", value: totalApplicants, trend: "+34 this week", icon: <UserOutlined /> },
          { label: "Interviews Scheduled", value: interviewCount, trend: "+6 this week", icon: <RiseOutlined /> },
        ]);

        // --- Job cards ---
        const jobsWithApplicants = (jobsData || []).map((job) => {
          const safeSkills = Array.isArray(job.requiredSkills)
            ? job.requiredSkills.map((s) => s.name)
            : [];

          return {
            id: job.id,
            title: job.title || "Untitled",
            location: job.city || job.address || "N/A",
            department: job.category || "N/A",
            type: job.type || "Full-time",
            minSalary: job.minSalary || 0,
            maxSalary: job.maxSalary,
            currency: job.currency || "VND",
            skills: safeSkills,
            applicants: apps?.filter((a) => a.jobId === job.id)?.length || 0,
            posted: job.createdAt ? dayjs(job.createdAt).fromNow() : "N/A",
            status: job.status || "ACTIVE",
          };
        });

        setJobs(jobsWithApplicants);
      } catch (error) {
        console.error("Error fetching recruiter dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  if (loading) return <Spin size="large" className="loading-center" />;

  return (
    <div className="dashboard-container">
      {/* Stats Section */}
      <Row gutter={16} className="stats-row">
        {stats.map((stat, index) => (
          <Col xs={24} md={8} key={index}>
            <Card hoverable className="stat-card">
              <div className="stat-header">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-icon">{stat.icon}</span>
              </div>
              <h2 className="stat-value">{stat.value}</h2>
              <p className="stat-trend">{stat.trend}</p>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Jobs Section */}
      <div className="jobs-section">
        <div className="jobs-header">
          <h2>Active Job Posts</h2>
          <Button type="default">View All</Button>
        </div>

        {(jobs || []).map((job) => (
          <Card key={job.id} className="job-card" hoverable>
            {/* Header */}
            <div className="job-header">
              <div>
                <h3>{job.title}</h3>
                <p className="job-meta">
                  <EnvironmentOutlined /> {job.location} • {job.department} • {job.type}
                  {job.minSalary > 0 && (
                    <>
                      {" • "}
                      <DollarOutlined />{" "}
                      {job.minSalary.toLocaleString()} -{" "}
                      {job.maxSalary ? job.maxSalary.toLocaleString() : "?"} {job.currency}
                    </>
                  )}
                </p>
              </div>
              <Badge
                color={job.status === "ACTIVE" ? "green" : "gray"}
                text={job.status === "ACTIVE" ? "Active" : "Closed"}
              />
            </div>

            {/* Skills */}
            {job.skills.length > 0 && (
              <div style={{ marginTop: 8 }}>
                {job.skills.map((skill, index) => (
                  <Tag color="blue" key={index}>
                    {skill}
                  </Tag>
                ))}
              </div>
            )}

            {/* Footer */}
            <div
              className="job-footer"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <div
                className="job-details"
                style={{ display: "flex", gap: "16px", color: "#555" }}
              >
                <span>👥 {job.applicants} applicants</span>
                <span>
                  <ClockCircleOutlined /> Posted {job.posted}
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <Tooltip title="Edit this job">
                  <Button icon={<EditOutlined />} size="small">
                    Edit
                  </Button>
                </Tooltip>
                <Link to={`/jobs/${job.id}/applicants`}>
                  <Button size="small" type="primary">
                    View Applicants
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
