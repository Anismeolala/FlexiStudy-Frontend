import React, { useState } from "react";
import {
  Layout,
  InputNumber,
  Button,
  Card,
  Select,
  Pagination,
  Modal,
  message,
} from "antd";

const { Content, Sider } = Layout;
const { Option } = Select;

const mockJobs = [
  { id: 1, title: "Frontend Developer", company: "TechCorp", location: "HCM", salary: "15-20tr", description: "ReactJS, Ant Design, Redux" },
  { id: 2, title: "Backend Developer", company: "SoftInc", location: "HN", salary: "20-25tr", description: "NodeJS, Express, MongoDB" },
  { id: 3, title: "UI/UX Designer", company: "Creative Studio", location: "Remote", salary: "12-18tr", description: "Figma, Photoshop" },
  { id: 4, title: "DevOps Engineer", company: "CloudNet", location: "HCM", salary: "25-30tr", description: "AWS, Docker, Kubernetes" },
  { id: 5, title: "Mobile Developer", company: "AppWorks", location: "HN", salary: "18-22tr", description: "React Native, iOS/Android" },
  { id: 6, title: "Project Manager", company: "BizSoft", location: "HCM", salary: "30-35tr", description: "Agile/Scrum, Team management" },
  { id: 7, title: "Data Scientist", company: "AI Lab", location: "HN", salary: "28-40tr", description: "Python, ML, TensorFlow" },
  { id: 8, title: "QA Engineer", company: "QualityPro", location: "Remote", salary: "12-16tr", description: "Automation Testing, Selenium" },
  { id: 9, title: "System Admin", company: "NetWorld", location: "HCM", salary: "18-25tr", description: "Linux, Networking" },
  { id: 10, title: "Content Writer", company: "MediaHouse", location: "HN", salary: "10-15tr", description: "SEO, Copywriting" },
];

