import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

export default function ComparisonTable() {
  return (
    <section className="py-24 bg-background border-t border-border-color" id="comparison">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">
            Tại sao không dán thẳng vào ChatGPT?
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            DocMentor được thiết kế chuyên biệt cho môi trường học tập và xử lý tài liệu lớn, vượt qua những giới hạn của các công cụ chat AI thông thường.
          </p>
        </div>

        <div className="bg-background rounded-2xl border border-border-color shadow-lg overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 bg-accent/50 border-b border-border-color">
            <div className="p-6 md:p-8 font-bold text-text-main text-lg md:text-xl">
              Tính năng
            </div>
            <div className="p-6 md:p-8 text-center border-l border-border-color">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-lg md:text-xl">
                DocMentor
              </span>
            </div>
            <div className="p-6 md:p-8 text-center text-text-muted font-bold text-lg md:text-xl border-l border-border-color">
              ChatGPT (Thường)
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border-color">
            <Row 
              feature="Trích dẫn chính xác đến từng trang"
              docmentor={<Check icon="check" text="Có" />}
              chatgpt={<Check icon="x" text="Không" />}
            />
            <Row 
              feature="Xử lý nhiều tài liệu cùng lúc"
              docmentor={<Check icon="check" text="Có" />}
              chatgpt={<Check icon="alert" text="Giới hạn / Thủ công" />}
            />
            <Row 
              feature="Tạo quiz tự động từ tài liệu"
              docmentor={<Check icon="check" text="Có" />}
              chatgpt={<Check icon="x" text="Không" />}
            />
            <Row 
              feature="Độ dài tài liệu"
              docmentor={<Check icon="check" text="Không giới hạn" />}
              chatgpt={<Check icon="alert" text="Giới hạn context window" />}
            />
            <Row 
              feature="Theo dõi lịch sử học tập & Phân tích"
              docmentor={<Check icon="check" text="Có (Dashboard)" />}
              chatgpt={<Check icon="x" text="Không" />}
            />
            <Row 
              feature="Vai trò riêng cho Giảng viên (Analytics)"
              docmentor={<Check icon="check" text="Có" />}
              chatgpt={<Check icon="x" text="Không" />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ feature, docmentor, chatgpt }: { feature: string, docmentor: React.ReactNode, chatgpt: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 hover:bg-accent/20 transition-colors">
      <div className="p-4 md:p-6 text-text-main font-medium flex items-center">
        {feature}
      </div>
      <div className="p-4 md:p-6 text-center border-l border-border-color flex items-center justify-center">
        {docmentor}
      </div>
      <div className="p-4 md:p-6 text-center border-l border-border-color flex items-center justify-center text-text-muted">
        {chatgpt}
      </div>
    </div>
  );
}

function Check({ icon, text }: { icon: "check" | "x" | "alert", text: string }) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-2">
      {icon === "check" && <CheckCircle2 className="text-emerald-500" size={24} />}
      {icon === "x" && <XCircle className="text-rose-500/50" size={24} />}
      {icon === "alert" && <AlertTriangle className="text-amber-500" size={24} />}
      <span className={`font-medium text-sm md:text-base ${icon === "check" ? "text-text-main" : "text-text-muted"}`}>
        {text}
      </span>
    </div>
  );
}
