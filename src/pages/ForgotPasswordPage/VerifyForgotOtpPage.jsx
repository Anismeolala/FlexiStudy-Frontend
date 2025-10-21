import React, { useState } from "react";
import { Input, Button, Card, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import "./VerifyForgotOtpPage.css";

const { Title, Text } = Typography;

export default function VerifyForgotOtpPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      message.warning("Vui lòng nhập đủ 6 số OTP!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/verify-forgot-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (data.code === 1000) {
        message.success("OTP hợp lệ, vui lòng đặt lại mật khẩu mới!");
        navigate("/reset-password");
      } else {
        message.error(data.message || "OTP không hợp lệ hoặc đã hết hạn!");
      }
    } catch (err) {
      message.error("Lỗi hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      message.warning("Không tìm thấy email để gửi lại OTP!");
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
        message.success("Đã gửi lại mã OTP đến email của bạn!");
      } else {
        message.error(data.message || "Không thể gửi lại OTP!");
      }
    } catch {
      message.error("Lỗi hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card-wrapper">
        <Card className="verify-card" bordered={false}>
          <div className="verify-header">
            <Title level={3} className="verify-title">
              Xác minh OTP 📩
            </Title>
            <Text className="verify-description">
              Nhập mã OTP gồm 6 số đã gửi đến email: <strong>{email}</strong>
            </Text>
          </div>

          <div className="verify-form">
            <Input
              placeholder="Nhập mã OTP"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="otp-input"
              size="large"
            />

            <Button
              type="primary"
              size="large"
              loading={loading}
              block
              onClick={handleVerifyOtp}
            >
              {loading ? "Đang xác thực..." : "Xác nhận"}
            </Button>

            <Button
              type="default"
              block
              onClick={handleResendOtp}
              disabled={loading}
            >
              Gửi lại mã OTP
            </Button>

            <Button
              type="link"
              block
              onClick={() => navigate("/login")}
              className="back-btn"
            >
              Quay lại đăng nhập
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}