import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Button,
  Upload,
  Avatar,
  message,
  InputNumber,
} from "antd";
import { CameraOutlined, BankOutlined } from "@ant-design/icons";
import {
  createCompanyAPI,
  updateCompanyAPI,
  uploadCompanyLogoAPI,
} from "../../../apis/index";
import ButtonPrimary from "../../../components/PrimaryButton/PrimaryButton";
import "./CompanyModal.css";

const CompanyModal = ({
  visible,
  onCancel,
  onSuccess,
  editingCompany = null,
  loading: externalLoading = false,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // ✅ Reset form khi modal mở/đóng hoặc chuyển chế độ edit
  useEffect(() => {
    if (visible) {
      if (editingCompany) {
        form.setFieldsValue({
          name: editingCompany.name,
          website: editingCompany.website,
          memberNumber: editingCompany.memberCount,
          description: editingCompany.description,
        });
        setLogoUrl(editingCompany.logoUrl || "");
      } else {
        form.resetFields();
        setLogoUrl("");
      }
    }
  }, [visible, editingCompany, form]);

  // 📸 Upload logo công ty
  const handleLogoUpload = async (file) => {
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadCompanyLogoAPI(editingCompany?.id, formData);

      if (response.code === 1000) {
        const newLogoUrl = response.result;
        setLogoUrl(newLogoUrl);
        message.success("Tải lên logo thành công!");
      } else {
        message.error("Upload logo thất bại!");
      }
    } catch (error) {
      message.error("Upload logo thất bại!");
    } finally {
      setUploadingLogo(false);
    }

    return false; // Không upload mặc định của antd
  };

  // 💾 Submit form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload = {
        name: values.name,
        website: values.website,
        description: values.description,
        memberNumber: values.memberNumber,
        logoUrl: logoUrl || null,
      };

      if (editingCompany) {
        await updateCompanyAPI(editingCompany.id, payload);
        message.success("Cập nhật công ty thành công");
      } else {
        await createCompanyAPI(payload);
        message.success("Thêm công ty mới thành công");
      }

      form.resetFields();
      setLogoUrl("");
      onSuccess?.();
    } catch (error) {
      if (error.errorFields) return;
      console.error("Error saving company:", error);
      message.error(
        editingCompany ? "Cập nhật công ty thất bại" : "Thêm công ty thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  //  Đóng modal
  const handleCancel = () => {
    form.resetFields();
    setLogoUrl("");
    onCancel?.();
  };

  return (
    <Modal
      title={editingCompany ? "Chỉnh sửa công ty" : "Thêm công ty mới"}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      width={700}
      okText={editingCompany ? "Cập nhật" : "Thêm"}
      cancelText="Hủy"
      confirmLoading={loading || externalLoading}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        {/* Upload Logo */}
        <Form.Item label="Logo công ty">
          <div className="company-logo-upload">
            <div className="logo-preview">
              <Avatar
                size={120}
                src={logoUrl}
                icon={<BankOutlined />}
                shape="square"
              />
            </div>
            <div className="upload-controls">
              <Upload
                name="companyLogo"
                beforeUpload={handleLogoUpload}
                showUploadList={false}
                accept="image/*"
              >
                <ButtonPrimary
                  icon={<CameraOutlined />}
                  loading={uploadingLogo}
                  type="primary"
                  ghost
                >
                  {uploadingLogo ? "Đang upload..." : "Chọn logo"}
                </ButtonPrimary>
              </Upload>
              {logoUrl && (
                <Button onClick={() => setLogoUrl("")} danger type="text">
                  Xóa logo
                </Button>
              )}
            </div>
          </div>
        </Form.Item>

        {/* Company Info */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên công ty"
              rules={[{ required: true, message: "Vui lòng nhập tên công ty" }]}
            >
              <Input placeholder="VD: Coca Cola" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="website"
              label="Website"
              rules={[{ required: true, message: "Vui lòng nhập website" }]}
            >
              <Input placeholder="https://example.com" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <Input.TextArea rows={3} placeholder="Mô tả ngắn gọn về công ty..." />
        </Form.Item>

        <Form.Item
          name="memberNumber"
          label="Số lượng thành viên"
          rules={[{ required: true, message: "Vui lòng nhập số lượng thành viên" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} placeholder="VD: 200" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CompanyModal;
