import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentATMPage.css";
import epayLogo from "../../assets/img/epay.png";
import visaLogo from "../../assets/img/visa.png";

const PaymentATMPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(location.state?.plan || null);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cardName, setCardName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!plan) {
      const saved = localStorage.getItem("selectedPlan");
      if (saved) setPlan(JSON.parse(saved));
    }
  }, [plan]);

  if (!plan) return <p className="payment-error">Không tìm thấy gói nâng cấp.</p>;

  const validate = () => {
    if (!cardNumber.match(/^\d{12,19}$/)) return "Số thẻ không hợp lệ (12-19 chữ số).";
    if (!expiry.match(/^\d{2}\/\d{2}$/)) return "Ngày MM/YY không hợp lệ.";
    if (!cardName.trim()) return "Vui lòng nhập tên chủ thẻ.";
    return "";
  };

  const handleNext = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setLoading(true);
    setTimeout(() => {
      const orderCode = `ATM${Date.now()}`;
      navigate(`/payment/success?status=PAID&orderCode=${orderCode}`);
    }, 1000);
  };

  return (
    <div className="atm-page">
      <h2>Thanh toán bằng thẻ ePay / Visa</h2>
      <button className="back-link" onClick={() => navigate("/payment")}>
        ← Quay lại
      </button>

      <div className="atm-container">
        <div className="atm-column atm-left">
          <div className="card-option active">
            <img src={epayLogo} alt="ePay" />
            <span>Thẻ ePay</span>
          </div>
          <div className="card-option">
            <img src={visaLogo} alt="Visa" />
            <span>Thẻ Visa</span>
          </div>
        </div>

        <div className="atm-column atm-center">
          <form className="atm-form" onSubmit={handleNext}>
            <label>
              Số thẻ
              <input
                type="text"
                placeholder="Số thẻ"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ""))}
              />
            </label>

            <label>
              Ngày phát hành
              <input
                type="text"
                placeholder="MM/YY (Ngày phát hành)"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
            </label>

            <label>
              Tên chủ thẻ
              <input
                type="text"
                placeholder="Tên chủ thẻ (có dấu cách)"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </label>

            {error && <div className="error-text">{error}</div>}

            <p className="note">
              Vui lòng không đóng cửa sổ thanh toán sau khi nhập OTP. Quý khách cần đăng ký Internet
              Banking hoặc thẻ Visa/ePay hỗ trợ thanh toán online.
            </p>

            <div className="atm-actions">
              <button type="button" className="cancel-btn" onClick={() => navigate("/payment")}>
                Hủy giao dịch
              </button>
              <button type="submit" className="next-btn" disabled={loading}>
                {loading ? "Đang xử lý..." : "Tiếp theo"}
              </button>
            </div>
          </form>
        </div>

        <div className="atm-column atm-right">
          <h3>Thông tin đơn hàng</h3>
          <div className="order-detail">
            <p>
              <strong>Mã đơn hàng:</strong>
              <br />
              FlexiStudy{Date.now().toString().slice(-6)}
            </p>
            <p>
              <strong>Nhà cung cấp dịch vụ:</strong>
              <br />
              FlexiStudy Viet Nam
            </p>
            <p>
              <strong>Giá trị thanh toán:</strong>
              <br />
              <span className="price">{plan.price.toLocaleString()} VND</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentATMPage;
