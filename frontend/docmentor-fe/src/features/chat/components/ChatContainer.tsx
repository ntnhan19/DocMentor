// src/features/chat/components/ChatContainer.tsx - UPDATED for Backend with Upload Logic
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { ChatMessage, Conversation } from "@/types/chat.types";
import { chatService } from "@/services/chat/chatService";
import { queryApiService } from "@/services/api/queryApiService";
import { documentService } from "@/services/document/documentService"; // ✨ Import DocumentService
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { SuggestedQueries } from "./SuggestedQuestions";
import Button from "@/components/common/Button";
import { useAuth } from "@/app/providers/AuthProvider";
import HeroChat from "@/features/chat/components/HeroChat";

interface ChatContainerProps {
  conversationId: string | null;
  sessionId: string | null;
  initialFile?: File | null;
  selectedDocuments?: Array<{ id: string; title: string }>;
  onOpenDocumentModal?: () => void;
  onRemoveDocument?: (docId: string) => void;
  onCreateConversationFromHeroChat?: (
    conversationId: string,
    initialMessage: string,
    documentIds?: string[] // ✨ Cập nhật type để nhận documentIds
  ) => void;
  onNewConversation?: (conversation: Conversation) => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  conversationId,
  sessionId: propSessionId,
  onNewConversation,
  onCreateConversationFromHeroChat,
  initialFile,
  selectedDocuments = [],
  onOpenDocumentModal,
  onRemoveDocument,
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
          setMessages([]);
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
    if (initialFile && messages.length === 0) {
      handleSendMessage(`Phân tích file: ${initialFile.name}`, initialFile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFile]);

