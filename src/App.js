import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login/Login";
import HomePage from "./pages/HomePage/HomePage";
import UserLayout from "./pages/layout/UserLayout";
import Jobs from "./pages/Job/Jobs";
import AppliedJobs from "./pages/Job/AppliedJobs";
import { getMyInfo } from './redux/userSlice';
import CVGuide from "./pages/CV/CVGuide";
import CVTemplates from "./pages/CV/CVTemplates";

import CareerGuide from "./pages/Career/CareerGuide";
import Schedule from "./pages/Schedules/Schedule";
import AdminLayout from "./pages/layout/AdminLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import UserManagement from "./pages/UserManagement/UserManagement";
import CompanyManagement from "./pages/CompanyManagement/CompanyManagement";
import Register from "./pages/Register/Register";
import EditProfile from "./pages/EditProfile/EditProfile";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import RoleRoute from "./components/RoleRoute/RoleRoute";
import { ROLE } from "./utils/constants";
import JobMangement from "./pages/ManagementJob/JobManagement";
import FormOnboard from "./pages/FormOnboard/FormOnboard";
import JobDetailPage from "./pages/Job/JobDetailPage/JobDetailPage";
import SavedMyJob from "./pages/SavedJobPage/SavedJobPage";
import SavedJobPage from "./pages/SavedJobPage/SavedJobPage";
import MyCV from "./pages/MyCVPage/MyCV";
import Authenticate from "./pages/Authenticate/Authenticate";
import VerifyOtp from "./pages/Authenticate/VerifyOtp";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import VerifyForgotOtpPage from "./pages/ForgotPasswordPage/VerifyForgotOtpPage";
import ResetPasswordPage from "./pages/ForgotPasswordPage/ResetPasswordPage";
import SetPasswordPage from "./pages/Authenticate/SetPasswordPage";
import UpgradeAccountPage from "./pages/Upgrade/UpgradeAccountPage";
import PaymentPage from "./pages/Payment/PaymentPage";
import VnpayPaymentPage from "./pages/Payment/VnpayPaymentPage";
import PaymentSuccessPage from "./pages/Payment/PaymentSuccessPage";
import PaymentATMPage from "./pages/Payment/PaymentATMPage";
const route = createBrowserRouter([
  {
    path: "/",
    element: (<RoleRoute allowedRoles={[ROLE.USER, ROLE.ADMIN]}>
              <UserLayout />
            </RoleRoute>),
    children: 
      [
        { index: true, element: <HomePage /> },
        { path: "jobs", element: <Jobs /> },
        { path: "jobs/saved", element: <SavedJobPage /> },
        { path: "jobs/applied", element: <AppliedJobs /> },
        { path: "cv/guide", element: <CVGuide /> },
        { path: "cv/templates", element: <CVTemplates /> },
        { path: "cv/upload", element: <MyCV /> },
        { path: "career-guide", element: <CareerGuide /> },
        { path: "schedule", element: <Schedule /> },
        { path: "/profile", element: <EditProfile /> },
        { path: "/onboard", element: <FormOnboard /> },
        { path: "/jobs/:jobId", element: <JobDetailPage /> },
        { path: "upgrade", element: <UpgradeAccountPage /> },
        { path: "/payment", element: <PaymentPage /> }, 
        { path: "/payment/vnpay", element: <VnpayPaymentPage /> }, 
        { path: "/payment/success", element: <PaymentSuccessPage /> },         
        { path: "/payment/cancel", element: <PaymentPage /> },         
        { path: "/payment/atm", element: <PaymentATMPage /> },         
     
      ], 
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/authenticate", element: <Authenticate /> },
  { path: "/verify-otp", element: <VerifyOtp /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/verify-forgot-otp", element: <VerifyForgotOtpPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  { path: "/set-password", element: <SetPasswordPage /> },
  {
    path: "/admin",
    element: (<RoleRoute allowedRoles={[ ROLE.ADMIN]}>
              <AdminLayout />
            </RoleRoute>),
    children: 
      [
        { index: true, element: <Dashboard /> },
        { path: "manage-users", element: <UserManagement /> },
        { path: "manage-companies", element: <CompanyManagement /> },
        { path: "manage-jobs", element: <JobMangement /> },
      ], 
  },
]);

const App = () => {
  const dispatch = useDispatch();
  const [appReady, setAppReady] = useState(false); // Trạng thái khởi tạo App

  useEffect(() => {
    const initApp = async () => {
      const token = localStorage.getItem("accessToken");
      console.log("Access token:", token);
      if (token) {
        const result = await dispatch(getMyInfo()).unwrap();
       console.log("✅ user info loaded:", result);
      }
      setAppReady(true);
    };
    initApp();
  }, [dispatch]);

  if (!appReady) {
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
        Đang tải ứng dụng...
      </div>
    );
  }

  return <RouterProvider router={route} />;
};
export default App;
