// src/features/homepage/components/Hero.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-background text-white overflow-hidden pt-24 pb-12">
      {/* Background radial gradient */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[100%] bg-radial-gradient opacity-20"
        style={{
          background: "radial-gradient(circle, #8A42FF 30%, transparent 70%)",
        }}
      ></div>

      <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Trợ lý AI thông minh cho
              <span className="block text-secondary mt-2">
                Tài liệu của bạn
              </span>
            </h1>

            <p className="text-lg md:text-xl text-text-muted mb-8 max-w-2xl mx-auto md:mx-0">
              Tìm kiếm, phân tích và trò chuyện với tài liệu của bạn một cách dễ
              dàng. DocMentor sử dụng AI tiên tiến để giúp bạn hiểu tài liệu
              nhanh hơn.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => navigate("/register")}
                className="bg-primary text-white font-semibold px-8 py-3 rounded-lg shadow-[0_0_15px_rgba(138,66,255,0.5)] hover:shadow-[0_0_25px_rgba(138,66,255,0.7)] transition-all transform hover:-translate-y-1"
              >
                Bắt đầu miễn phí
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-accent text-text-muted font-semibold px-8 py-3 rounded-lg hover:bg-opacity-70 hover:text-white transition-all"
              >
                Đăng nhập
              </button>
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="flex-1 hidden md:block">
            <div className="relative animate-float">
              <div className="bg-accent/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/10">
                <div className="aspect-square bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center opacity-80">
                  <svg
                    className="w-48 h-48 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-primary text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
                AI-Powered
              </div>
              <div className="absolute -bottom-4 -left-4 bg-secondary text-background px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
                Miễn phí
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
