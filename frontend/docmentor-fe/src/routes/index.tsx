// src/routes/index.tsx
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
//import HomePage from "../pages/public/HomePage";
import NotFoundPage from "../pages/public/NotFoundPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import UserLayout from "../components/layout/UserLayout";
import GuestLayout from "../components/layout/GuestLayout"; // ✨ IMPORT MỚI
import DashboardPage from "../pages/user/DashboardPage";
import PrivateRoute from "./PrivateRoute";
import DocumentsPage from "../pages/user/DocumentsPage";
import DocumentDetailPage from "@/pages/user/DocumentDetailPage";
import ChatPage from "@/pages/user/ChatPage";
import ProfilePage from "@/pages/user/ProfilePage";
import SettingsPage from "@/pages/user/SettingsPage";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
// import AdminDocumentsPage from "@/pages/admin/AdminDocumentsPage";
// import AdminUsersPage from "@/pages/admin/AdminUsersPage";
const router = createBrowserRouter([
  // ✨ THAY ĐỔI: / route chuyển thành ChatPage cho guest
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        index: true,
        element: <ChatPage />, // ✨ Hiển thị ChatPage thay vì HomePage
      },
    ],
  },

  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

  // ✨ GUEST CHAT ROUTES (GuestLayout - Full width, no sidebar)
  {
    element: <GuestLayout />,
    children: [
      {
        path: "/chat",
        element: <ChatPage />, // ChatPage cho guest (session-based)
      },
      {
        path: "/chat/:conversationId",
        element: <ChatPage />, // Guest có thể bookmark link
      },
    ],
  },

  // === Protected User Routes ===
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/user",
        element: <UserLayout />, // UserLayout với Sidebar
        children: [
          { index: true, element: <Navigate to="/user/chat" replace /> },
          { path: "dashboard", element: <DashboardPage /> },
          { path: "documents", element: <DocumentsPage /> },
          { path: "documents/:documentId", element: <DocumentDetailPage /> },
          {
            path: "chat",
            element: <ChatPage />, // ChatPage cho user (conversation + sidebar)
          },
          { path: "chat/:conversationId", element: <ChatPage /> }, // ✨ User bookmark conversation
          { path: "profile", element: <ProfilePage /> },
          { path: "settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
  // ✅ THÊM PHẦN ADMIN MỚI VÀO ĐÂY
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <AdminDashboardPage />,
      },
      // {
      //   path: "documents",
      //   element: <AdminDocumentsPage />,
      // },
      // {
      //   path: "users",
      //   element: <AdminUsersPage />,
      // },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default router;
