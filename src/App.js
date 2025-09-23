import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login/Login";
import HomePage from "./pages/HomePage/HomePage";
import UserLayout from "./pages/layout/UserLayout";

const route = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: 
      [{ index: true, element: <HomePage /> }], // Default route
  },
  { path: "/login", element: <Login /> },

]);

const App = () => {
  return <RouterProvider router={route} />;
};
export default App;
