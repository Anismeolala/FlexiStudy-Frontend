import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleRoute = ({ allowedRoles, children }) => {
  const { isAuthorized, role, loading } = useSelector((state) => state.user);

  // ⏳ Khi user đang load từ API, chưa xác định quyền → đợi
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
        }}
      >
        Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;