const JobSearchPage = () => {
  const [savedJobs, setSavedJobs] = useState(() => JSON.parse(localStorage.getItem("savedJobs")) || []);
  const [appliedJobs, setAppliedJobs] = useState(() => JSON.parse(localStorage.getItem("appliedJobs")) || []);
  const [selectedJob, setSelectedJob] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const toggleSaveJob = (job) => {
    let updated;
    if (savedJobs.some((j) => j.id === job.id)) {
      updated = savedJobs.filter((j) => j.id !== job.id);
      message.info("Đã bỏ lưu công việc");
    } else {
      updated = [...savedJobs, job];
      message.success("Đã lưu công việc");
    }
    setSavedJobs(updated);
    localStorage.setItem("savedJobs", JSON.stringify(updated));
  };

  const handleApply = (job) => {
    if (appliedJobs.some((j) => j.id === job.id)) {
      message.warning("Bạn đã ứng tuyển công việc này rồi");
      return;
    }
    const updated = [...appliedJobs, job];
    setAppliedJobs(updated);
    localStorage.setItem("appliedJobs", JSON.stringify(updated));
    message.success("Ứng tuyển thành công!");
    setSelectedJob(null);
  };

  // job theo trang
  const start = (currentPage - 1) * pageSize;
  const paginatedJobs = mockJobs.slice(start, start + pageSize);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar bộ lọc */}
      <Sider width={250} style={{ background: "#fff", padding: 20, overflowY: "auto" }}>
        <h3>Bộ lọc</h3>

        {/* Theo danh mục nghề */}
        <div style={{ marginBottom: 20 }}>
          <p><b>Theo danh mục nghề</b></p>
          <div><input type="checkbox" /> Marketing</div>
          <div><input type="checkbox" /> Quảng cáo / Sáng tạo</div>
          <div><input type="checkbox" /> Marketing / PR / Content</div>
          <div><input type="checkbox" /> Sales dịch vụ Quảng cáo / Truyền thông</div>
          <div><input type="checkbox" /> Kinh doanh / Bán hàng khác</div>
        </div>

        {/* Theo lịch rảnh */}
        <div style={{ marginBottom: 20 }}>
          <p><b>Theo lịch rảnh</b></p>
          <div><input type="checkbox" /> Thứ 2</div>
          <div><input type="checkbox" /> Thứ 3</div>
          <div><input type="checkbox" /> Thứ 4</div>
          <div><input type="checkbox" /> Thứ 5</div>
          <div><input type="checkbox" /> Thứ 6</div>
          <div><input type="checkbox" /> Thứ 7</div>
          <div><input type="checkbox" /> Chủ nhật</div>
        </div>

        {/* Theo kinh nghiệm */}
        <div style={{ marginBottom: 20 }}>
          <p><b>Theo kinh nghiệm</b></p>
          <div><input type="checkbox" /> Không yêu cầu</div>
          <div><input type="checkbox" /> Dưới 1 năm</div>
          <div><input type="checkbox" /> 1 - 2 năm</div>
          <div><input type="checkbox" /> 3 - 5 năm</div>
          <div><input type="checkbox" /> Trên 5 năm</div>
        </div>

        {/* Theo địa điểm */}
        <div style={{ marginBottom: 20 }}>
          <p><b>Theo địa điểm</b></p>
          <Select style={{ width: "100%" }} placeholder="Chọn địa điểm">
            <Option value="HCM">Hồ Chí Minh</Option>
            <Option value="HN">Hà Nội</Option>
            <Option value="BienHoa">Biên Hòa</Option>
            <Option value="CanTho">Cần Thơ</Option>
            <Option value="BinhDuong">Bình Dương</Option>
          </Select>
        </div>

        {/* Mức lương */}
        <div style={{ marginBottom: 20 }}>
          <p><b>Mức lương mong muốn</b></p>
          <InputNumber
            style={{ width: "45%", marginRight: "10%" }}
            placeholder="Min"
            min={0}
          />
          <InputNumber
            style={{ width: "45%" }}
            placeholder="Max"
            min={0}
          />
        </div>

        <Button type="primary" style={{ width: "100%" }}>
          Tìm kiếm
        </Button>
        <Button style={{ width: "100%", marginTop: 10 }}>
          Xóa lọc
        </Button>
      </Sider>

      {/* Content danh sách job */}
      <Layout>
        <Content style={{ padding: 20 }}>
          <h2>Danh sách việc làm</h2>
          {paginatedJobs.map((job) => (
            <Card
              key={job.id}
              style={{ marginBottom: 16 }}
              title={job.title}
              onClick={() => setSelectedJob(job)}
              hoverable
            >
              <p><b>Công ty:</b> {job.company}</p>
              <p><b>Địa điểm:</b> {job.location}</p>
              <p><b>Lương:</b> {job.salary}</p>
            </Card>
          ))}

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={mockJobs.length}
            onChange={(page) => setCurrentPage(page)}
            style={{ marginTop: 20, textAlign: "center" }}
          />
        </Content>
      </Layout>

      {/* Modal chi tiết job */}
      <Modal
        open={!!selectedJob}
        title={selectedJob?.title}
        onCancel={() => setSelectedJob(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedJob(null)}>Đóng</Button>,
          <Button
            key="favorite"
            onClick={() => toggleSaveJob(selectedJob)}
          >
            {savedJobs.some((j) => j.id === selectedJob?.id)
              ? "Bỏ yêu thích"
              : "Thêm vào yêu thích"}
          </Button>,
          <Button key="apply" type="primary" onClick={() => handleApply(selectedJob)}>Ứng tuyển</Button>,
        ]}
      >
        <p><b>Công ty:</b> {selectedJob?.company}</p>
        <p><b>Địa điểm:</b> {selectedJob?.location}</p>
        <p><b>Lương:</b> {selectedJob?.salary}</p>
        <p>{selectedJob?.description}</p>
      </Modal>
    </Layout>
  );
};

export default JobSearchPage;
