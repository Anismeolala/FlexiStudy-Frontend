import React, { useState } from "react";
import { registerAPI, registerRecruiterAPI } from "../../apis/index";
import { Link, useNavigate } from "react-router-dom";
import { Button, Col, Form, Input, message, Row, Tabs } from "antd";
import banner from "../../assets/video/flexistudy_banner.gif";
import Preloader from "../../components/Preloader/Preloader";
import "./Register.css";

const Register = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("user");
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      let res;
      if (activeTab === "user") {
        // Gọi API đăng ký người dùng
        res = await registerAPI(values.username, values.password);
      } else {
        // Gọi API đăng ký nhà tuyển dụng
        res = await registerRecruiterAPI({
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
          companyName: values.companyName,
          description: values.description,
          website: values.website,
          memberNumber: values.memberNumber,
        });
      }

      if (res.code === 1000) {
        message.success(res.message || "Đăng ký thành công!");
        navigate("/login");
      } else {
        message.error(res.message || "Đăng ký thất bại!");
      }
    } catch (err) {
      console.error(" Register error:", err);
      message.error(
        err?.response?.data?.message || "Đăng ký thất bại! Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Preloader fullscreen={true} />}

      <Row className="register-page">
        <Col xs={0} md={12} className="register-left">
          <img className="register-image" src={banner} alt="Flexistudy register" />
        </Col>

        <Col xs={24} md={12} className="register-right">
        <div className="logo">
           <img src="/logo2.png" alt="Flexistudy Logo" className="register-logo" />
        </div>
          <div className="register-form-wrapper">
            {/* Tabs */}
            <Tabs
              centered
              defaultActiveKey="user"
              onChange={(key) => {
                setActiveTab(key);
                form.resetFields();
              }}
              items={[
                { key: "user", label: "Người dùng" },
                { key: "recruiter", label: "Nhà tuyển dụng" },
              ]}
            />

            <Form
              form={form}
              layout="vertical"
              className="register-form"
              onFinish={handleSubmit}
            >
              {/* ==== TAB NGƯỜI DÙNG ==== */}
              {activeTab === "user" && (
                <>
                  <Form.Item
                    name="username"
                    label="Tên đăng nhập"
                    rules={[
                      { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                      { min: 4, message: "Tên đăng nhập phải có ít nhất 4 ký tự!" },
                    ]}
                  >
                    <Input size="large" placeholder="Tên đăng nhập" />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[
                      { required: true, message: "Vui lòng nhập mật khẩu!" },
                      { min: 9, message: "Mật khẩu phải có ít nhất 9 ký tự!" },
                    ]}
                    hasFeedback
                  >
                    <Input.Password size="large" placeholder="Mật khẩu" />
                  </Form.Item>

                  <Form.Item
                    name="repassword"
                    label="Nhập lại mật khẩu"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error("Mật khẩu không khớp!"));
                        },
                      }),
                    ]}
                  >
                    <Input.Password size="large" placeholder="Nhập lại mật khẩu" />
                  </Form.Item>
                </>
              )}

              {/* ==== TAB NHÀ TUYỂN DỤNG ==== */}
              {activeTab === "recruiter" && (
                <>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                  >
                    <Input size="large" placeholder="Email công ty" />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[
                      { required: true, message: "Vui lòng nhập mật khẩu!" },
                      { min: 9, message: "Mật khẩu phải có ít nhất 9 ký tự!" },
                    ]}
                    hasFeedback
                  >
                    <Input.Password size="large" placeholder="Mật khẩu" />
                  </Form.Item>

                  <Form.Item
                    name="firstName"
                    label="Tên"
                    rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                  >
                    <Input size="large" placeholder="Tên người liên hệ" />
                  </Form.Item>

                  <Form.Item
                    name="lastName"
                    label="Họ"
                    rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
                  >
                    <Input size="large" placeholder="Họ người liên hệ" />
                  </Form.Item>

                  <Form.Item
                    name="companyName"
                    label="Tên công ty"
                    rules={[{ required: true, message: "Vui lòng nhập tên công ty!" }]}
                  >
                    <Input size="large" placeholder="VD: Infrastructure Pro" />
                  </Form.Item>

                  <Form.Item
                    name="description"
                    label="Mô tả công ty"
                    rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                  >
                    <Input.TextArea rows={3} placeholder="Giới thiệu ngắn về công ty..." />
                  </Form.Item>

                  <Form.Item name="website" label="Website">
                    <Input size="large" placeholder="https://yourcompany.com" />
                  </Form.Item>

                  <Form.Item
                    name="memberNumber"
                    label="Số lượng nhân viên"
                    rules={[{ required: true, message: "Vui lòng nhập số lượng nhân viên!" }]}
                  >
                    <Input size="large" type="number" placeholder="VD: 1220" />
                  </Form.Item>
                </>
              )}

              {/* Submit */}
              <Form.Item>
                <Button
                  className="register-button"
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                >
                  {activeTab === "user"
                    ? "Đăng ký người dùng"
                    : "Đăng ký nhà tuyển dụng"}
                </Button>
              </Form.Item>

              <Form.Item>
                <div className="register-link">
                  <span>Đã có tài khoản? </span>
                  <Link to="/login">Đăng nhập ngay</Link>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Register;
