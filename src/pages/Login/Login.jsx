import { Button, Col, Form, Input, Row, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode";
import './Login.css'
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Preloader from '../../components/Preloader/Preloader';
import  banner  from "../../assets/video/flexistudy_banner.gif"
import { loginAPI } from '../../apis';
import { resetUser, setIsAuthorized } from '../../redux/userSlice';
import { getMyInfo } from '../../redux/userSlice';
import { OAuthConfig } from '../../utils/constants';
import { GoogleOutlined } from '@ant-design/icons';

const Login = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(() => {
    localStorage.removeItem("accessToken");
    dispatch(resetUser());
    dispatch(setIsAuthorized(false));
  }, [dispatch]);

    const handleLogin = async () => {
      try {
        setIsLoading(true);
        const values = await form.validateFields();
        const { username, password } = values;

        const res = await loginAPI(username, password);

        if (res.code === 1000) {
          // Lưu token
          localStorage.setItem("accessToken", res.result.token);
          localStorage.setItem("refreshToken", res.result.token);
          dispatch(setIsAuthorized(true));

          //  Gọi API lấy thông tin user
          const resultAction = await dispatch(getMyInfo());
          const userData = resultAction.payload;
          console.log("User data after login:", userData);

          //  Kiểm tra role + profile_completed để điều hướng
          const decoded = jwtDecode(res.result.token);
          const scope = decoded.scope || "";

          if (scope.includes("ROLE_ADMIN")) {
            navigate("/admin");
            message.success("Đăng nhập thành công (Admin)");
          } 
          else if (scope.includes("ROLE_USER")) {
            if (userData?.result.profileCompleted === false) {
              navigate("/onboard");
              message.info("Chào mừng! Hãy hoàn thiện hồ sơ của bạn để bắt đầu.");
            } else {
              // User đã hoàn thành hồ sơ
              navigate("/");
              message.success("Đăng nhập thành công!");
            }
          } 
          else {
            message.error("Vai trò người dùng không xác định");
          }
        }
      } catch (error) {
        console.error(error);
        if (error.response?.status === 401) {
          message.error("Tài khoản hoặc mật khẩu không đúng");
        } else if (error.errorFields) {
          // Validation error
        } else {
          message.error("Đăng nhập thất bại, có lỗi xảy ra");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const handleLoginGoogle = () => {
       const callbackUrl = OAuthConfig.redirectUri;
        const authUrl = OAuthConfig.authUri;
        const googleClientId = OAuthConfig.clientId;

        const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
          callbackUrl
        )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

        console.log(targetUrl);

        window.location.href = targetUrl;
    };

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
            <img src="/logo2.png" alt="Flexistudy Logo" className="login-logo" />
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
              <div className="login-extra">
                <Link to="/forgot-password" className="forgot-password">
                  Quên mật khẩu?
                </Link>
              </div>

              <Form.Item >
                <Button className="login-button" type="primary" htmlType="submit" size="large" block>
                Đăng nhập
                </Button>
              </Form.Item>

              <div className="google-login-wrapper">
                <Button
                  className="google-icon-button"
                  shape="circle"
                  icon={<GoogleOutlined />}
                  onClick={handleLoginGoogle}
                />
                <span className="google-text">Đăng nhập bằng Google</span>
              </div>

              <div className="register-link">
                <span>Bạn chưa có tài khoản? </span>
                <Link to="/register">Đăng ký ngay</Link>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default Login