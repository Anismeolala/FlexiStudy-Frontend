import React, { useEffect, useState } from "react";
import { Card, Input, Button, Badge, Form, Upload, message, Spin } from "antd";
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
} from "../../apis"; 
import "./CompanyRecruiter.css";

const CompanyRecruiter = () => {
  const [form] = Form.useForm();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);


  const getCompanyId = async () => {
    let companyId = localStorage.getItem("companyId");
    if (!companyId) {
      try {
        const res = await getMyInfoAPI(); 
        const result = res?.result || res?.data?.result;
        if (result?.companyId) {
          companyId = result.companyId;
          localStorage.setItem("companyId", companyId);
        } else {
          console.warn("Tài khoản chưa thuộc công ty nào.");
        }
      } catch (error) {
        console.error("Không thể lấy companyId từ getMyInfoAPI:", error);
      }
    }
    return companyId;
  };


  const normalizeCompanyResponse = (res) => {
    if (!res) return null;
    if (res.result) return res.result;
    if (res.data && res.data.result) return res.data.result;
    if (res.data && typeof res.data === "object" && !res.data.result) return res.data;
    return res;
  };


  const fetchCompany = async () => {
    try {
      setLoading(true);
      const id = await getCompanyId();

      if (!id) {
        message.warning("Tài khoản này chưa thuộc công ty nào.");
        setLoading(false);
        return;
      }

      const res = await getCompanyByIdAPI(id);
      const data = normalizeCompanyResponse(res);

      if (!data) {
        console.error("GET /companies/{companyId} trả về unexpected:", res);
        message.error("Không nhận được dữ liệu công ty hợp lệ từ server.");
        setCompany(null);
        return;
      }

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

  // 🔹 Upload logo
  const handleUpload = async (file) => {
    const companyId = localStorage.getItem("companyId");
    if (!companyId) {
      message.error("companyId không tồn tại.");
      return false;
    }

    try {
      setLogoLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      await uploadCompanyLogoAPI(companyId, formData);
      await fetchCompany();
      message.success("Tải logo thành công!");
      return false;
    } catch (err) {
      console.error("handleUpload error:", err);
      message.error("Lỗi khi tải logo");
      return false;
    } finally {
      setLogoLoading(false);
    }
  };


  const handleSave = async () => {
    const companyId = localStorage.getItem("companyId");
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

  if (loading) {
    return (
      <div className="company-page" style={{ textAlign: "center", marginTop: 100 }}>
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
              color={company?.isVerified ? "green" : "green"}
              text={
                <span className="verified-text">
                  <CheckCircleOutlined />{" "}
                  {company?.isVerified ? "Verified" : " Verified"}
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
                rules={[{ required: true, message: "Please enter company name" }]}
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
                  <Upload customRequest={({ file }) => handleUpload(file)} showUploadList={false}>
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
                  color: company?.isVerified ? "green" : "green",
                }}
              />
              <div>
                <p className="verify-title">
                  {company?.isVerified ? "Company Verified" : "Company Verified"}
                </p>
                <p className="verify-desc">
                  {company?.isVerified
                    ? "Your company has been verified by our team. This badge helps build trust with candidates."
                    : "Your company has been verified by our team. This badge helps build trust with candidates."}
                </p>
              </div>
            </div>
          </Card>

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
