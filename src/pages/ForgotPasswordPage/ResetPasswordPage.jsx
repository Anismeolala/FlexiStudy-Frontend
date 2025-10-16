import React, { useState } from "react";
import { Input, Button, Card, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import "./ResetPasswordPage.css";

const { Title, Text } = Typography;

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem("resetEmail");
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!password || !confirm) {
      message.warning("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (password.length < 6) {
      message.warning("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    if (password !== confirm) {
      message.error("Mật khẩu nhập lại không khớp!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password }),
      });

      const data = await res.json();

      if (data.code === 1000) {
        message.success("Đặt lại mật khẩu thành công!");
        localStorage.removeItem("resetEmail");
        navigate("/login");
      } else {
        message.error(data.message || "Không thể đặt lại mật khẩu!");
      }
    } catch (err) {
      message.error("Lỗi hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card-wrapper">
        <Card className="reset-card" bordered={false}>
          <div className="reset-header">
            <Title level={3} className="reset-title">
              Đặt lại mật khẩu 🔑
            </Title>
            <Text className="reset-description">
              Nhập mật khẩu mới của bạn để tiếp tục
            </Text>
          </div>

          <div className="reset-form">
            <Input.Password
              placeholder="Mật khẩu mới"
              size="large"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input.Password
              placeholder="Xác nhận mật khẩu mới"
              size="large"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            <Button
              type="primary"
              size="large"
              loading={loading}
              block
              onClick={handleReset}
            >
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </Button>

            <Button
              type="link"
              block
              className="reset-back-btn"
              onClick={() => navigate("/login")}
            >
              Quay lại đăng nhập
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
