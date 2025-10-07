import React, { useState } from 'react'
import { createUserAPI } from "../../apis/index";
import { Link, useNavigate } from "react-router-dom";
import { Button, Col, DatePicker, Form, Input, message, Row } from 'antd';
import  banner  from "../../assets/video/flexistudy_banner.gif"
import Preloader from '../../components/Preloader/Preloader';
import dayjs from "dayjs";
import './Register.css'
const Register = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setIsLoading(true);

    const payload = {
      username: values.username,
      password: values.password,
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      address: values.address,
      dob: values.dob ? dayjs(values.dob).format("YYYY-MM-DD") : null,
    };

    try {
      const response = await createUserAPI(payload);
      console.log("📥 Register response:", response);
      if (response?.status === 201 || response?.code === 1000) {
        message.success(response?.message || "Đăng ký thành công!");
        navigate("/login");
      }
    } catch (error) {
      console.error("❌ Register error:", error);
      if (error?.response?.data?.code === 409) {
        message.error("Username hoặc email đã tồn tại");
      } else {
        message.error(error?.response?.data?.message || "Đăng ký thất bại");
      }
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
          <div className="register-form-wrapper">
            <img src="/logo2.png" alt="Flexistudy Logo" className="register-logo" />
            <Form
              form={form}
              layout="vertical"
              className="register-form"
              onFinish={handleSubmit}
            >
              {/* Username */}
              <Form.Item
                name="username"
                label="Tên đăng nhập"
                rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
              >
                <Input size="large" placeholder="Tên đăng nhập" />
              </Form.Item>

              {/* Email */}
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input size="large" placeholder="Email" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  {/* First Name */}
                  <Form.Item
                    name="firstName"
                    label="Họ"
                    rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
                  >
                    <Input size="large" placeholder="Họ" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {/* Last Name */}
                  <Form.Item
                    name="lastName"
                    label="Tên"
                    rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                  >
                    <Input size="large" placeholder="Tên" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  {/* Password */}
                  <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                    hasFeedback
                  >
                    <Input.Password size="large" placeholder="Mật khẩu" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {/* Re-password */}
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
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  {/* Phone */}
                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                  >
                    <Input size="large" placeholder="SĐT" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {/* DOB */}
                  <Form.Item name="dob" label="Ngày sinh">
                    <DatePicker format="YYYY-MM-DD" size="large" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>

              {/* Address */}
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <Input size="large" placeholder="Địa chỉ" />
              </Form.Item>

              {/* Submit */}
              <Form.Item>
                <Button
                  className="register-button"
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                >
                  Đăng ký
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

export default Register