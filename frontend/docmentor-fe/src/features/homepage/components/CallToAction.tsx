// CallToAction.tsx (Đã đồng bộ với nền tối)
import React from "react";
import { useNavigate } from "react-router-dom";

const CallToAction: React.FC = () => {
  const navigate = useNavigate();

  return (
    // Đổi nền từ bg-primary sang bg-background
    <section className="relative overflow-hidden py-20 bg-background text-white border-t border-accent">
           {" "}
      {/* Background Decorations - Vẫn dùng Secondary/Primary để tạo hiệu ứng */}
           {" "}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl opacity-70 animate-float"></div>
           {" "}
      <div
        className="absolute -bottom-10 -right-10 w-60 h-60 bg-primary/20 rounded-full blur-3xl opacity-70 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
           {" "}
      <div className="container mx-auto px-4 relative z-10">
               {" "}
        <div className="max-w-4xl mx-auto text-center">
                    {/* Heading */}         {" "}
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
                        Sẵn sàng làm việc thông minh hơn?          {" "}
          </h2>
                    {/* Description */}         {" "}
          <p
            className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
                        Tham gia cùng hàng ngàn người dùng đang sử dụng        
                <span className="font-bold text-primary">DocMentor</span> để tối
                        ưu hóa cách làm việc với tài liệu mỗi ngày.        
             {" "}
          </p>
                    {/* CTA Button - Đảo màu để nổi bật trên nền tối */}       
           {" "}
          <button
            onClick={() => navigate("/register")} // Sử dụng bg-primary và text-white
            className="bg-primary text-white px-10 py-4 rounded-lg font-bold text-lg 
            hover:bg-primary/90 transition-all shadow-xl hover:-translate-y-1 transform 
            ring-4 ring-primary/50 hover:ring-primary/80 animate-scale-up"
            style={{ animationDelay: "0.4s" }}
          >
                        Bắt đầu miễn phí ngay ✨          {" "}
          </button>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </section>
  );
};

export default CallToAction;
