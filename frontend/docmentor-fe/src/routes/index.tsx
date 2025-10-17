// src/routes/index.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/public/HomePage";
import NotFoundPage from "../pages/public/NotFoundPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import UserLayout from "../components/layout/UserLayout"; // chú ý path đúng
import DashboardPage from "../pages/user/DashboardPage";

const router = createBrowserRouter([
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
  {
    path: "/user",
    element: <UserLayout />, // ✅ không truyền children nữa
    children: [
      {
        index: true, // /user
        element: <DashboardPage />,
      },
      // có thể thêm các route khác:
      // { path: "profile", element: <ProfilePage /> },
      // { path: "documents", element: <DocumentsPage /> },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default router;
