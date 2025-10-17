// src/pages/auth/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import LoginForm from "../../features/auth/components/LoginForm";
import { useAuth } from "../../app/providers/AuthProvider";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleLogin = async (data: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    try {
      setIsLoading(true);
      setError("");

      await login(data.email, data.password, data.rememberMe);

      // Navigate to dashboard on success
      navigate("/user/dashboard");
    } catch (err: any) {
      setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Chào Mừng Trở Lại"
      subtitle="Đăng nhập vào tài khoản của bạn để tiếp tục"
    >
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />

      {/* Demo Accounts Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm font-semibold text-blue-800 mb-2">
          Tài khoản demo:
        </p>
        <div className="space-y-1 text-xs text-blue-700">
          <p>
            <strong>User:</strong> user@example.com / 123456
          </p>
          <p>
            <strong>Admin:</strong> admin@example.com / admin123
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
