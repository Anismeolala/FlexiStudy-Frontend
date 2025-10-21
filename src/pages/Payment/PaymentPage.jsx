import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentPage.css";
import vnpayLogo from "../../assets/img/vnpay.png";
import atmLogo from "../../assets/img/epay.png";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(location.state?.plan || null);

  useEffect(() => {
    if (!plan) {
      const savedPlan = localStorage.getItem("selectedPlan");
      if (savedPlan) {
        setPlan(JSON.parse(savedPlan));
      }
    }
  }, [plan]);

  if (!plan)
    return <p className="payment-error">Không tìm thấy gói nâng cấp.</p>;

  const handlePayment = (method) => {
    localStorage.setItem("selectedPlan", JSON.stringify(plan));

    if (method === "VNPAY") {
      navigate("/payment/vnpay", { state: { plan } });
    } else if (method === "ATM/Visa") {
      navigate("/payment/atm", { state: { plan } });
    }
  };

  return (
    <div className="payment-page">
      <button className="back-btn" onClick={() => navigate("/upgrade")}>
        ← Quay lại trang nâng cấp
      </button>

      <h2 className="payment-title">Thanh Toán nâng cấp Tài khoản</h2>

      <div className="payment-box">
        <h3>Chọn gói nâng cấp</h3>
        <div className="plan-list">
          <label className="plan-item selected">
            <input type="checkbox" checked readOnly />
            <span>
              Tài khoản <b>{plan.name}</b> —{" "}
              {plan.price.toLocaleString()}đ / {plan.durationInDays} ngày sử dụng
            </span>
          </label>
        </div>

        <h3>Chọn hình thức thanh toán</h3>
        <div className="payment-methods">
          <button
            className="payment-btn vnpay"
            onClick={() => handlePayment("VNPAY")}
          >
            <img src={vnpayLogo} alt="VNPAY" />
            Thanh toán bằng VNPAY
          </button>

          <button
            className="payment-btn atm"
            onClick={() => handlePayment("ATM/Visa")}
          >
            <img src={atmLogo} alt="ATM/Visa" />
            Thanh toán qua thẻ ATM/Visa
          </button>
        </div>
      </div>

      <div className="payment-footer">
        <p>
          Nếu có vấn đề về thanh toán và nâng cấp tài khoản, vui lòng liên hệ:{" "}
          <a href="mailto:hotrosinhvien@flexistudy.com">
            hotrosinhvien@flexistudy.com
          </a>{" "}
          hoặc hotline: <a href="tel:02478901234">(024) 7890 1234</a>
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
