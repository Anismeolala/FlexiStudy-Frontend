import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login/Login";
import HomePage from "./pages/HomePage/HomePage";
import UserLayout from "./pages/layout/UserLayout";

import Jobs from "./pages/Job/Jobs";
import SavedJobs from "./pages/Job/SavedJobs";
import AppliedJobs from "./pages/Job/AppliedJobs";

import CVGuide from "./pages/CV/CVGuide";
import CVTemplates from "./pages/CV/CVTemplates";
import UploadCV from "./pages/CV/UploadCV";

import CareerGuide from "./pages/Career/CareerGuide";
import Schedule from "./pages/Schedules/Schedule";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "jobs", element: <Jobs /> },
      { path: "jobs/saved", element: <SavedJobs /> },
      { path: "jobs/applied", element: <AppliedJobs /> },
      { path: "cv/guide", element: <CVGuide /> },
      { path: "cv/templates", element: <CVTemplates /> },
      { path: "cv/upload", element: <UploadCV /> },
      { path: "career-guide", element: <CareerGuide /> },
      { path: "schedule", element: <Schedule /> },
    ],
  },
  { path: "/login", element: <Login /> },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
