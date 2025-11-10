// src/routes/PrivateRoute.tsx
import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../app/providers/AuthProvider";

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Debug logging
  useEffect(() => {
    console.log("🔐 PrivateRoute Check:", {
      path: location.pathname,
      isAuthenticated,
      isLoading,
      user: user?.email,
    });
  }, [isAuthenticated, isLoading, location.pathname, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("❌ Not authenticated, redirecting to /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("✅ Authenticated, rendering protected content");
  return <Outlet />;
};

export default PrivateRoute;
