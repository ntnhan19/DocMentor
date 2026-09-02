import { motion } from "framer-motion";
import { BrainCircuit, BookOpen, Shield, Zap, Search, PieChart } from "lucide-react";
import { Persona } from "../../pages/LandingPage";
import { personaContent } from "../../data/personaContent";

const features = [
  {
    id: "rag-qa",
    icon: <Search className="text-primary" size={24} />,
    title: "Hỏi đáp bằng RAG",
    description: "Nhận câu trả lời chính xác, theo ngữ cảnh, được hỗ trợ hoàn toàn bởi các trích dẫn tài liệu cụ thể.",
  },
  {
    id: "ai-analysis",
    icon: <BrainCircuit className="text-secondary" size={24} />,
    title: "AI Phân tích",
    description: "Tự động tạo tóm tắt toàn diện, trích xuất các khái niệm chính và tạo quiz trắc nghiệm.",
  },
  {
    id: "multi-role",
    icon: <BookOpen className="text-amber-500" size={24} />,
    title: "Đa vai trò",
    description: "Trải nghiệm và luồng công việc được thiết kế riêng cho Sinh viên, Giảng viên và Quản trị viên.",
  },
  {
    id: "secure-private",
    icon: <Shield className="text-emerald-500" size={24} />,
    title: "Bảo mật & Riêng tư",
    description: "Tài liệu của bạn được lưu trữ an toàn. Bạn có toàn quyền kiểm soát người được truy cập.",
  },
  {
    id: "advanced-analytics",
    icon: <PieChart className="text-rose-500" size={24} />,
    title: "Phân tích Nâng cao",
    description: "Theo dõi tương tác tài liệu, xu hướng câu hỏi và tiến độ học tập với Dashboard trực quan.",
  },
  {
    id: "lightning-fast",
    icon: <Zap className="text-purple-500" size={24} />,
    title: "Tốc độ chớp nhoáng",
    description: "Trải nghiệm AI phản hồi theo thời gian thực (streaming) và tìm kiếm ngữ nghĩa siêu tốc.",
  },
];

interface FeaturesSectionProps {
  persona: Persona;
}

export default function FeaturesSection({ persona }: FeaturesSectionProps) {
  const highlightedIds = personaContent[persona].highlightedFeatureIds;

  return (
    <section className="py-24 bg-accent/30" id="features">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">
            Mọi thứ bạn cần để học và dạy hiệu quả hơn
          </h2>
          <p className="text-text-muted text-lg mb-6">
            DocMentor kết hợp AI tiên tiến với giao diện trực quan để thay đổi cách bạn tương tác với tài liệu giáo dục.
          </p>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full font-medium text-sm border border-secondary/20">
            <span>🎯</span>
            Được đề xuất riêng cho {persona === "student" ? "Sinh viên" : "Giảng viên"}:
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const isHighlighted = highlightedIds.includes(feature.id);
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-2xl p-8 transition-all duration-300 ${
                  isHighlighted 
                    ? "bg-background border-2 border-primary shadow-lg scale-[1.02]" 
                    : "bg-background border border-border-color hover:border-primary/30 shadow-sm"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${isHighlighted ? "bg-primary/10" : "bg-accent"}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-text-main mb-3">{feature.title}</h3>
                <p className="text-text-muted leading-relaxed">{feature.description}</p>
                {isHighlighted && (
                  <div className="mt-4 inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                    Gợi ý cho bạn
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
