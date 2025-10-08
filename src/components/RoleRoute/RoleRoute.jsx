import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * Bảo vệ route theo role
 * @param {string[]} allowedRoles - danh sách role được phép
 */
const RoleRoute = ({ allowedRoles, children }) => {
  const user = useSelector((state) => state.user);

  if (!user.isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Nếu có đăng nhập nhưng không đúng role → chuyển về trang phù hợp
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;
