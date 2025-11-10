// src/features/chat/components/ChatContainer.tsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ChatMessage, Conversation } from "@/types/chat.types";
import { chatService } from "@/services/chat/chatService";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { SuggestedQueries } from "./SuggestedQuestions";
import { useAuth } from "@/app/providers/AuthProvider";
import Hero from "@/features/homepage/components/Hero";

interface ChatContainerProps {
  conversationId: string | null;
  sessionId?: string | null;
  onNewConversation?: (conversation: Conversation) => void;
  onCreateConversationFromHero?: (
    conversationId: string,
    initialMessage: string
  ) => void;
  initialFile?: File | null;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  conversationId,
  sessionId: propSessionId,
  onNewConversation,
  onCreateConversationFromHero,
  initialFile,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestedQueries, setSuggestedQueries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const sessionId = propSessionId || searchParams.get("sessionId");
  const contextId = conversationId || sessionId;

  // --- Load lịch sử chat ---
  useEffect(() => {
    const loadData = async () => {
      if (contextId) {
        setIsLoading(true);
        try {
          const history = await chatService.getChatHistory(contextId);
          setMessages(history);
        } catch (error) {
          console.error("Lỗi tải lịch sử chat:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setMessages([]);
        try {
          const queries = await chatService.getSuggestedQueries();
          setSuggestedQueries(queries);
        } catch (error) {
          console.error("Lỗi tải gợi ý:", error);
        }
      }
    };
    loadData();
  }, [contextId]);

  // --- Khi có initialFile, tự động gửi để bắt đầu chat ---
  useEffect(() => {
    if (initialFile) {
      handleSendMessage(`Phân tích file: ${initialFile.name}`, initialFile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFile]);

  // --- Logic gửi tin nhắn ---
  const handleSendMessage = async (messageText: string, file?: File) => {
    if ((!messageText.trim() && !file) || isReplying) return;
    setIsReplying(true);

    if (!contextId && messages.length === 0) {
      if (!user) {
        // --- Guest ---
        try {
          const { sessionId: newSessionId } =
            await chatService.startGuestSession({
              message: messageText,
              file: file || undefined,
            });

          setSearchParams({ sessionId: newSessionId });
          const history = await chatService.getChatHistory(newSessionId);
          setMessages(history);
        } catch (error) {
          console.error("Lỗi khởi tạo Guest session:", error);
          alert("Không thể bắt đầu phiên chat. Vui lòng thử lại.");
          setIsReplying(false);
        } finally {
          setIsReplying(false);
        }
      } else {
        // --- User ---
        try {
          const newConversation = await chatService.createNewConversation({
            title: messageText.substring(0, 50),
            initialMessage: messageText,
            file: file || undefined,
          });
          const newConvId = newConversation.id;

          if (onCreateConversationFromHero) {
            onCreateConversationFromHero(newConvId, messageText);
          } else if (onNewConversation) {
            onNewConversation(newConversation);
          }

          const history = await chatService.getChatHistory(newConvId);
          setMessages(history);
        } catch (error) {
          console.error("Lỗi tạo User conversation:", error);
          alert("Không thể tạo cuộc trò chuyện mới.");
          setIsReplying(false);
        } finally {
          setIsReplying(false);
        }
      }
      return;
    }

    if (file) {
      await handleSendMessageWithFile(messageText, file);
    } else {
      await handleSendMessageTextOnly(messageText);
    }
  };

  const handleSendMessageWithFile = async (messageText: string, file: File) => {
    setIsReplying(true);
    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      text: messageText || `Phân tích file: ${file.name}`,
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
        conversationId,
        sessionId,
      });
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsReplying(false);
    }
  };

  const handleSendMessageTextOnly = async (messageText: string) => {
    if (!contextId) return;
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
      if (conversationId) {
        // ✨ Fixed: sendMessage không nhận onChunk nữa
        await chatService.sendMessage(conversationId, messageText);

        // Tải lại chat history để lấy AI response
        const history = await chatService.getChatHistory(conversationId);
        setMessages(history);
      } else if (sessionId) {
        // Guest session
        await chatService.sendMessage(sessionId, messageText);
        const history = await chatService.getChatHistory(sessionId);
        setMessages(history);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsReplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Nếu chưa có tin nhắn, hiển thị Hero */}
      {messages.length === 0 ? (
        <Hero onStartChat={handleSendMessage} />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto">
            {messages.length > 0 ? (
              <MessageList messages={messages} isReplying={isReplying} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <SuggestedQueries
                  queries={suggestedQueries}
                  onQueryClick={(q) => handleSendMessage(q)}
                  isLoading={isReplying}
                />
              </div>
            )}
          </div>
          <ChatInput onSendMessage={handleSendMessage} isLoading={isReplying} />
        </>
      )}
    </div>
  );
};
