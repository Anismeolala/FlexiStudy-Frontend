import React, { useEffect, useState } from "react";
import { Card, Input, Button, Badge, Spin, message } from "antd";
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
import { getJobsByCompanyAPI } from "../../apis"; 
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const JobRecruiter = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const companyId = useSelector((state) => state.user?.companyId);

  useEffect(() => {
    if (!companyId) return;

    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await getJobsByCompanyAPI(companyId);

        // Chuẩn hóa dữ liệu job để khớp UI sẵn có
        const jobsData = (res?.result || []).map((job) => ({
          id: job.id,
          title: job.title || "Untitled",
          department: job.category || "N/A",
          location: job.city || job.address || "N/A",
          type: job.type || "Full-time",
          salary:
            job.minSalary && job.maxSalary
              ? `${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()} ${job.currency || "VND"}`
              : "Negotiable",
          applicants: job.applicantCount || 0,
          status: job.status?.toLowerCase() || "active",
          posted: job.createdAt ? dayjs(job.createdAt).fromNow() : "N/A",
          skills: job.requiredSkills?.map((s) => s.name) || [],
        }));

        setJobs(jobsData);
      } catch (err) {
        console.error(err);
        message.error("Failed to load job list");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [companyId]);

  // Lọc theo từ khóa tìm kiếm
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return <Spin size="large" style={{ display: "block", margin: "40px auto" }} />;

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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Job List */}
      <div className="job-list">
        {filteredJobs.map((job) => (
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
