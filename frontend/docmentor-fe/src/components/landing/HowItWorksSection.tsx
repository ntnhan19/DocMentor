import { motion } from "framer-motion";
import { Upload, MessageSquare, Download } from "lucide-react";

const steps = [
  {
    icon: <Upload className="text-primary" size={32} />,
    title: "1. Tải tài liệu lên",
    description: "Tải file PDF, Word, hoặc văn bản của bạn lên hệ thống lưu trữ an toàn. Hỗ trợ nhiều file cùng lúc và sắp xếp theo thư mục.",
  },
  {
    icon: <MessageSquare className="text-secondary" size={32} />,
    title: "2. Phân tích & Trò chuyện với AI",
    description: "Hệ thống được cung cấp bởi Gemini sẽ phân tích tài liệu ngay lập tức. Bắt đầu trò chuyện, đặt câu hỏi, hoặc tạo tóm tắt.",
  },
  {
    icon: <Download className="text-primary" size={32} />,
    title: "3. Xuất kết quả",
    description: "Lưu quiz, tóm tắt, và các khái niệm chính do AI tạo ra thành file PDF đẹp mắt để ôn tập hoặc chia sẻ sau này.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-background" id="how-it-works">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">
            Cách hoạt động
          </h2>
          <p className="text-text-muted text-lg">
            Từ tài liệu thô đến thông tin hữu ích, chỉ trong 3 bước đơn giản.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-border-color -translate-y-1/2 z-0"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex-1 relative z-10"
            >
              <div className="bg-background border border-border-color p-8 rounded-2xl h-full shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6 mx-auto border-4 border-background">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-text-main text-center mb-3">{step.title}</h3>
                <p className="text-text-muted text-center">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
