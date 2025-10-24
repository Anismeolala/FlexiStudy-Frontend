import React, { useEffect, useState } from "react";
import { Card, Input, Button, Badge, Spin, Tag, Tooltip, message } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./JobRecruiter.css";
import {
  getApplicationsForMyCompanyAPI,
  getJobsByCompanyAPI,
  getJobByIdAPI,
} from "../../apis";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import JobEditModal from "../../components/JobEditModal/JobEditModal";
import { FiUsers } from "react-icons/fi";

const JobRecruiter = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const companyId = useSelector((state) => state.user?.companyId);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const [apps, jobsRes] = await Promise.all([
        getApplicationsForMyCompanyAPI(),
        getJobsByCompanyAPI(companyId),
      ]);

      const jobsData = (jobsRes?.result || []).map((job) => ({
        id: job.id,
        title: job.title,
        department: job.category,
        location: job.city || job.address,
        type: job.type,
        minSalary: job.minSalary,
        maxSalary: job.maxSalary,
        currency: job.currency,
        status: job.status,
        posted: dayjs(job.postedAt).fromNow(),
        applicants: apps.filter((a) => a.jobId === job.id).length,
        skills: job.requiredSkills?.map((s) => s.name) || [],
      }));

      setJobs(jobsData);
    } catch (err) {
      message.error("Failed to load job list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) fetchJobs();
  }, [companyId]);

  const openEditModal = async (job) => {
    try {
      const res = await getJobByIdAPI(job.id);
      setSelectedJob(res?.result);
      setEditModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdated = () => {
    setEditModalOpen(false);
    fetchJobs(); // ✅ Load lại danh sách
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
    );

  return (
    <div className="job-page">
      {/* Header */}
      <div className="job-header">
        <div>
          <h1>Job Management</h1>
          <p>Create and manage your job postings</p>
        </div>
        <Link to="/recruiter/jobs/new">
          <Button type="primary">Post New Job</Button>
        </Link>
      </div>

      {/* Search */}
      <div className="job-search">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search jobs by name, location or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="large"
        />
      </div>

      {/* Job List */}
      <div className="job-list">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="job-card" hoverable>
            <div className="job-header">
              <div>
                <h3>{job.title}</h3>
                <p className="job-meta">
                  <EnvironmentOutlined /> {job.location} • {job.department} •{" "}
                  {job.type}
                </p>

                {Array.isArray(job.skills) && job.skills.length > 0 && (
                  <div style={{ marginTop: 6 }}>
                    {job.skills.map((skill, index) => (
                      <Tag key={index} color="blue">
                        {skill}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>

              <Badge
                color={
                  job.status === "OPEN"
                    ? "blue"
                    : job.status === "CLOSED"
                    ? "gray"
                    : "red"
                }
                text={
                  job.status === "OPEN"
                    ? "Open"
                    : job.status === "CLOSED"
                    ? "Closed"
                    : "Inactive"
                }
              />
            </div>

            {/* Footer */}
            <div className="job-card-footer">
              <div style={{ display: "flex", gap: "18px" }}>
                <span>
                  {" "}
                  <FiUsers /> {job.applicants} applicants
                </span>
                <span>
                  <ClockCircleOutlined /> {job.posted}
                </span>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <Tooltip title="Edit job">
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => openEditModal(job)}
                  />
                </Tooltip>

                <Link to={`/recruiter/jobs/${job.id}/applicants`}>
                  <Button type="primary">View Applicants</Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Shared Modal */}
      <JobEditModal
        visible={editModalOpen}
        job={selectedJob}
        onClose={() => setEditModalOpen(false)}
        onSaved={handleUpdated}
      />
    </div>
  );
};

export default JobRecruiter;
