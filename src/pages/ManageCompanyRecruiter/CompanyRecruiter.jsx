import React from "react";
import { Card, Input, Button, Badge, Form } from "antd";
import {
  EnvironmentOutlined,
  GlobalOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  UploadOutlined,
  BankOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import "./CompanyRecruiter.css";

const CompanyRecruiter = () => {
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
              <BankOutlined style={{ fontSize: 40, color: "#1677ff" }} />
            </div>
            <h3>Tech Solutions Inc.</h3>
            <Badge
              color="green"
              text={
                <span className="verified-text">
                  <CheckCircleOutlined /> Verified
                </span>
              }
            />
          </div>

          <div className="overview-info">
            <p>
              <EnvironmentOutlined /> Ho Chi Minh City, Vietnam
            </p>
            <p>
              <TeamOutlined /> 200-500 employees
            </p>
            <p>
              <GlobalOutlined />{" "}
              <a href="https://techsolutions.com" target="_blank" rel="noreferrer">
                techsolutions.com
              </a>
            </p>
          </div>
        </Card>

        {/* Edit Form */}
        <div className="company-form">
          <Card title="Basic Information">
            <Form layout="vertical">
              <Form.Item label="Company Name">
                <Input defaultValue="Tech Solutions Inc." />
              </Form.Item>

              <Form.Item label="Website">
                <Input type="url" defaultValue="https://techsolutions.com" />
              </Form.Item>

              <Form.Item label="Location">
                <Input defaultValue="Ho Chi Minh City, Vietnam" />
              </Form.Item>

              <Form.Item label="Company Size">
                <Input defaultValue="200-500 employees" />
              </Form.Item>

              <Form.Item label="Company Logo">
                <div className="upload-area">
                  <Button icon={<UploadOutlined />}>Upload Logo</Button>
                  <span className="upload-hint">PNG, JPG up to 5MB</span>
                </div>
              </Form.Item>
            </Form>
          </Card>

          <Card title="Company Description">
            <Form layout="vertical">
              <Form.Item label="About the Company">
                <TextArea
                  rows={6}
                  defaultValue="Tech Solutions Inc. is a leading technology company specializing in innovative software solutions. We're passionate about creating products that make a difference and building a diverse, inclusive workplace where everyone can thrive."
                />
              </Form.Item>

              <Form.Item label="Company Culture">
                <TextArea
                  rows={4}
                  defaultValue="We believe in work-life balance, continuous learning, and collaborative innovation. Our team enjoys flexible working arrangements, professional development opportunities, and a supportive environment."
                />
              </Form.Item>
            </Form>
          </Card>

          <Card title="Verification Status">
            <div className="verify-box">
              <CheckCircleOutlined className="verify-icon" />
              <div>
                <p className="verify-title">Company Verified</p>
                <p className="verify-desc">
                  Your company has been verified by our team. This badge helps build trust with candidates.
                </p>
              </div>
            </div>
          </Card>

          <div className="form-actions">
            <Button>Cancel</Button>
            <Button type="primary">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyRecruiter;
