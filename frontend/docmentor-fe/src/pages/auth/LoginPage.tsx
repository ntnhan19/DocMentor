// src/pages/auth/LoginPage.tsx
import React, { useState } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import LoginForm from "../../features/auth/components/LoginForm";
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../features/auth/hooks/useAuth';

const LoginPage: React.FC = () => {
  // const navigate = useNavigate();
  // const { login } = useAuth();
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

      // TODO: Replace with actual API call
      console.log("Login data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Example API call (uncomment when backend is ready):
      // const response = await login(data.email, data.password, data.rememberMe);
      // if (response.success) {
      //   navigate('/dashboard');
      // }

      // For now, just log success
      alert("Login successful! (This is a mock - connect to your backend)");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
    >
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
    </AuthLayout>
  );
};

export default LoginPage;
