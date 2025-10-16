import { useState } from "react";
import { Button, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../utils/localStorageService";
import { useDispatch } from "react-redux";
import { getMyInfo, setIsAuthorized } from "../../redux/userSlice";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = localStorage.getItem("email");

  const handleVerify = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      console.log("Verify OTP response", data);

      if (data.code === 1000) {
        const result = data.result;

        // 1 Lưu token mới từ backend
        if (result.token) {
          setToken(result.token);
          dispatch(setIsAuthorized(true));
        }

        // 2️ Nếu backend trả noPassword = true
        if (result.noPassword === true) {
          message.success("Xác minh email thành công! Hãy đặt mật khẩu mới.");
          navigate("/set-password");
          return;
        }
              //  Gọi API lấy thông tin người dùng sau khi verify thành công
        // 3 Nếu có token mà không cần đặt password thì getMyInfo như bình thường
        if (result.token) {
          const userInfoAction = await dispatch(getMyInfo());
          const userData = userInfoAction.payload;
          console.log("User info after verify:", userData);
        }

        message.success("Xác minh OTP thành công!");
        navigate("/");
      } else {
        message.error(data.message || "OTP không hợp lệ hoặc đã hết hạn!");
      }
    } catch (err) {
      console.error("Lỗi xác minh OTP:", err);
      message.error("Xác minh thất bại, thử lại!");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h2>Xác minh OTP 📩</h2>
      <p>
        Nhập mã OTP đã được gửi đến email: <b>{email}</b>
      </p>
      <Input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Nhập mã OTP (6 số)"
        style={{ width: 200, marginRight: 10 }}
        maxLength={6}
      />
      <Button type="primary" onClick={handleVerify}>
        Xác nhận
      </Button>
    </div>
  );
}
