// src/features/homepage/components/Features.tsx
import React from "react";
import { Feature } from "../types/homepage.types";

const Features: React.FC = () => {
  const features: Feature[] = [
    {
      id: "1",
      icon: "🔍",
      title: "Tìm kiếm thông minh",
      description:
        "Tìm kiếm nhanh chóng thông tin trong hàng trăm tài liệu với công nghệ AI tiên tiến.",
    },
    {
      id: "2",
      icon: "💬",
      title: "Trò chuyện với tài liệu",
      description:
        "Đặt câu hỏi và nhận câu trả lời ngay lập tức từ nội dung tài liệu của bạn.",
    },
    {
      id: "3",
      icon: "📊",
      title: "Phân tích nội dung",
      description:
        "Tóm tắt, phân tích và rút trích thông tin quan trọng từ tài liệu tự động.",
    },
    {
      id: "4",
      icon: "🔒",
      title: "Bảo mật cao",
      description:
        "Dữ liệu của bạn được mã hóa và bảo vệ với các tiêu chuẩn bảo mật cao nhất.",
    },
    {
      id: "5",
      icon: "⚡",
      title: "Xử lý nhanh",
      description:
        "Tải lên và xử lý tài liệu chỉ trong vài giây với hiệu suất cao.",
    },
    {
      id: "6",
      icon: "🌐",
      title: "Đa định dạng",
      description:
        "Hỗ trợ nhiều định dạng tài liệu: PDF, DOCX, TXT, và nhiều hơn nữa.",
    },
  ];

  return (
    <section className="py-20 bg-background" id="features">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Tính năng nổi bật
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            DocMentor cung cấp đầy đủ công cụ bạn cần để làm việc hiệu quả với
            tài liệu
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-accent rounded-xl p-8 border border-white/10 transition-all duration-300 hover:border-primary hover:-translate-y-2 cursor-pointer"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <span className="text-4xl">{feature.icon}</span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
