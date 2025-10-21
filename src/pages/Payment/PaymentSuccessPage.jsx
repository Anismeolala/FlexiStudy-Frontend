import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { handlePaymentCallbackAPI, getMyInfoAPI } from "../../apis";
import "./PaymentSuccessPage.css";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handlePayment = async () => {
      try {
        const params = new URLSearchParams(location.search);
        let status = params.get("status") || "failed";
        const orderCode = params.get("orderCode") || params.get("order_code");

        if (status.toUpperCase() === "PAID") status = "success";

        const userInfo = await getMyInfoAPI();
        const userId = userInfo?.result?.id;
        if (!userId) throw new Error("Không lấy được userId từ API myInfo");

        const pendingPlan = JSON.parse(localStorage.getItem("pendingUpgradePlan") || "{}");

        if (!orderCode) throw new Error("Không tìm thấy mã đơn hàng");
        if (status === "success" && !pendingPlan?.id)
          throw new Error("Không tìm thấy thông tin gói nâng cấp");

        const payload = {
          orderCode,
          status,
          amount: pendingPlan.price || 0,
          transactionId: orderCode,
          userId,
          planId: pendingPlan.id,
        };

        await handlePaymentCallbackAPI(payload);
        localStorage.removeItem("pendingUpgradePlan");

        console.log(" Callback xử lý thành công");
      } catch (err) {
        console.error("Payment page error:", err);
        setError(err.message || "Xảy ra lỗi khi xác nhận thanh toán");
      } finally {
        setLoading(false);
      }
    };

    handlePayment();
  }, [location]);

  if (loading)
    return (
      <div className="payment-status loading">
        <div className="spinner"></div>
        <p>⏳ Đang xác nhận thanh toán...</p>
      </div>
    );

  if (error)
    return (
      <div className="payment-status error">
        <h2>❌ Có lỗi xảy ra</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/")}>Quay lại trang chủ</button>
      </div>
    );

  return (
    <div className="payment-status success">
      <div className="success-icon">🎉</div>
      <h2>Thanh toán thành công!</h2>
      <p>Cảm ơn bạn đã nâng cấp gói dịch vụ 🎊</p>
      <p>Trải nghiệm ngay để tận hưởng toàn bộ tính năng cao cấp.</p>
      <button className="experience-btn" onClick={() => navigate("/")}>
        🚀 Trải nghiệm ngay
      </button>
    </div>
  );
};

export default PaymentSuccessPage;
