import React, { useState } from 'react'
import { registerAPI } from "../../apis/index";
import { Link, useNavigate } from "react-router-dom";
import { Button, Col, Form, Input, message, Row } from 'antd';
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
    try {
      const res = await registerAPI(values.username, values.password);
      message.success(res.message || "Đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      console.error("❌ Register error:", err);
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
          <img
            className="register-image"
            src={banner}
            alt="Flexistudy register"
          />
        </Col>

        <Col xs={24} md={12} className="register-right">
          <div className="register-form-wrapper">
            <img
              src="/logo2.png"
              alt="Flexistudy Logo"
              className="register-logo"
            />

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
                rules={[
                  { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                  { min: 4, message: "Tên đăng nhập phải có ít nhất 4 ký tự!" },
                ]}
              >
                <Input size="large" placeholder="Tên đăng nhập" />
              </Form.Item>

              {/* Password */}
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

              {/* Confirm Password */}
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

              {/* Submit button */}
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

export default Register;