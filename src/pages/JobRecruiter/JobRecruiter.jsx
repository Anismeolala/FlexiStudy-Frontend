import React from "react";
import { Card, Input, Button, Badge } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  UserOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./JobRecruiter.css";

const JobRecruiter = () => {
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Ho Chi Minh City",
      type: "Full-time",
      salary: "$2000-3000",
      applicants: 24,
      status: "active",
      posted: "2 days ago",
      skills: ["React", "TypeScript", "Tailwind CSS"],
    },
    {
      id: 2,
      title: "Product Designer",
      department: "Design",
      location: "Hanoi",
      type: "Full-time",
      salary: "$1800-2500",
      applicants: 18,
      status: "active",
      posted: "1 week ago",
      skills: ["Figma", "UI/UX", "Design Systems"],
    },
    {
      id: 3,
      title: "Marketing Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      salary: "$2500-3500",
      applicants: 32,
      status: "active",
      posted: "3 days ago",
      skills: ["SEO", "Content Strategy", "Analytics"],
    },
    {
      id: 4,
      title: "Backend Engineer",
      department: "Engineering",
      location: "Da Nang",
      type: "Full-time",
      salary: "$2200-3200",
      applicants: 15,
      status: "paused",
      posted: "2 weeks ago",
      skills: ["Node.js", "PostgreSQL", "API Design"],
    },
  ];

  return (
    <div className="job-page">
      {/* Header */}
      <div className="job-header">
        <div>
          <h1>Job Management</h1>
          <p>Create and manage your job postings</p>
        </div>
        <Link to="/recruiter/jobs/new">
          <Button type="primary" icon={<PlusOutlined />}>
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="job-search">
        <Input
          size="large"
          prefix={<SearchOutlined />}
          placeholder="Search jobs by title, department, or location..."
        />
      </div>

      {/* Job List */}
      <div className="job-list">
        {jobs.map((job) => (
          <Card key={job.id} className="job-card" hoverable>
            <div className="job-card-header">
              <div>
                <h3>{job.title}</h3>
                <p className="job-meta">
                  <EnvironmentOutlined /> {job.location} • {job.department} • {job.type} •{" "}
                  <span className="salary">{job.salary}</span>
                </p>
                <div className="job-skills">
                  {job.skills.map((skill) => (
                    <Badge key={skill} count={skill} className="skill-badge" />
                  ))}
                </div>
              </div>
              <Badge
                status={job.status === "active" ? "success" : "warning"}
                text={job.status === "active" ? "Active" : "Paused"}
                className="status-badge"
              />
            </div>

            <div className="job-card-footer">
              <div className="job-info-recruiter">
                <span>
                  <UserOutlined /> {job.applicants} applicants
                </span>
                <span>
                  <ClockCircleOutlined /> Posted {job.posted}
                </span>
              </div>
              <div className="job-actions">
                <Link to={`/jobs/${job.id}/edit`}>
                  <Button icon={<EditOutlined />} size="small">
                    Edit
                  </Button>
                </Link>
                <Link to={`/jobs/${job.id}/candidates`}>
                  <Button type="primary" size="small">
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

export default JobRecruiter;
