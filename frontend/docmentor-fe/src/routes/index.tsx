// Main routing entry point
// src/routes/index.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/public/HomePage";
import NotFoundPage from "../pages/public/NotFoundPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
// import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
// import DashboardPage from "../pages/dashboard/DashboardPage";
// import ProfilePage from "../pages/dashboard/ProfilePage";
// import DocumentsPage from "../pages/dashboard/DocumentsPage";
// import SettingsPage from "../pages/dashboard/SettingsPage";
// Tạo router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />,
  },
  // Thêm các routes khác sau
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

// Component Router để sử dụng trong App
export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default router;
