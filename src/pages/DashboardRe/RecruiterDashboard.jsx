import React from "react";
import { Card, Row, Col, Button, Badge } from "antd";
import { UserOutlined, ProfileOutlined, RiseOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./RecruiterDashboard.css";

const RecruiterDashboard = () => {
  const stats = [
    { label: "Active Jobs", value: 12, trend: "+2 this week", icon: <ProfileOutlined /> },
    { label: "Total Applicants", value: 248, trend: "+34 this week", icon: <UserOutlined /> },
    { label: "Interviews Scheduled", value: 18, trend: "+6 this week", icon: <RiseOutlined /> },
  ];

  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Ho Chi Minh City",
      type: "Full-time",
      applicants: 24,
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "Product Designer",
      department: "Design",
      location: "Hanoi",
      type: "Full-time",
      applicants: 18,
      posted: "1 week ago",
    },
    {
      id: 3,
      title: "Marketing Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      applicants: 32,
      posted: "3 days ago",
    },
  ];

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

        {jobs.map((job) => (
          <Card key={job.id} className="job-card" hoverable>
            <div className="job-header">
              <div>
                <h3>{job.title}</h3>
                <p className="job-meta">
                  {job.department} • {job.location} • {job.type}
                </p>
              </div>
              <Badge color="green" text="Active" />
            </div>
            <div className="job-footer">
              <div className="job-details">
                <span>👥 {job.applicants} applicants</span>
                <span>Posted {job.posted}</span>
              </div>
              <Link to={`/jobs/${job.id}/applicants`}>
                <Button size="small">View Applicants</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
