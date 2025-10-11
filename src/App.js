import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login/Login";
import HomePage from "./pages/HomePage/HomePage";
import UserLayout from "./pages/layout/UserLayout";
import Jobs from "./pages/Job/Jobs";
import SavedJobs from "./pages/Job/SavedJobs";
import AppliedJobs from "./pages/Job/AppliedJobs";
import { getMyInfo } from './redux/userSlice';
import CVGuide from "./pages/CV/CVGuide";
import CVTemplates from "./pages/CV/CVTemplates";
import UploadCV from "./pages/CV/UploadCV";

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
        { path: "jobs/saved", element: <SavedJobs /> },
        { path: "jobs/applied", element: <AppliedJobs /> },
        { path: "cv/guide", element: <CVGuide /> },
        { path: "cv/templates", element: <CVTemplates /> },
        { path: "cv/upload", element: <UploadCV /> },
        { path: "career-guide", element: <CareerGuide /> },
        { path: "schedule", element: <Schedule /> },
        { path: "/profile", element: <EditProfile /> },
        { path: "/onboard", element: <FormOnboard /> },
        { path: "//jobs/:jobId", element: <JobDetailPage /> },
      ], 
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
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
  const [appReady, setAppReady] = useState(false); // ✅ Trạng thái khởi tạo App

  useEffect(() => {
    const initApp = async () => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        await dispatch(getMyInfo());
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
