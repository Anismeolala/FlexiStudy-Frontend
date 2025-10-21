  import React, { useEffect, useState } from "react";
  import { useNavigate, useLocation } from "react-router-dom";
  import { QRCodeCanvas } from "qrcode.react";
  import "./VnpayPaymentPage.css";
  import { createPayOSPaymentAPI } from "../../apis";

  const VnpayPaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [plan, setPlan] = useState(location.state?.plan || null);
    const [timeLeft, setTimeLeft] = useState(300);
    const [qrUrl, setQrUrl] = useState("");
    const [orderId, setOrderId] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
      if (!plan) {
        const savedPlan = localStorage.getItem("selectedPlan");
        if (savedPlan) {
          setPlan(JSON.parse(savedPlan));
        } else {
          alert("Không tìm thấy thông tin gói thanh toán.");
          navigate("/payment");
        }
      }
    }, [plan, navigate]);

       useEffect(() => {
      const createPayment = async () => {
        if (!plan) return;
    
        try {
          localStorage.setItem("pendingUpgradePlan", JSON.stringify({
            id: plan.id,
            name: plan.name,
            price: plan.price
          }));
    
          const numericOrderId = Date.now().toString();
          setOrderId(numericOrderId);
    
          const payload = {
            orderId: numericOrderId,
            amount: plan.price,
            description: `Thanh toán gói ${plan.name}`,
            cancelUrl: `${window.location.origin}/payment/cancel`,
            returnUrl: `${window.location.origin}/payment/success`
          };
    
          console.log("📌 Sending payment request:", payload);
          const response = await createPayOSPaymentAPI(payload);
          console.log("✅ Payment API response:", response);
    
          if (response?.data?.data?.checkoutUrl) {
            window.location.href = response.data.data.checkoutUrl;
          } else {
            throw new Error("Không nhận được URL thanh toán hợp lệ");
          }
    
        } catch (err) {
          console.error("❌ Payment creation error:", err);
          setError(err.response?.data?.message || "Không thể tạo thanh toán");
        }
      };
    
      createPayment();
    }, [plan]);
    
    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            alert("⚠️ QR code đã hết hạn, vui lòng thử lại!");
            navigate("/payment");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }, [navigate]);

    if (!plan) return <p>Đang tải thông tin gói...</p>;

    return (
      <div className="vnpay-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>

        <h2>Thanh toán qua PayOS</h2>

        <div className="vnpay-box">
          <div className="vnpay-qr">
            {error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : qrUrl ? (
              <QRCodeCanvas value={qrUrl} size={220} />
            ) : (
              <p>Đang tạo mã QR...</p>
            )}
          </div>

          <div className="vnpay-instructions">
            <h4>Hướng dẫn thanh toán</h4>
            <ol>
              <li>Mở ứng dụng ngân hàng của bạn</li>
              <li>Chọn "Quét mã" để quét mã QR</li>
              <li>Chọn "Xác nhận" để thanh toán</li>
            </ol>

            <p className="expire-text">
              Mã QR đơn hàng <span className="order-id">{orderId}</span> sẽ hết hạn sau{" "}
              <span className="time-left">{timeLeft}</span> giây.
            </p>

            <button className="cancel-btn center-btn" onClick={() => navigate("/payment")}>
              Hủy giao dịch
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default VnpayPaymentPage;