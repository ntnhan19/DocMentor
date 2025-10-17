import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0118] text-white relative overflow-hidden">
      {/* Hiệu ứng ánh sáng radial như Hero */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #8A42FF 30%, transparent 70%)",
        }}
      ></div>

      {/* Header */}
      <Header hideAuthButtons />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 text-gray-900">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">{title}</h1>
              {subtitle && <p className="text-gray-600">{subtitle}</p>}
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
            </div>

            {/* Form Content */}
            {children}
          </div>

          {/* Footer Text */}
          <p className="text-center text-sm text-gray-400 mt-6">
            By continuing, you agree to DocMentor’s{" "}
            <Link
              to="/terms"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
