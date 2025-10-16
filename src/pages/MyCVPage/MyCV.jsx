import React, { useState } from "react";
import { Layout, Tabs, Card, Typography, Button, Upload, message } from "antd";
import {
  UploadOutlined,
  FileTextOutlined,
  EyeOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./MyCV.css";

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const MyCV = () => {
  const [uploadedCVs, setUploadedCVs] = useState([
    { id: "1", name: "CV_NguyenVanA_2024.pdf", uploadDate: "2024-01-15", size: "245 KB" },
  ]);

  const beforeUpload = (file) => {
    const isAllowed =
      file.type === "application/pdf" ||
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (!isAllowed) {
      message.error("Chỉ hỗ trợ định dạng PDF, DOC, DOCX!");
      return Upload.LIST_IGNORE;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error("File không được vượt quá 5MB!");
      return Upload.LIST_IGNORE;
    }
    const newCV = {
      id: Date.now().toString(),
      name: file.name,
      uploadDate: new Date().toISOString().split("T")[0],
      size: `${(file.size / 1024).toFixed(0)} KB`,
    };
    setUploadedCVs((prev) => [...prev, newCV]);
    message.success("CV đã được tải lên!");
    return Upload.LIST_IGNORE;
  };

  const handleDeleteCV = (id) => {
    setUploadedCVs((prev) => prev.filter((cv) => cv.id !== id));
    message.success("Đã xóa CV!");
  };

  return (
    <Layout className="cv-layout">
      <Content className="cv-content">
        <div className="cv-header">
          <Title level={2} className="cv-title">CV của tôi</Title>
          <Text type="secondary" className="cv-subtitle">
            Quản lý CV và tải mẫu CV chuyên nghiệp
          </Text>
        </div>

        <Tabs defaultActiveKey="upload" centered className="cv-tabs">
          {/* ============ TAB 1: UPLOAD CV ============ */}
          <TabPane tab={`Tải CV lên`} key="upload">
            <Card className="cv-card">
              <Title level={4} className="cv-card-title">Tải CV lên</Title>
              <Text type="secondary">
                Tải lên CV của bạn để sẵn sàng ứng tuyển ngay. Hỗ trợ định dạng PDF, DOC, DOCX (tối đa 5MB)
              </Text>

              <Upload.Dragger
                multiple={false}
                showUploadList={false}
                beforeUpload={beforeUpload}
                accept=".pdf,.doc,.docx"
                className="cv-dragger"
              >
                <UploadOutlined className="cv-upload-icon" />
                <p className="cv-dragger-text">Kéo thả file hoặc click để chọn</p>
                <Button type="default" className="cv-btn">Chọn file</Button>
              </Upload.Dragger>

              <div className="cv-note">
                <p>• Định dạng: PDF, DOC, DOCX</p>
                <p>• Kích thước tối đa: 5MB</p>
                <p>• Đặt tên file rõ ràng, ví dụ: CV_HoTen_ViTri.pdf</p>
              </div>
            </Card>
          </TabPane>

          {/* ============ TAB 2: MY CVS ============ */}
          <TabPane tab={`CV của tôi (${uploadedCVs.length})`} key="my-cvs">
            {uploadedCVs.length === 0 ? (
              <Card className="cv-empty">
                <div className="cv-empty-inner">
                  <FileTextOutlined className="cv-empty-icon" />
                  <Text type="secondary">Chưa có CV nào được tải lên</Text>
                </div>
              </Card>
            ) : (
              uploadedCVs.map((cv) => (
                <Card key={cv.id} className="cv-item">
                  <div className="cv-item-left">
                    <div className="cv-icon-wrap">
                      <FileTextOutlined className="cv-icon" />
                    </div>
                    <div>
                      <div className="cv-name">{cv.name}</div>
                      <div className="cv-meta">
                        Tải lên: {new Date(cv.uploadDate).toLocaleDateString("vi-VN")} • {cv.size}
                      </div>
                    </div>
                  </div>
                  <div className="cv-item-right">
                    <Button size="small" icon={<EyeOutlined />}>Xem</Button>
                    <Button size="small" icon={<DownloadOutlined />}>Tải về</Button>
                    <Button
                      size="small"
                      type="text"
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => handleDeleteCV(cv.id)}
                    />
                  </div>
                </Card>
              ))
            )}
          </TabPane>

          {/* ============ TAB 3: TEMPLATES (DẪN RIÊNG) ============ */}
          <TabPane tab={`Mẫu CV (6)`} key="templates">
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Text type="secondary">Trang Mẫu CV đang được phát triển...</Text>
            </div>
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default MyCV;
