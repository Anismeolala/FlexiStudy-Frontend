import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Button,
  Badge,
  Form,
  Upload,
  message,
  Spin,
  Modal,
  Image,
} from "antd";
import {
  GlobalOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  UploadOutlined,
  BankOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import {
  getCompanyByIdAPI,
  updateCompanyAPI,
  uploadCompanyLogoAPI,
  getMyInfoAPI,
  uploadVerificationImageAPI,
} from "../../apis";
import "./CompanyRecruiter.css";
import { useSelector } from "react-redux";

const CompanyRecruiter = () => {
  const [form] = Form.useForm();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const companyId = useSelector((state) => state.user?.companyId);

  const normalizeCompanyResponse = (res) => {
    if (!res) return null;
    if (res.result) return res.result;
    if (res.data && res.data.result) return res.data.result;
    if (res.data && typeof res.data === "object" && !res.data.result)
      return res.data;
    return res;
  };

  const fetchCompany = async () => {
    try {
      setLoading(true);

      let id = companyId;
      if (!id) {
        const res = await getMyInfoAPI();
        id = res?.result?.companyId;
      }

      if (!id) {
        message.warning("Tài khoản này chưa thuộc công ty nào.");
        setCompany(null);
        return;
      }

      const res = await getCompanyByIdAPI(id);
      const data = normalizeCompanyResponse(res);

      setCompany(data);
      form.setFieldsValue({
        name: data.name,
        website: data.website,
        description: data.description,
        memberNumber: data.memberNumber,
      });
    } catch (err) {
      console.error("fetchCompany error:", err);
      message.error("Không thể tải thông tin công ty");
      setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = async (file) => {
    if (!companyId) {
      message.error("companyId không tồn tại trong Redux.");
      return false;
    }

    try {
      setLogoLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      await uploadCompanyLogoAPI(companyId, formData);
      await fetchCompany();
      message.success("Tải logo thành công!");
    } catch (err) {
      console.error("handleUpload error:", err);
      message.error("Lỗi khi tải logo");
    } finally {
      setLogoLoading(false);
    }

    return false;
  };

  const handleUploadVerificationDocument = async (file) => {
    if (!companyId) {
      message.error("companyId không tồn tại!");
      return;
    }
    if (!companyId) {
      message.error("companyId không tồn tại.");
      return false;
    }

    try {
      setLogoLoading(true);
      const res = await uploadVerificationImageAPI(companyId, file);
      console.log("Response:", res);

      if (res.code === 1000) {
        setUploadedFile(file); // Lưu file đã upload
        message.success("Tải tài liệu xác minh thành công!");
        await fetchCompany(); // Cập nhật lại thông tin công ty
        setModalVisible(false); // Đóng modal sau khi upload thành công
      } else {
        message.error("Lỗi khi tải tài liệu xác minh.");
      }

      return false;
    } catch (err) {
      console.error("Error:", err);
      message.error("Lỗi khi tải tài liệu xác minh.");
      return false;
    } finally {
      setLogoLoading(false);
    }
  };

  const handleSave = async () => {
    if (!companyId) {
      message.error("companyId không tồn tại!");
      return;
    }
    if (!companyId) {
      message.error("companyId không tồn tại.");
      return;
    }

    try {
      setSaving(true);
      const values = await form.validateFields();
      const payload = {
        name: values.name,
        website: values.website,
        description: values.description,
        memberNumber: values.memberNumber,
      };

      await updateCompanyAPI(companyId, payload);
      await fetchCompany();
      message.success("Cập nhật thông tin công ty thành công!");
    } catch (err) {
      console.error("handleSave error:", err);
      message.error("Cập nhật thất bại!");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (company) {
      form.setFieldsValue({
        name: company.name,
        website: company.website,
        description: company.description,
        memberNumber: company.memberNumber,
      });
    } else {
      form.resetFields();
    }
    message.info("Đã hủy thay đổi");
  };

  const showModal = () => {
    setModalVisible(true); // Mở modal mà không kiểm tra tài liệu đã upload hay chưa
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleModalOk = async (file) => {
    await handleUploadVerificationDocument(file);
    setModalVisible(false);
  };

  if (loading) {
    return (
      <div
        className="company-page"
        style={{ textAlign: "center", marginTop: 100 }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="company-page">
      {/* Header */}
      <div className="company-header">
        <div>
          <h1>Company Profile</h1>
          <p>Manage your company information</p>
        </div>
      </div>

      <div className="company-layout">
        {/* Company Overview */}
        <Card className="company-overview" title="Company Overview">
          <div className="overview-content">
            <div className="company-logo">
              {company?.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt="logo"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <BankOutlined style={{ fontSize: 40, color: "#1677ff" }} />
              )}
            </div>
            <h3>{company?.name || "Unnamed Company"}</h3>

            <Badge
              color={
                company?.verificationStatus === "VERIFIED" ? "green" : "red"
              }
              text={
                <span className="verified-text">
                  <CheckCircleOutlined />{" "}
                  {company?.verificationStatus === "VERIFIED"
                    ? "Verified"
                    : company?.verificationStatus === "PENDING"
                    ? "Pending"
                    : company?.verificationStatus === "REJECTED"
                    ? "Rejected"
                    : company?.verificationStatus === "SUSPENDED"
                    ? "Suspended"
                    : "Unverified"}
                </span>
              }
            />
          </div>

          <div className="overview-info">
            <p>
              <GlobalOutlined />{" "}
              {company?.website ? (
                <a href={company.website} target="_blank" rel="noreferrer">
                  {company.website}
                </a>
              ) : (
                "No website"
              )}
            </p>
            <p>
              <TeamOutlined /> Members: {company?.memberNumber ?? "N/A"}
            </p>
          </div>
        </Card>

        {/* Edit Form */}
        <div className="company-form">
          <Card title="Basic Information">
            <Form layout="vertical" form={form}>
              <Form.Item
                label="Company Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter company name" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Website" name="website">
                <Input type="url" />
              </Form.Item>

              <Form.Item label="Number of Members" name="memberNumber">
                <Input type="number" />
              </Form.Item>

              <Form.Item label="Company Logo">
                <div className="upload-area">
                  <Upload
                    customRequest={({ file }) => handleUpload(file)}
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />} loading={logoLoading}>
                      Upload Logo
                    </Button>
                  </Upload>
                  <span className="upload-hint">PNG, JPG up to 5MB</span>
                </div>
              </Form.Item>
            </Form>
          </Card>

          <Card title="Company Description">
            <Form layout="vertical" form={form}>
              <Form.Item label="About the Company" name="description">
                <TextArea rows={6} />
              </Form.Item>
            </Form>
          </Card>

          <Card title="Verification Status">
            <div className="verify-box">
              <CheckCircleOutlined
                className="verify-icon"
                style={{
                  color:
                    company?.verificationStatus === "VERIFIED"
                      ? "green"
                      : company?.verificationStatus === "PENDING"
                      ? "orange"
                      : company?.verificationStatus === "REJECTED"
                      ? "red"
                      : company?.verificationStatus === "SUSPENDED"
                      ? "gray"
                      : "red",
                }}
              />
              <div>
                <p className="verify-title">
                  {company?.verificationStatus === "VERIFIED"
                    ? "Company Verified"
                    : company?.verificationStatus === "PENDING"
                    ? "Verification Pending"
                    : company?.verificationStatus === "REJECTED"
                    ? "Verification Rejected"
                    : company?.verificationStatus === "SUSPENDED"
                    ? "Verification Suspended"
                    : "Company Unverified"}
                </p>
                <p className="verify-desc">
                  {company?.verificationStatus === "VERIFIED"
                    ? "Your company has been verified by our team. This badge helps build trust with candidates."
                    : company?.verificationStatus === "PENDING"
                    ? "Your verification request is pending. Please wait for admin approval."
                    : company?.verificationStatus === "REJECTED"
                    ? `Your verification request has been rejected. Reason: ${company?.verificationNote}`
                    : company?.verificationStatus === "SUSPENDED"
                    ? "Your verification has been suspended due to suspicious activity."
                    : "Your company is not verified yet. Please submit verification documents to complete the process."}
                </p>

                {/* Hiển thị nút View nếu tài liệu đã upload, ngược lại là Upload */}
                <Button
                  style={{ backgroundColor: "#1890ff", color: "white" }}
                  onClick={showModal}
                  disabled={!!company?.verificationImageUrl} // Disable nút nếu đã có tài liệu xác minh
                >
                  {company?.verificationImageUrl
                    ? "View Uploaded Document"
                    : "Upload Verification Document"}
                </Button>
              </div>
            </div>
          </Card>
          <Modal
            title="Upload Verification Document"
            open={modalVisible} // Modal mở hay không
            onCancel={handleModalCancel}
            footer={null}
          >
            <Upload
              customRequest={({ file }) => handleModalOk(file)} // Thực hiện upload khi chọn file
              showUploadList={false}
              disabled={company?.verificationImageUrl} // Vô hiệu hóa nếu đã có tài liệu xác minh
            >
              <Button
                icon={<UploadOutlined />}
                disabled={company?.verificationImageUrl} // Vô hiệu hóa nút upload nếu đã có tài liệu xác minh
              >
                {company?.verificationImageUrl
                  ? "File Uploaded"
                  : "Select File"}
              </Button>
            </Upload>

            {/* Nếu tài liệu đã upload, hiển thị ảnh đã upload */}
            {company?.verificationImageUrl && (
              <div style={{ marginTop: 20 }}>
                <h4>Uploaded Image:</h4>
                <Image
                  width={200}
                  src={company.verificationImageUrl} // Hiển thị ảnh đã upload
                  alt="Verification File"
                />
              </div>
            )}
          </Modal>

          <div className="form-actions">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" loading={saving} onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyRecruiter;
