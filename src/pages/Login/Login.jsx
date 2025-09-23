import { Button, Col, Form, Input, Row } from 'antd'
import React, { useState } from 'react'
import { Link } from 'react-router';
import './Login.css'
import Preloader from '../../components/Preloader/Preloader';
import  banner  from "../../assets/video/flexistudy_banner.gif"
const Login = () => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (values) => {
        console.log('Login values:', values);
        // Xử lý đăng nhập ở đây
    }

  return (
     <>
     {isLoading && <Preloader fullscreen={true} />}

      <Row className="login-page">
        <Col xs={0} md={12} className="login-left">
          <img
            className="login-image"
            src= {banner}
            alt="Flexistudy Login"
          />
        </Col>
        <Col xs={24} md={12} className="login-right">
          <div className="login-form-wrapper">
            <img src="/Flexistudy-Logo.png" alt="Flexistudy Logo" className="login-logo" />
            <Form form={form} layout="vertical" className="login-form" onFinish={handleLogin}>
              <Form.Item
                name="username"
                className="username-input"
                rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
              >
                <Input size="large" placeholder="Tên đăng nhập" />
              </Form.Item>
              <Form.Item
                name="password"
                className="password-input"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password size="large" placeholder="Mật khẩu" />
              </Form.Item>
              <Form.Item>
                <Button className="login-button" type="primary" htmlType="submit" size="login">Đăng nhập</Button>
              </Form.Item>
              <Form.Item>
              {/* <div div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Link to="/forgot-password">Quên mật khẩu?</Link>
              </div> */}
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default Login