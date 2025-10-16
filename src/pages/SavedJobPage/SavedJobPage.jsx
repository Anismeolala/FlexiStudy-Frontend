import React, { useState, useEffect } from "react";
import { Tabs, Card, Button, Tag, Empty, message, Spin } from "antd";
import { EnvironmentOutlined, ClockCircleOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { getSavedJobsAPI, unsaveJobAPI } from "../../apis/index";
import { getApplicationsByUserAPI } from "../../apis/index";
import { useSelector } from "react-redux";
import "./SavedJobPage.css";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

export default function SavedJobPage() {
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const { id: userId } = useSelector((state) => state.user);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const saved = await getSavedJobsAPI();
        setSavedJobs(saved || []);
        console.log("Đã lưu:", saved);

        if (userId) {
          const applied = await getApplicationsByUserAPI(userId);
          console.log("Ứng tuyển:", applied);
          const normalizedApplied = (applied || []).map((app) => ({
            id: app.jobId,
            title: app.jobTitle,
            companyName: app.companyName,
            companyLogoUrl: app.jobLogoUrl,
            city: app.city,
            postedAt: app.postedAt,
            appliedAt: app.appliedAt,
            status: app.status,
            type: app.type,
            minSalary: app.minSalary,
            maxSalary: app.maxSalary
          }));
          setAppliedJobs(normalizedApplied);
        }
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleUnsave = async (jobId) => {
    try {
      await unsaveJobAPI(jobId);
      setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
      message.success("Đã bỏ lưu công việc!");
    } catch (err) {
      console.error("❌ Lỗi bỏ lưu:", err);
      message.error("Không thể bỏ lưu công việc!");
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    const diff = Math.ceil((now - d) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Hôm nay";
    if (diff === 1) return "Hôm qua";
    return `${diff} ngày trước`;
  };

  const renderJobCard = (job, showUnsave = false) => (
    <Card key={job.id} className="saved-job-card">
      <div className="job-card-content">
        <div className="job-logo">
          {job.companyLogoUrl ? (
            <img src={job.companyLogoUrl} alt={job.companyName} />
          ) : (
            <div className="job-logo-fallback">
              {job.companyName?.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <div className="job-info">
          <h3 className="job-title">{job.title}</h3>
          <p className="job-company">{job.companyName}</p>
          <div className="job-tags">
            <Tag color="blue">{job.type || "Không rõ"}</Tag>
            <Tag>
              {job.minSalary
                ? `${job.minSalary.toLocaleString("vi-VN")} - ${job.maxSalary?.toLocaleString("vi-VN") || "?"} ${job.currency || "VND"}`
                : "Thoả thuận"}
            </Tag>
            <span className="job-date">
              <ClockCircleOutlined /> {formatDate(job.postedAt)}
            </span>
          </div>
          <p className="job-location">
            <EnvironmentOutlined /> {job.city || "Toàn quốc"}
          </p>
        </div>

        <div className="job-actions">
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/jobs/${job.id}`)}
            target="_blank"
          />
          {showUnsave && (
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleUnsave(job.id)}
            />
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="saved-page">
      <div className="saved-container">
        <h1 className="page-title">Việc làm của tôi</h1>
        <p className="page-subtitle">
          Quản lý các công việc đã lưu và đã ứng tuyển
        </p>

        <Tabs defaultActiveKey="1" className="saved-tabs">
          <TabPane tab={`Đã lưu (${savedJobs.length})`} key="1">
            {loading ? (
              <div className="center"><Spin /></div>
            ) : savedJobs.length === 0 ? (
              <Empty description="Chưa có công việc nào" />
            ) : (
              <div className="job-list">
                {savedJobs.map((job) => renderJobCard(job, true))}
              </div>
            )}
          </TabPane>

          <TabPane tab={`Đã ứng tuyển (${appliedJobs.length})`} key="2">
            {loading ? (
              <div className="center"><Spin /></div>
            ) : appliedJobs.length === 0 ? (
              <Empty description="Chưa có công việc nào" />
            ) : (
              <div className="job-list">
                {appliedJobs.map((app) =>
                  renderJobCard(app.job || app, false)
                )}
              </div>
            )}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}
