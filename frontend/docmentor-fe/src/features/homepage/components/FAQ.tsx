import React, { useState } from "react";
import { FAQItem } from "../types/homepage.types";

const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>("1");

  const faqs: FAQItem[] = [
    {
      id: "1",
      question: "DocMentor là gì?",
      answer:
        "DocMentor là một nền tảng AI thông minh giúp bạn tương tác với tài liệu của mình. Bạn có thể tải lên tài liệu, đặt câu hỏi và nhận câu trả lời ngay lập tức từ nội dung tài liệu.",
      category: "general",
    },
    {
      id: "2",
      question: "Tôi có thể tải lên những loại tài liệu nào?",
      answer:
        "DocMentor hỗ trợ nhiều định dạng tài liệu phổ biến bao gồm PDF, DOCX, TXT, DOC, RTF và nhiều định dạng khác. Kích thước tệp tối đa là 50MB cho mỗi tài liệu.",
      category: "usage",
    },
    {
      id: "3",
      question: "Dữ liệu của tôi có được bảo mật không?",
      answer:
        "Chúng tôi rất coi trọng bảo mật dữ liệu. Tất cả tài liệu được mã hóa trong quá trình truyền tải và lưu trữ. Chỉ bạn mới có quyền truy cập vào tài liệu của mình và chúng tôi không sử dụng dữ liệu của bạn để huấn luyện AI.",
      category: "security",
    },
    {
      id: "4",
      question: "DocMentor có miễn phí không?",
      answer:
        "Chúng tôi cung cấp gói miễn phí với các tính năng cơ bản. Gói miễn phí cho phép bạn tải lên tối đa 10 tài liệu và 100 câu hỏi mỗi tháng. Các gói trả phí cung cấp nhiều tính năng và giới hạn cao hơn.",
      category: "pricing",
    },
    {
      id: "5",
      question: "Tôi có thể xóa tài liệu đã tải lên không?",
      answer:
        "Có, bạn có thể xóa bất kỳ tài liệu nào bạn đã tải lên bất cứ lúc nào. Khi xóa, tài liệu sẽ bị xóa vĩnh viễn khỏi hệ thống của chúng tôi.",
      category: "usage",
    },
    {
      id: "6",
      question: "AI của DocMentor hoạt động như thế nào?",
      answer:
        "Chúng tôi sử dụng các mô hình ngôn ngữ lớn (LLM) tiên tiến để phân tích và hiểu nội dung tài liệu. Khi bạn đặt câu hỏi, AI sẽ tìm kiếm thông tin liên quan trong tài liệu và cung cấp câu trả lời chính xác kèm theo nguồn trích dẫn.",
      category: "general",
    },
    {
      id: "7",
      question: "Tôi có thể sử dụng DocMentor trên điện thoại không?",
      answer:
        "Có, DocMentor được thiết kế responsive và hoạt động tốt trên mọi thiết bị bao gồm máy tính, máy tính bảng và điện thoại thông minh.",
      category: "usage",
    },
    {
      id: "8",
      question: "Làm thế nào để liên hệ hỗ trợ?",
      answer:
        "Bạn có thể liên hệ với đội ngũ hỗ trợ của chúng tôi qua email support@docmentor.com hoặc sử dụng tính năng chat trực tuyến trên website. Chúng tôi hỗ trợ 24/7.",
      category: "support",
    },
  ];

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 bg-[#0a0118] text-white relative overflow-hidden">
      {/* Background gradient overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at center, #8A42FF33 0%, transparent 70%)",
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Câu hỏi thường gặp
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Tìm câu trả lời cho những câu hỏi phổ biến về DocMentor
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-[#120826]/70 border border-[#2d1a47] rounded-lg overflow-hidden hover:border-[#8A42FF] transition-colors backdrop-blur-md"
              >
                {/* Question */}
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#1a0b2e] transition-colors"
                >
                  <span className="font-semibold text-white pr-8">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-6 h-6 text-[#8A42FF] flex-shrink-0 transition-transform duration-300 ${
                      openId === faq.id ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Answer */}
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    openId === faq.id
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  <div className="px-6 pb-5 text-gray-300 leading-relaxed border-t border-[#2d1a47] pt-4">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            Không tìm thấy câu trả lời bạn cần?
          </p>
          <button className="text-[#8A42FF] hover:text-[#a96fff] font-semibold hover:underline transition-all">
            Liên hệ với chúng tôi →
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
