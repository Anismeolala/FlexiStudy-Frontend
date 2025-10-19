import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { setToken } from "../../utils/localStorageService";
import { message, Spin, Typography } from "antd";
import { useDispatch } from "react-redux";
import { getMyInfo, setIsAuthorized } from "../../redux/userSlice";

const { Text } = Typography;

export default function Authenticate() {
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
  const authCodeRegex = /code=([^&]+)/;
  const isMatch = window.location.href.match(authCodeRegex);

  if (isMatch) {
    const authCode = isMatch[1];

    fetch(`http://localhost:8080/api/v1/auth/outbound/authentication?code=${authCode}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.code === 1000) {
          const result = data.result;
          console.log("Authentication successful:", result);
          console.log("dakljfad;l", data)

          // 1. Kiểm tra trước: nếu cần verify email thì không gọi getMyInfo
          if (result.emailVerificationRequired) {
            localStorage.setItem("tempToken", result.token);
            localStorage.setItem("email", result.email);
            message.info("Mã OTP đã được gửi đến email của bạn!");
            navigate("/verify-otp");
            return;
          }

          // 2. Nếu không cần verify email, mới lưu token và getMyInfo
          setToken(result.token);
          dispatch(setIsAuthorized(true));

          const userInfoAction = await dispatch(getMyInfo());
          const userData = userInfoAction;

          // 3. Sau khi đã xác minh email, kiểm tra nếu chưa có password
          if (userData.payload?.result?.noPassword === true) {
            message.info("Hãy đặt mật khẩu mới cho tài khoản Google của bạn.");
            navigate("/set-password");
            return;
          }
          if (userData.payload?.result?.profileCompleted === false) {

            message.info("Chào mừng! Hãy hoàn thiện hồ sơ của bạn để bắt đầu.");
            navigate("/onboard");
          }

          message.success("Đăng nhập thành công!");
          navigate("/");

        } else {
          console.error("Authentication failed:", data);
          message.error("Đăng nhập thất bại!");
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error("Error during authentication:", error);
        message.error("Đăng nhập thất bại!");
        navigate("/login");
      });
    }
}, [dispatch, navigate]);



  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Spin size="large" />
      <Text style={{ fontSize: 16 }}>Authenticating...</Text>
    </div>
  );
}
