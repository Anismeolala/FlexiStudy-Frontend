import React, { useEffect, useState } from "react";
import { Tabs, Card, Button, Upload, message, Typography, Tag, Spin } from "antd";
import {
  UploadOutlined,
  FileTextOutlined,
  EyeOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  uploadforMyCVAPI,
  getUserCvsAPI,
  deleteCvAPI,
} from "../../apis";
import "./MyCV.css";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const cvTemplates = [
  {
    id: "1",
    name: "CV Chuyên nghiệp",
    description: "Mẫu CV đơn giản, chuyên nghiệp phù hợp cho mọi ngành nghề",
    category: "Chuyên nghiệp",
    thumbnail:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&q=80",
  },
  {
    id: "2",
    name: "CV Sáng tạo",
    description: "Thiết kế độc đáo cho các vị trí creative và design",
    category: "Sáng tạo",
    thumbnail:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&q=80",
  },
  {
    id: "3",
    name: "CV IT Developer",
    description: "Mẫu CV tối ưu cho lập trình viên và kỹ sư phần mềm",
    category: "Công nghệ",
    thumbnail:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&q=80",
  },
];

const MyCV = () => {
  const [uploadedCVs, setUploadedCVs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  

  const fetchUserCvs = async () => {
    try {
      setLoading(true);
      const res = await getUserCvsAPI();
      if (res.code === 1000 && Array.isArray(res.result)) {
        setUploadedCVs(res.result);
      } else {
        message.warning("Không có dữ liệu CV.");
      }
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tải danh sách CV!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCvs();
  }, []);

  const beforeUpload = async (file) => {
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

    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      const res = await uploadforMyCVAPI(formData);
      if (res.code === 1000) {
        message.success(res.message || "Tải CV lên thành công!");
        fetchUserCvs();
      } else {
        message.error(res.message || "Không thể tải lên CV!");
      }
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tải lên CV!");
    } finally {
      setLoading(false);
    }

    return Upload.LIST_IGNORE;
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await deleteCvAPI(id);
      if (res.code === 1000) {
        message.success(res.message || "Đã xóa CV!");
        fetchUserCvs();
      } else {
        message.error(res.message || "Xóa CV thất bại!");
      }
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi xóa CV!");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (url) => {
    window.open(url, "_blank");
  };

  const handleDownload = (url, fileName) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName); // tên file khi tải về
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Xem trước mẫu CV (ảnh hoặc PDF preview)
const handleViewTemplate = (template) => {
  setSelectedTemplate(template);
  setPreviewVisible(true);
};

// Tải mẫu CV về (file thật hoặc link static)
const handleDownloadTemplate = (template) => {
  const link = document.createElement("a");
  // nếu backend có fileUrl thì dùng thật
  const fileUrl = template.fileUrl || `/cv-templates/${template.id}.pdf`;
  link.href = fileUrl;
  link.setAttribute("download", `${template.name}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};


  return (
    <div className="cv-page">
      <div className="cv-container">
        <div className="cv-header">
          <Title className="title-cv" style={{textAlign: "left"}} level={2}>
            CV của tôi
          </Title>
          <Text className="subtitle" type="secondary">
            Quản lý CV và tải mẫu CV chuyên nghiệp
          </Text>
        </div>

        <Tabs defaultActiveKey="upload" centered className="cv-tabs">
          {/* UPLOAD */}
          <TabPane tab="Tải CV lên" key="upload">
            <Card className="cv-card">
              <Title level={4}>Tải CV lên</Title>
              <Text type="secondary">
                Tải lên CV của bạn để sẵn sàng ứng tuyển ngay. Hỗ trợ PDF, DOC, DOCX (tối đa 5MB)
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

          {/* MY CVS */}
          <TabPane tab={`CV của tôi (${uploadedCVs.length})`} key="my-cvs">
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Spin size="large" />
              </div>
            ) : uploadedCVs.length === 0 ? (
              <Card className="cv-empty">
                <FileTextOutlined className="cv-empty-icon" />
                <Text type="secondary">Chưa có CV nào được tải lên</Text>
              </Card>
            ) : (
              uploadedCVs.map((cv) => (
                <Card key={cv.id} className="cv-item">
                  <div className="cv-left">
                    <div className="cv-icon-wrap">
                      <FileTextOutlined className="cv-icon" />
                    </div>
                    <div>
                      <div className="cv-name">{cv.fileName}</div>
                      <div className="cv-meta">
                        Tải lên:{" "}
                        {new Date(cv.uploadedAt).toLocaleDateString("vi-VN")} •{" "}
                        {(cv.fileSize / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>

                  <div className="cv-actions">
                    <Button
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => handleView(cv.fileUrl)}
                    >
                      Xem
                    </Button>
                    <Button
                      size="small"
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownload(cv.fileUrl, cv.fileName)}
                    >
                      Tải về
                    </Button>
                    <Button
                      size="small"
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(cv.id)}
                    />
                  </div>
                </Card>
              ))
            )}
          </TabPane>

          {/* TEMPLATES */}
          <TabPane tab={`Mẫu CV (${cvTemplates.length})`} key="templates">
            <div className="cv-template-grid">
            {cvTemplates.map((t) => (
              <Card key={t.id} className="cv-template-card">
                <div className="cv-template-thumb">
                  <img src={t.thumbnail} alt={t.name} />
                  <Tag className="cv-tag">{t.category}</Tag>
                </div>
                <div className="cv-template-body">
                  <Title level={5}>{t.name}</Title>
                  <Text type="secondary">{t.description}</Text>
                  <div className="cv-template-actions">
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownloadTemplate(t)}
                    >
                      Tải về
                    </Button>
                    <Button
                      icon={<EyeOutlined />}
                      onClick={() => handleViewTemplate(t)}
                    />
                  </div>
                </div>
              </Card>
            ))}
            </div>
            {/* Modal xem trước */}
            {previewVisible && (
              <div className="cv-preview-overlay" onClick={() => setPreviewVisible(false)}>
                <div className="cv-preview-modal" onClick={(e) => e.stopPropagation()}>
                  <img src={selectedTemplate?.thumbnail} alt={selectedTemplate?.name} />
                  <div className="cv-preview-footer">
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownloadTemplate(selectedTemplate)}
                    >
                      Tải mẫu này
                    </Button>
                    <Button type="text" onClick={() => setPreviewVisible(false)}>
                      Đóng
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default MyCV;
