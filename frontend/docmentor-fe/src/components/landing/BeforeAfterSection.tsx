import { motion } from "framer-motion";
import { Clock, Zap } from "lucide-react";
import { Persona } from "../../pages/LandingPage";

interface BeforeAfterSectionProps {
  persona: Persona;
}

export default function BeforeAfterSection({ persona }: BeforeAfterSectionProps) {
  const content = {
    student: {
      before: "3 tiếng lật lại 200 trang giáo trình để tìm một công thức, rồi vẫn không chắc mình nhớ đúng.",
      after: "8 giây. Hỏi thẳng, nhận câu trả lời kèm chính xác số trang để đối chiếu lại nếu cần."
    },
    lecturer: {
      before: "Đọc từng bài nộp, từng câu hỏi trên lớp để đoán xem sinh viên đang vướng ở đâu.",
      after: "Dashboard cho thấy ngay 85% câu hỏi tập trung vào Chương 4 - biết chính xác cần ôn lại phần nào."
    }
  };

  const data = content[persona];

  return (
    <section className="py-24 bg-background overflow-hidden relative">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-8 items-stretch">
          {/* Before */}
          <motion.div
            key={`before-${persona}`}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex-1 bg-accent/30 rounded-3xl p-8 md:p-12 border border-border-color/50 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Clock size={120} />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-background text-text-muted rounded-full text-sm font-semibold border border-border-color mb-6">
                <Clock size={14} />
                Trước đây
              </div>
              <p className="text-xl md:text-2xl text-text-muted leading-relaxed font-medium">
                "{data.before}"
              </p>
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            key={`after-${persona}`}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/20 relative overflow-hidden group shadow-[0_0_40px_rgba(var(--primary),0.1)]"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 text-primary group-hover:opacity-10 transition-opacity group-hover:scale-110 duration-500">
              <Zap size={120} />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-white rounded-full text-sm font-semibold shadow-md shadow-primary/20 mb-6">
                <Zap size={14} />
                Bây giờ
              </div>
              <p className="text-xl md:text-2xl text-text-main leading-relaxed font-semibold">
                "{data.after}"
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
