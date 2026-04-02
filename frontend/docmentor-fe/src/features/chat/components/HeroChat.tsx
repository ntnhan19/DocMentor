// src/features/chat/components/HeroChat.tsx
import React, { useState } from "react";
import { FiSend, FiLoader } from "react-icons/fi";

interface HeroChatProps {
  onStartChat: (message: string) => Promise<void>;
}

const HeroChat: React.FC<HeroChatProps> = ({ onStartChat }) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    setIsLoading(true);
    await onStartChat(inputValue);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center max-w-4xl mx-auto">
      <div className="mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <h1 className="mb-5 text-5xl md:text-7xl font-bold tracking-tight text-apple-primary">
          DocMentor
        </h1>
        <p className="max-w-xl mx-auto text-[17px] md:text-lg text-apple-text-secondary font-medium leading-relaxed">
          Trợ lý AI học tập thông minh. <br className="hidden md:block" /> 
          Chọn tài liệu và bắt đầu khám phá ngay hôm nay.
        </p>
      </div>

      <div className="w-full max-w-2xl animate-in zoom-in-95 fade-in duration-1000 delay-300">
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Bạn muốn tìm hiểu gì hôm nay?"
            className="w-full bg-white/[0.03] apple-glass border border-white/10 rounded-[28px] px-8 py-6 text-[18px] text-apple-text-main shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] focus:border-white/20 focus:outline-none transition-all placeholder:text-apple-text-secondary/30"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="absolute p-3.5 text-black transition-all -translate-y-1/2 right-4 top-1/2 bg-white rounded-full hover:scale-105 active:scale-95 disabled:opacity-0 disabled:scale-75 shadow-lg"
          >
            {isLoading ? (
              <FiLoader className="w-5 h-5 animate-spin" />
            ) : (
              <FiSend className="w-5 h-5" />
            )}
          </button>
        </form>
        
        {/* Suggestion Quick Chips */}
        <div className="flex flex-wrap justify-center gap-3 mt-10 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 fill-mode-forwards">
          {["Tóm tắt tài liệu", "Giải đáp thắc mắc", "Phân tích số liệu"].map((chip) => (
            <button 
              key={chip}
              onClick={() => setInputValue(chip)}
              className="px-5 py-2.5 rounded-full apple-glass border-white/5 text-[13px] text-apple-text-secondary hover:text-apple-primary hover:border-white/20 transition-all font-medium"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroChat;