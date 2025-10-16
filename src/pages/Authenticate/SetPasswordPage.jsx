import React, { useState } from "react";
import { Input, Button, Card, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import "./SetPasswordPage.css";
import { useDispatch } from "react-redux";
import { createPasswordAPI } from "../../apis";

const { Title, Text } = Typography;

export default function SetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSetPassword = async () => {
    if (!password || !confirm) {
      message.warning("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (password.length < 6) {
      message.warning("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    if (password !== confirm) {
      message.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      const data = await createPasswordAPI(password); 

      if (data.code === 1000) {
        message.success("Tạo mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu này.");
        navigate("/login");
      } else {
        message.error(data.message || "Không thể tạo mật khẩu!");
      }
    } catch (err) {
      console.error("Error creating password:", err);
      message.error("Lỗi hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setpw-container">
      <div className="setpw-card-wrapper">
        <Card className="setpw-card" bordered={false}>
          <div className="setpw-header">
            <Title level={3} className="setpw-title">
              Tạo mật khẩu mới 🔒
            </Title>
            <Text className="setpw-description">
              Hãy đặt mật khẩu để hoàn tất đăng ký tài khoản Google của bạn
            </Text>
          </div>

          <div className="setpw-form">
            <Input.Password
              placeholder="Nhập mật khẩu mới"
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
              onClick={handleSetPassword}
            >
              {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
            </Button>

            <Button
              type="link"
              block
              className="setpw-back-btn"
              onClick={() => navigate("/")}
            >
              Bỏ qua và quay lại trang chủ
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
