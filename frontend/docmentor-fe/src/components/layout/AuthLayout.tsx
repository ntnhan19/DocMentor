import React from "react";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen flex flex-col bg-black text-white relative overflow-hidden">
      {/* Background Effects (Subtle Monochrome) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[100px]"></div>
        
        {/* Subtle Grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Header - Fixed & Apple Glass */}
      <header className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center">
        <div className="container px-6 mx-auto">
          <Link
            to="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80 w-fit"
          >
            <img
              src="/assets/logo.png"
              alt="DocMentor Logo"
              className="object-contain w-8 h-8 invert"
            />
            <span className="text-2xl font-bold tracking-tight text-white/90">DocMentor</span>
          </Link>
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <main className="relative z-10 flex items-center justify-center flex-1 px-4 py-20 overflow-y-auto">
        <div className="w-full max-w-md my-8">
          {/* Card Container - Apple Glass Style */}
          <div className="p-8 space-y-8 apple-glass border border-white/5 rounded-[32px] shadow-2xl">
            {/* Header */}
            <div className="space-y-3 text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[15px] text-white/40 font-medium">{subtitle}</p>
              )}
            </div>

            {/* Form Content */}
            <div className="pt-2">{children}</div>
          </div>

          {/* Footer Text */}
          <p className="px-4 mt-8 text-[12px] text-center text-white/20 font-medium leading-relaxed">
            Bằng việc tiếp tục, bạn đồng ý với{" "}
            <Link
              to="/terms"
              className="text-white/40 underline hover:text-white transition-colors"
            >
              Điều khoản dịch vụ
            </Link>{" "}
            và{" "}
            <Link
              to="/privacy"
              className="text-white/40 underline hover:text-white transition-colors"
            >
              Chính sách bảo mật
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
