// Register Page
// src/pages/auth/RegisterPage.tsx
import React, { useState } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import RegisterForm from "../../features/auth/components/RegisterForm";
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../features/auth/hooks/useAuth';

const RegisterPage: React.FC = () => {
  // const navigate = useNavigate();
  // const { register } = useAuth();
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
      setError("");

      // TODO: Replace with actual API call
      console.log("Register data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Example API call (uncomment when backend is ready):
      // const response = await register({
      //   fullName: data.fullName,
      //   email: data.email,
      //   username: data.username,
      //   password: data.password
      // });
      //
      // if (response.success) {
      //   navigate('/login', {
      //     state: { message: 'Registration successful! Please login.' }
      //   });
      // }

      // For now, just log success
      alert(
        "Registration successful! (This is a mock - connect to your backend)"
      );
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Sign up to get started with DocMentor"
    >
      <RegisterForm
        onSubmit={handleRegister}
        isLoading={isLoading}
        error={error}
      />
    </AuthLayout>
  );
};

export default RegisterPage;
