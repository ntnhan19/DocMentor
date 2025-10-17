// src/features/homepage/components/HowItWorks.tsx
import React from "react";
import { HowItWorksStep } from "../types/homepage.types";

const HowItWorks: React.FC = () => {
  const steps: HowItWorksStep[] = [
    {
      id: "1",
      step: 1,
      title: "Tải lên tài liệu",
      description:
        "Kéo và thả tài liệu của bạn ở bất kỳ định dạng nào: PDF, DOCX, TXT...",
      icon: "📤",
    },
    {
      id: "2",
      step: 2,
      title: "AI xử lý tài liệu",
      description:
        "Hệ thống AI của chúng tôi sẽ phân tích và hiểu nội dung chỉ trong vài giây.",
      icon: "🤖",
    },
    {
      id: "3",
      step: 3,
      title: "Đặt câu hỏi",
      description:
        "Bắt đầu trò chuyện và đặt bất kỳ câu hỏi nào về nội dung tài liệu của bạn.",
      icon: "💭",
    },
    {
      id: "4",
      step: 4,
      title: "Nhận câu trả lời",
      description:
        "Nhận câu trả lời chính xác, kèm theo nguồn trích dẫn từ tài liệu gốc.",
      icon: "✨",
    },
  ];

  return (
    <section className="py-20 bg-accent" id="how-it-works">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Cách hoạt động
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Chỉ với 4 bước đơn giản để làm chủ tài liệu của bạn
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mx-auto text-4xl border-4 border-primary/50">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 md:right-10 lg:right-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  {step.step}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-3 mt-6">
                {step.title}
              </h3>
              <p className="text-text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
