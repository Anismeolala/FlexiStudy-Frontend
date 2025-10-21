import React, { useState } from "react";
import { Card, Modal, Button, Pagination } from "antd";

const AppliedJobs = () => {
  const [appliedJobs] = useState(() => JSON.parse(localStorage.getItem("appliedJobs")) || []);
  const [selectedJob, setSelectedJob] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const start = (currentPage - 1) * pageSize;
  const paginatedJobs = appliedJobs.slice(start, start + pageSize);

  return (
    <div style={{ padding: 20 }}>
      <h2>Việc làm đã ứng tuyển</h2>
      {paginatedJobs.map((job) => (
        <Card key={job.id} title={job.title} hoverable style={{ marginBottom: 16 }} onClick={() => setSelectedJob(job)}>
          <p><b>Công ty:</b> {job.company}</p>
          <p><b>Địa điểm:</b> {job.location}</p>
        </Card>
      ))}

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={appliedJobs.length}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: 20, textAlign: "center" }}
      />

      <Modal
        open={!!selectedJob}
        title={selectedJob?.title}
        onCancel={() => setSelectedJob(null)}
        footer={[<Button key="close" onClick={() => setSelectedJob(null)}>Đóng</Button>]}
      >
        <p><b>Công ty:</b> {selectedJob?.company}</p>
        <p><b>Địa điểm:</b> {selectedJob?.location}</p>
        <p><b>Lương:</b> {selectedJob?.salary}</p>
        <p>{selectedJob?.description}</p>
      </Modal>
    </div>
  );
};

export default AppliedJobs;