  // --- Logic gửi tin nhắn ---
  const handleSendMessage = async (messageText: string, file?: File) => {
    if ((!messageText.trim() && !file) || isReplying) return;
    setIsReplying(true);

    // ✨ Logic Upload File Mới (Fix lỗi 422 cho Hero Chat)
    let uploadedDocId: number | null = null;
    if (file) {
      try {
        // Upload file lên server để lấy ID
        console.log("📂 Đang upload file:", file.name);
        const uploadedDoc = await documentService.uploadDocument(
          file,
          file.name
        );
        uploadedDocId = Number(uploadedDoc.id);
        console.log("✅ Upload thành công. ID:", uploadedDocId);
      } catch (error) {
        console.error("Upload error:", error);
        alert("Lỗi tải file lên. Vui lòng thử lại.");
        setIsReplying(false);
        return;
      }
    }

    // ✨ CASE 1: Chưa có conversation, cần tạo mới
    if (!contextId && messages.length === 0) {
      if (!user) {
        // --- Guest Session ---
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
        // --- User Conversation ---
        try {
          // Lấy ID các tài liệu đã chọn từ Modal
          const docIds = selectedDocuments
            .map((d) => parseInt(d.id, 10))
            .filter((id) => !isNaN(id));

          // ✨ Thêm ID của file vừa upload (nếu có) vào danh sách
          if (uploadedDocId !== null) {
            docIds.push(uploadedDocId);
          }

          // Chuyển mảng số thành mảng chuỗi để tương thích với documentIds?: string[] của callback
          const stringDocIds = docIds.map(String);

          const newConversation = await chatService.createNewConversation({
            title: messageText.substring(0, 50) || "Cuộc trò chuyện mới",
            initialMessage: messageText,
            file: undefined, // File đã được xử lý upload ở trên
            documentIds: docIds, // Gửi mảng ID đầy đủ
          });
          const newConvId = newConversation.id;

          if (onCreateConversationFromHeroChat) {
            onCreateConversationFromHeroChat(
              newConvId,
              messageText,
              stringDocIds
            );
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

    // ✨ CASE 2: Có conversation rồi
    if (file) {
      await handleSendMessageWithFile(messageText, file);
    } else {
      await handleSendMessageTextOnly(messageText);
    }
  };

  // ✨ UPDATED: Send Message With File
  const handleSendMessageWithFile = async (messageText: string, file: File) => {
    setIsReplying(true);
    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      text: messageText || `Phân tích file: ${file.name}`,
      sender: "user",
      timestamp: new Date().toISOString(),
      status: "sending", // Đổi status thành sending để hiển thị UI loading nếu cần
      attachment: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      },
    };

    // Show user message immediately
    setMessages((prev) => [...prev, userMessage]);

    try {
      // ✨ 1. Upload file trước
      console.log("📂 Đang upload file trong chat:", file.name);
      const uploadedDoc = await documentService.uploadDocument(file, file.name);
      const uploadedDocId = Number(uploadedDoc.id);
      console.log("✅ Upload chat file thành công. ID:", uploadedDocId);

      // ✨ 2. Tổng hợp ID tài liệu
      const docIds = selectedDocuments
        .map((d) => parseInt(d.id, 10))
        .filter((id) => !isNaN(id));

      if (conversationId) {
        docIds.push(parseInt(conversationId, 10));
      }

      // Thêm ID file mới vào
      if (!isNaN(uploadedDocId)) {
        docIds.push(uploadedDocId);
      }

      // ✨ 3. Gửi query
      const response = await queryApiService.sendQuery(
        messageText || `Phân tích file: ${file.name}`,
        docIds,
        5
      );

      // Update user message status to sent
      setMessages((prev) =>
        prev.map((m) =>
          m.id === userMessage.id ? { ...m, status: "sent" } : m
        )
      );

      // Add AI response
      const aiMessage: ChatMessage = {
        id: `msg-ai-${response.query_id}`,
        text: response.answer,
        sender: "ai",
        timestamp: response.created_at,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("❌ Send file error:", error);
      alert("Lỗi gửi file. Vui lòng thử lại.");
      setMessages((prev) =>
        prev.map((m) =>
          m.id === userMessage.id ? { ...m, status: "error" } : m
        )
      );
    } finally {
      setIsReplying(false);
    }
  };

  // ✨ UPDATED: Send Message Text Only
  const handleSendMessageTextOnly = async (messageText: string) => {
    if (!contextId) return;

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      text: messageText,
      sender: "user",
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    // Show user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setIsReplying(true);

    try {
      // ✨ UPDATED: Gửi query với document IDs
      const docIds = selectedDocuments
        .map((d) => parseInt(d.id, 10))
        .filter((id) => !isNaN(id));

      if (conversationId) {
        docIds.push(parseInt(conversationId, 10));
      }

      const response = await queryApiService.sendQuery(messageText, docIds, 5);

      // ✨ UPDATED: Add AI response
      const aiMessage: ChatMessage = {
        id: `msg-ai-${response.query_id}`,
        text: response.answer,
        sender: "ai",
        timestamp: response.created_at,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("❌ Send message error:", error);
      alert("Lỗi gửi tin nhắn. Vui lòng thử lại.");
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
      {/* ✨ Selected Documents Header */}
      {selectedDocuments.length > 0 && (
        <div className="border-b border-primary/20 bg-accent/40 backdrop-blur-sm p-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-text-muted">
                Đang chat với{" "}
                <span className="font-bold text-primary">
                  {selectedDocuments.length}
                </span>{" "}
                tài liệu
              </p>
              <Button
                onClick={onOpenDocumentModal}
                className="text-sm px-3 py-1.5 bg-primary/20 border border-primary/30 rounded-lg text-primary hover:bg-primary/30 transition-colors flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Thêm tài liệu
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-accent/80 border border-primary/30 rounded-lg px-3 py-1.5 flex items-center gap-2 text-sm text-white"
                >
                  <span className="truncate max-w-xs">{doc.title}</span>
                  <button
                    onClick={() => onRemoveDocument?.(doc.id)}
                    className="text-text-muted hover:text-white transition-colors font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      {messages.length === 0 ? (
        <HeroChat onStartChat={handleSendMessage} />
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
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isReplying}
            onOpenDocumentModal={onOpenDocumentModal}
          />
        </>
      )}
    </div>
  );
};
