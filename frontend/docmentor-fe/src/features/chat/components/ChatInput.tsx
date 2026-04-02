// src/features/chat/components/ChatInput.tsx
import React, { useState } from "react";
import { useDocumentStatus } from "@/hooks/useDocumentStatus";
import { FiLoader, FiSend } from "react-icons/fi";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  selectedDocuments?: Array<{ id: string; title: string }>;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  selectedDocuments = [],
}) => {
  const [inputValue, setInputValue] = useState("");
  const { isProcessing } = useDocumentStatus(selectedDocuments);
  const isDisabled = isLoading || isProcessing;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isDisabled) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    // ✅ FIX: Nền trong suốt mờ (backdrop-blur) và border nhẹ
    <div className="p-4 pb-6 apple-glass border-t border-white/5 bg-black/40">
      {/* Processing Indicator */}
      {isProcessing && (
        <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold text-apple-accent bg-apple-accent/10 px-3 py-1.5 rounded-full animate-pulse w-fit border border-apple-accent/20">
          <FiLoader className="animate-spin" /> DocMentor đang đọc tài liệu...
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="relative flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-[22px] p-1.5 transition-all focus-within:border-white/20 focus-within:ring-4 focus-within:ring-white/[0.02] shadow-2xl"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={
            isProcessing ? "Đang xử lý dữ liệu..." : "Hỏi về nội dung tài liệu..."
          }
          className="flex-1 px-4 py-3 text-[15px] text-apple-text-main bg-transparent outline-none placeholder:text-apple-text-secondary/50 disabled:opacity-50"
          disabled={isDisabled}
        />

        <button
          type="submit"
          disabled={isDisabled || !inputValue.trim()}
          className="p-3 bg-white text-black rounded-full hover:bg-white/90 disabled:opacity-20 disabled:bg-white transition-all shadow-xl active:scale-95 group"
        >
          {isLoading ? (
            <FiLoader className="w-5 h-5 animate-spin" />
          ) : (
            <FiSend className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          )}
        </button>
      </form>

      <p className="text-[10px] text-apple-text-secondary/40 text-center mt-4 font-medium tracking-tight uppercase">
        AI có thể có sai sót. Hãy xác thực lại thông tin quan trọng.
      </p>
    </div>
  );
};
