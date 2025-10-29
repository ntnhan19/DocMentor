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
import DocumentsPage from "../pages/user/DocumentsPage";
import DocumentDetailPage from "@/pages/user/DocumentDetailPage";
import ChatPage from "@/pages/user/ChatPage";
import ProfilePage from "@/pages/user/ProfilePage";
import SettingsPage from "@/pages/user/SettingsPage";
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
  { path: "chat", element: <ChatPage /> },
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
          {
            path: "documents", // <-- Thêm route mới
            element: <DocumentsPage />,
          },
          {
            path: "documents/:documentId", // <-- Thêm route động
            element: <DocumentDetailPage />,
          },
          {
            path: "chat", // <-- Route cho trang chat chung
            element: <ChatPage />,
          },
          {
            path: "chat/:conversationId", // <-- Route cho một cuộc chat cụ thể (để dành)
            element: <ChatPage />,
          },
          // Có thể thêm các route khác:
          { path: "profile", element: <ProfilePage /> },
          { path: "settings", element: <SettingsPage /> },
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
