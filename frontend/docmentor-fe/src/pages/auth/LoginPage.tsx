import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import GoogleOAuthButton from "../../features/auth/components/GoogleOAuthButton";
import { useAuth } from "../../app/providers/AuthProvider";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, isAuthenticated, isLoading } = useAuth();
  const [error, setError] = useState<string>("");

  // Tự động chuyển trang nếu đã login
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/user/chat", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleSuccess = useCallback(async (credential: string) => {
    try {
      setError("");
      await loginWithGoogle(credential);
    } catch (err: any) {
      console.error("❌ LoginPage handleGoogleSuccess error:", err);
      setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    }
  }, [loginWithGoogle]);

  return (
    <AuthLayout
      title="Chào mừng trở lại"
      subtitle="Bắt đầu quản lý tài liệu học tập thông minh"
    >
      <div className="w-full space-y-8 relative">
        {/* Loading Overlay - Apple Glass */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md rounded-3xl animate-in fade-in duration-300">
            <div className="w-12 h-12 border-[3px] border-white/10 border-t-white rounded-full animate-spin"></div>
            <p className="mt-4 text-[13px] font-semibold text-white/80 tracking-wide">Đang xác thực...</p>
          </div>
        )}

        {/* Thông báo lỗi nếu có */}
        {error && (
          <div className="p-4 text-xs font-semibold text-white bg-red-500/10 border border-red-500/20 rounded-2xl animate-fade-in text-center">
            {error}
          </div>
        )}

        {/* Nút Google to bự - Option chính */}
        <div className="py-2 transform transition-all hover:scale-[1.01] active:scale-[0.99]">
          <GoogleOAuthButton
            onSuccess={handleGoogleSuccess}
            onError={(msg) => setError(msg)}
          />
        </div>

        {/* Divider tinh tế */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-[0.2em]">
            <span className="px-4 text-white/20 bg-transparent">
              Cổng thông tin nội bộ
            </span>
          </div>
        </div>

        {/* Note nhỏ thay vì form đăng ký */}
        <p className="px-6 text-[11px] text-center text-white/20 font-medium leading-relaxed">
          Hệ thống sẽ tự động khởi tạo không gian làm việc mới dựa trên hồ sơ Google của bạn nếu đây là lần đầu truy cập.
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
