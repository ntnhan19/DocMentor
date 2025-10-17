// src/routes/index.tsx
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import HomePage from "../pages/public/HomePage";
import NotFoundPage from "../pages/public/NotFoundPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import UserLayout from "../components/layout/UserLayout";
import DashboardPage from "../pages/user/DashboardPage";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
  // Public Routes
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  // Auth Routes (chỉ truy cập khi chưa login)
  /*{
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },*/

  // Protected User Routes
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/user",
        element: <UserLayout />,
        children: [
          {
            index: true, // /user
            element: <Navigate to="/user/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          // Có thể thêm các route khác:
          // { path: "profile", element: <ProfilePage /> },
          // { path: "documents", element: <DocumentsPage /> },
          // { path: "chat", element: <ChatPage /> },
        ],
      },
    ],
  },

  // 404 Page
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default router;
