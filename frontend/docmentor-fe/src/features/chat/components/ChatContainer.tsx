// ============================================
// ChatContainer.tsx (ĐÃ CẬP NHẬT)
// ============================================
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // ✨ 1. Import hook để đọc sessionId
import { ChatMessage } from "@/types/chat.types";
import { chatService } from "@/services/chat/chatService";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { SuggestedQueries } from "./SuggestedQuestions";

interface ChatContainerProps {
  conversationId: string | null;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  conversationId,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestedQueries, setSuggestedQueries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  // ✨ 2. Lấy sessionId từ URL (dành cho luồng của Guest)
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  useEffect(() => {
    const loadData = async () => {
      if (conversationId) {
        setIsLoading(true);
        const history = await chatService.getChatHistory(conversationId);
        setMessages(history);
        setIsLoading(false);
      } else if (!sessionId) {
        // Chỉ tải gợi ý khi không có context nào
        setMessages([]);
        const queries = await chatService.getSuggestedQueries();
        setSuggestedQueries(queries);
      }
    };
    loadData();
  }, [conversationId, sessionId]);

  // ✨ 3. Cập nhật hàm handleSendMessage để nhận thêm file
  const handleSendMessage = async (messageText: string, file?: File) => {
    // Kịch bản 1: Gửi tin nhắn KÈM file
    if (file) {
      await handleSendMessageWithFile(messageText, file);
      return;
    }

    // Kịch bản 2: Gửi tin nhắn văn bản thông thường (logic cũ của bạn)
    if (!conversationId) {
      console.error(
        "Không có cuộc trò chuyện nào đang hoạt động để gửi tin nhắn."
      );
      return;
    }

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      text: messageText,
      sender: "user",
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    const aiMessageId = `msg-ai-${Date.now()}`;
    const initialAiMessage: ChatMessage = {
      id: aiMessageId,
      text: "",
      sender: "ai",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage, initialAiMessage]);
    setIsReplying(true);
    try {
      await chatService.sendMessage(conversationId, messageText, (chunk) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, text: msg.text + chunk } : msg
          )
        );
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsReplying(false);
    }
  };

  // ✨ 4. Hàm mới để xử lý việc gửi tin nhắn và file
  const handleSendMessageWithFile = async (messageText: string, file: File) => {
    setIsReplying(true);

    const userMessageText = messageText || `Phân tích file: ${file.name}`;
    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      text: userMessageText,
      sender: "user",
      timestamp: new Date().toISOString(),
      status: "sent",
      attachment: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      },
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const aiResponse = await chatService.sendMessageWithFile({
        message: messageText,
        file: file,
        conversationId: conversationId,
        sessionId: sessionId,
      });
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Lỗi khi gửi file:", error);
      const errorMessage: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        text: "Rất tiếc, đã có lỗi xảy ra khi phân tích file của bạn. Vui lòng thử lại.",
        sender: "ai",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsReplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
               {" "}
        <div className="relative w-16 h-16 mb-4">
                   {" "}
          <div className="absolute inset-0 rounded-full border-4 border-primary/30"></div>
                   {" "}
          <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
                 {" "}
        </div>
               {" "}
        <p className="text-text-muted font-medium">
                    Đang tải cuộc trò chuyện...        {" "}
        </p>
             {" "}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
           {" "}
      <div className="flex-1 overflow-y-auto">
        {/* ✨ 5. Cập nhật logic hiển thị màn hình chờ */}       {" "}
        {messages.length === 0 && !conversationId && !sessionId ? (
          <SuggestedQueries
            queries={suggestedQueries}
            onQueryClick={(q) => handleSendMessage(q)}
            isLoading={isReplying}
          />
        ) : (
          <MessageList messages={messages} isReplying={isReplying} />
        )}
             {" "}
      </div>
           {" "}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isReplying} /> 
       {" "}
    </div>
  );
};
