import React, { useState } from "react";
import { Input, Button, message, Typography, Card } from "antd";
import { useNavigate } from "react-router-dom";
import "./ForgotPasswordPage.css";

const { Title, Text } = Typography;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      message.warning("Vui lòng nhập email!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.code === 1000) {
        message.success("OTP đã được gửi đến email của bạn!");
        localStorage.setItem("resetEmail", email);
        navigate("/verify-forgot-otp");
      } else {
        message.error(data.message || "Không thể gửi OTP!");
      }
    } catch (err) {
      message.error("Lỗi hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card-wrapper">
        <Card className="forgot-card" bordered={false}>
          <div className="forgot-header">
            <Title level={3} className="forgot-title">
              Quên mật khẩu 🔐
            </Title>
            <Text className="forgot-description">
              Nhập email của bạn để nhận mã OTP đặt lại mật khẩu
            </Text>
          </div>

          <div className="forgot-form">
            <Text className="forgot-label">Email</Text>
            <Input
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="large"
            />

            <Button
              type="primary"
              size="large"
              loading={loading}
              block
              onClick={handleSendOtp}
            >
              {loading ? "Đang gửi..." : "Gửi mã OTP"}
            </Button>

            <Button
              type="link"
              className="forgot-back-btn"
              onClick={() => navigate("/login")}
              block
            >
              Quay lại đăng nhập
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
