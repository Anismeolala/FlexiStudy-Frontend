import React, { useEffect, useState } from "react";
import "./UpgradeAccountPage.css";
import { getAllUpgradePlansAPI, getMyInfoAPI } from "../../apis";
import { useNavigate } from "react-router-dom";

const UpgradeAccountPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("Free");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansData, userData] = await Promise.all([
          getAllUpgradePlansAPI(),
          getMyInfoAPI(),
        ]);

        setPlans(plansData);
        const planName = userData?.result?.upgradePlan?.name || "Free";
        setCurrentPlan(planName);
        console.log("👤 Current plan:", planName);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  const handleUpgrade = (plan) => {
    navigate("/payment", { state: { plan } });
  };

  return (
    <div className="upgrade-account-container">
      <div className="upgrade-header-box">
        <h1 className="upgrade-title">Nâng cấp tài khoản</h1>
        <p className="upgrade-description">Mở khóa nhiều quyền lợi hơn</p>
      </div>

      <div className="upgrade-options">
        {plans.map((plan) => {
          const isCurrent = currentPlan.toLowerCase() === plan.name.toLowerCase();
          const isFree = plan.name.toLowerCase() === "free";
          const isUpgraded = ["premium", "pro"].includes(currentPlan.toLowerCase());

          return (
            <div
              key={plan.id}
              className={`upgrade-card ${plan.name.toLowerCase()} ${
                isFree && isUpgraded ? "disabled-card" : ""
              }`}
            >
              <h3>{plan.name}</h3>
              <p>{plan.price > 0 ? `${plan.price.toLocaleString()}đ / tháng` : "Miễn phí"}</p>
              <ul>
                <li>Thời hạn: {plan.durationInDays} ngày</li>
                <li>Mô tả: {plan.description || "Không có mô tả"}</li>
              </ul>

              {isCurrent ? (
                <button disabled>Đang sử dụng</button>
              ) : isFree && isUpgraded ? (
                <button className="upgrade-btn disabled" disabled>
                  Nâng cấp ngay
                </button>
              ) : (
                <button
                  className="upgrade-btn"
                  onClick={() => handleUpgrade(plan)}
                  disabled={loading}
                >
                  Nâng cấp ngay
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpgradeAccountPage;
