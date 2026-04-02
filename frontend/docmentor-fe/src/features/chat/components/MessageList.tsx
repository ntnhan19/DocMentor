// ============================================
// MessageList.tsx
// ============================================
import React, { useEffect, useRef } from "react";
import { ChatMessage } from "@/types/chat.types";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: ChatMessage[];
  isReplying: boolean;
  onEditMessage?: (id: string, text: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isReplying,
  onEditMessage,
}) => {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    //endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isReplying]);

  return (
    <div className="flex-1 py-6 space-y-6">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          onEditMessage={onEditMessage} // ✅ Truyền tiếp xuống Bubble
        />
      ))}

      {isReplying && (
        <div className="flex items-start justify-start gap-4 pl-2 animate-in fade-in duration-500">
          {/* AI Avatar Placeholder - Minimalist */}
          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-xl bg-white shadow-xl shadow-white/5 border border-white/10 group">
             <div className="w-2.5 h-2.5 bg-black rounded-full animate-pulse"></div>
          </div>

          {/* Typing Indicator Box - Apple Glass */}
          <div className="px-5 py-3.5 apple-glass border border-white/10 rounded-[22px] rounded-tl-none shadow-xl flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></span>
          </div>
        </div>
      )}

      <div ref={endOfMessagesRef} />
    </div>
  );
};
