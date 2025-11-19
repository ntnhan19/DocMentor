import React, { useState } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import RegisterForm from "../../features/auth/components/RegisterForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleRegister = async (data: {
    fullName: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
  }) => {
    try {
      setIsLoading(true);
      setError(""); // ⚠️ ĐÃ SỬA: Loại bỏ biến 'response' không cần thiết

      await register({
        fullName: data.fullName,
        email: data.email,
        username: data.username,
        password: data.password,
      }); // Điều hướng sau khi đăng ký thành công
      navigate("/login", {
        state: { message: "Đăng ký thành công! Vui lòng đăng nhập." },
      });
    } catch (err: any) {
      // Bắt lỗi từ API (ví dụ: email đã tồn tại)
      setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Sign up to get started with DocMentor"
    >
           {" "}
      <RegisterForm
        onSubmit={handleRegister}
        isLoading={isLoading}
        error={error}
      />
         {" "}
    </AuthLayout>
  );
};

export default RegisterPage;
