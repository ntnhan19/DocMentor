// src/features/homepage/components/Hero.tsx
// ============================================

import React, { useState } from "react";
import Button from "@/components/common/Button";
import { ChatContainer } from "@/features/chat/components/ChatContainer"; // ✨ 1. Import ChatContainer

const Hero = () => {
  // ✨ 2. Chỉ cần state để quản lý ID của cuộc trò chuyện
  const [conversationId, setConversationId] = useState<string | null>(null);

  // ✨ 3. Hàm để bắt đầu một cuộc trò chuyện mới
  const handleStartChat = () => {
    // Trong ứng dụng thật, bạn sẽ gọi API để tạo cuộc trò chuyện mới và nhận về ID
    // Ở đây, chúng ta chỉ tạo một ID giả để minh họa
    const newConversationId = `convo-hero-${Date.now()}`;
    setConversationId(newConversationId);
  };

  return (
    <section className="py-20 md:py-32 bg-background-dark">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        {/* === Left Content - Text & CTA === */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
            Trải nghiệm{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              DocMentor AI
            </span>
          </h1>
          <p className="text-lg md:text-xl text-text-muted mb-8">
            Hỏi đáp, tóm tắt và phân tích bất kỳ tài liệu nào. Trợ lý học tập
            thông minh của bạn.
          </p>
          <Button size="lg" className="px-8 py-4" onClick={handleStartChat}>
            Thử ngay bây giờ
          </Button>
        </div>

        {/* === Right Content - Chat UI === */}
        <div className="w-full max-w-lg mx-auto md:mx-0">
          <div className="bg-accent/20 border border-primary/20 rounded-2xl shadow-2xl shadow-primary/10 backdrop-blur-lg flex flex-col h-[500px]">
            {/* ✨ 4. Hiển thị có điều kiện */}
            {!conversationId ? (
              // Trạng thái mời bắt đầu chat
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="p-4 bg-primary/20 rounded-full mb-4">
                  <svg
                    className="w-12 h-12 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Sẵn sàng để khám phá?
                </h3>
                <p className="text-text-muted mb-6">
                  Nhấn nút bên dưới để bắt đầu cuộc trò chuyện với AI.
                </p>
                <Button onClick={handleStartChat}>Bắt đầu trò chuyện</Button>
              </div>
            ) : (
              // Khi đã có ID, hiển thị ChatContainer
              <ChatContainer conversationId={conversationId} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
